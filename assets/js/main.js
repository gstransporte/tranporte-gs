document.addEventListener('DOMContentLoaded', () => {
  // =========================
  // Configuración WhatsApp
  // =========================
  const WHATSAPP_NUMBER = '50763794292';
  function getWhatsAppLink(message = '') {
    const base = `https://wa.me/${WHATSAPP_NUMBER}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
  }
  document.querySelectorAll('[data-whatsapp]').forEach(el => {
    const msg = el.dataset.whatsapp || '';
    el.setAttribute('href', getWhatsAppLink(msg));
  });

  // =========================
  // Menú móvil drop-down
  // =========================
  const hamb = document.querySelector('.hamb');
  const drop = document.getElementById('navDrop');
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
      window.location.href = `mailto:transpgs@hotmail.es?subject=${subject}&body=${body}`;
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
      if (e.key === 'ArrowLeft') track.scrollBy({ left: -300, behavior: 'smooth' });
    });
  });

  // === Carrusel de clientes infinito ===
  const container = document.querySelector('.clientes-carousel');
  const track = document.getElementById('clientesTrack');

  if (container && track) {
    const SPEED_PX_PER_SEC = 50;

    function imagesReady(node) {
      const imgs = Array.from(node.querySelectorAll('img'));
      return Promise.all(imgs.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(res => img.addEventListener('load', res, { once: true }));
      }));
    }

    function measureSetWidth(nodes) {
      let w = 0;
      nodes.forEach(el => {
        const cs = getComputedStyle(el);
        w += el.getBoundingClientRect().width + parseFloat(cs.marginRight || '0');
      });
      return w;
    }

    async function setup() {
      track.style.removeProperty('--clientes-distance');
      track.style.removeProperty('--clientes-duration');

      // conservar solo el set original
      const originals = Array.from(track.querySelectorAll('img')).filter(i => !i.dataset.clone);
      track.innerHTML = '';
      originals.forEach(i => track.appendChild(i));

      // esperar a que carguen las imágenes para medir bien
      await imagesReady(track);

      const firstSetWidth = measureSetWidth(originals);
      const needTotal = firstSetWidth + container.clientWidth;

      // clonar hasta cubrir
      while (track.scrollWidth < needTotal && originals.length) {
        originals.forEach(img => {
          const clone = img.cloneNode(true);
          clone.dataset.clone = '1';
          track.appendChild(clone);
        });
      }

      const duration = firstSetWidth / SPEED_PX_PER_SEC;
      track.style.setProperty('--clientes-distance', firstSetWidth + 'px');
      track.style.setProperty('--clientes-duration', duration + 's');
    }

    // inicial y on-resize
    setup();
    let t;
    window.addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(setup, 120);
    });
  }

});
