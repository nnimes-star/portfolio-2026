const THEME_KEY = 'portfolio-theme';

function applyTheme(theme) {
  document.body.classList.toggle('light', theme === 'light');
  document.querySelectorAll('.theme-icon').forEach(el => {
    el.textContent = theme === 'light' ? '🌙' : '☀️';
  });
  document.querySelectorAll('.theme-label').forEach(el => {
    el.textContent = theme === 'light' ? 'Dark' : 'Light';
  });
}

function toggleTheme() {
  const current = localStorage.getItem(THEME_KEY) || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

(function () {
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(saved);
})();

function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 90);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

function setActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    a.classList.toggle('active', href === current);
  });
}

function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-bar-fill').forEach((bar, i) => {
          setTimeout(() => {
            bar.style.width = bar.dataset.width;
          }, i * 120);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-group').forEach(g => obs.observe(g));
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('[required]').forEach(field => {
      const err = field.nextElementSibling;
      if (!field.value.trim()) {
        field.classList.add('error');
        if (err && err.classList.contains('field-error')) err.style.display = 'block';
        valid = false;
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        field.classList.add('error');
        if (err && err.classList.contains('field-error')) {
          err.textContent = 'Please enter a valid email address.';
          err.style.display = 'block';
        }
        valid = false;
      } else {
        field.classList.remove('error');
        if (err && err.classList.contains('field-error')) err.style.display = 'none';
      }
    });

    if (valid) {
      const btn = form.querySelector('.btn-submit');
      btn.textContent = 'Message sent ✓';
      btn.style.background = '#6dbf67';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Send message →';
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    }
  });

  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('error');
      const err = field.nextElementSibling;
      if (err && err.classList.contains('field-error')) err.style.display = 'none';
    });
  });
}

function initFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.opacity = show ? '1' : '0.25';
        card.style.transform = show ? 'scale(1)' : 'scale(0.97)';
        card.style.pointerEvents = show ? '' : 'none';
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initReveal();
  initSkillBars();
  initContactForm();
  initFilter();
});
