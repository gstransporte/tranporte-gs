document.addEventListener('DOMContentLoaded', () => {
  // =========================
  // Configuración WhatsApp
  // =========================
  const WHATSAPP_NUMBER = '50700000000'; // Solo números con código de país

  function getWhatsAppLink(message = '') {
    const base = `https://wa.me/${WHATSAPP_NUMBER}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
  }

  // Reemplaza todos los [data-whatsapp]
  document.querySelectorAll('[data-whatsapp]').forEach(el => {
    const msg = el.dataset.whatsapp || '';
    el.setAttribute('href', getWhatsAppLink(msg));
  });

  // =========================
  // Menú móvil drop-down (#navDrop)
  // =========================
  const hamb  = document.querySelector('.hamb');
  const drop  = document.getElementById('navDrop');

  function setOpen(open) {
    if (!drop || !hamb) return;
    drop.classList.toggle('open', open);
    hamb.setAttribute('aria-expanded', open ? 'true' : 'false');
    drop.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.documentElement.classList.toggle('menu-open', open);
  }

  hamb?.addEventListener('click', () => setOpen(!drop.classList.contains('open')));
  drop?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

  // =========================
  // Reveal on scroll
  // =========================
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('show');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // =========================
  // Formulario (mailto)
  // =========================
  const form = document.getElementById('form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      if (!data.nombre || !data.correo) {
        alert('Por favor complete nombre y correo.');
        return;
      }
      const subject = encodeURIComponent(`Solicitud de transporte — ${data.empresa || 'Particular'}`);
      const body = encodeURIComponent(
`Nombre: ${data.nombre}
Empresa: ${data.empresa || '-'}
Teléfono: ${data.telefono || '-'}
Correo: ${data.correo}
Servicio: ${data.servicio}

Mensaje:
${data.mensaje || ''}`
      );
      window.location.href = `mailto:josejulian0916@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  // =========================
  // Año en footer
  // =========================
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // =========================
  // Carrusel: navegación con teclado
  // =========================
  document.querySelectorAll('.carousel-track').forEach(track => {
    track.setAttribute('tabindex', '0');
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') track.scrollBy({ left: 300, behavior: 'smooth' });
      if (e.key === 'ArrowLeft')  track.scrollBy({ left: -300, behavior: 'smooth' });
    });
  });

  // =========================
  // Scroll suave con offset del header
  // =========================
  const prefersNoMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function smoothScrollTo(hash) {
    const target = document.querySelector(hash);
    if (!target) return;
    const header = document.querySelector('.nav');
    const offset = (header?.offsetHeight || 0) + 8;
    const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: y, behavior: prefersNoMotion ? 'auto' : 'smooth' });
  }
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const hash = a.getAttribute('href');
      if (!hash || hash === '#') return;
      e.preventDefault();
      smoothScrollTo(hash);
    });
  });
});
