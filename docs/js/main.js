/* ============================================================
   AgroAlerta Docs – main.js
   Sidebar nav, highlight.js, copy-to-clipboard, FAQ accordion
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Syntax highlighting ────────────────────────────────────
  hljs.highlightAll();

  // ── Copy to clipboard ──────────────────────────────────────
  document.querySelectorAll('pre').forEach(pre => {
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.innerHTML = '<i class="fas fa-copy"></i> Copiar';
    pre.appendChild(btn);

    btn.addEventListener('click', () => {
      const code = pre.querySelector('code');
      navigator.clipboard.writeText(code.innerText.trim()).then(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Copiado';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = '<i class="fas fa-copy"></i> Copiar';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  });

  // ── FAQ accordion ──────────────────────────────────────────
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── Mobile sidebar ─────────────────────────────────────────
  const menuBtn  = document.getElementById('menuBtn');
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('overlay');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  }

  if (menuBtn)  menuBtn.addEventListener('click', openSidebar);
  if (overlay)  overlay.addEventListener('click', closeSidebar);

  // Close sidebar when a nav link is clicked (mobile)
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeSidebar();
    });
  });

  // ── Active nav link on scroll ──────────────────────────────
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -70% 0px'
  });

  sections.forEach(s => observer.observe(s));

});
