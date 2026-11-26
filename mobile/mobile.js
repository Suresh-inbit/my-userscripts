  /* ------------------------------------------------------------------ *
   * 5e. Mobile layer (only present in iitm-placement-mobile.js)
   *     Labels every table cell with its column heading so the CSS can show each row as a card
   *     (this also covers pages we haven't seen, e.g. the Walk-in tab), and adds a back-to-top button.
   * ------------------------------------------------------------------ */
  function mobileRefresh() {
    if (!document.querySelector('meta[name="viewport"]')) {
      const m = document.createElement('meta'); m.name = 'viewport'; m.content = 'width=device-width, initial-scale=1';
      (document.head || root()).appendChild(m);
    }
    const q = document.getElementById('x-search');
    if (q && q.placeholder.includes('(press /)')) q.placeholder = q.placeholder.replace(' (press /)', '');
    $$('table.table').forEach(t => {
      const heads = $$('thead th', t).map(th => {
        const c = th.cloneNode(true); c.querySelectorAll('.x-arrow').forEach(n => n.remove());
        return c.textContent.replace(/\s+/g, ' ').trim();
      });
      if (!heads.length) return;
      t.classList.add('x-cards');
      $$('tbody tr', t).forEach(tr => Array.from(tr.children).forEach((td, ix) => {
        if (td.tagName !== 'TD') return;
        td.dataset.label = heads[ix] || '';
        const txt = td.textContent.replace(/\s+/g, ' ').trim();
        td.classList.toggle('x-empty', !td.querySelector('a,button,input,img') && (txt === '' || /^[-–—]+$/.test(txt)));
      }));
    });
    if (document.body && !document.getElementById('x-top')) {
      const b = document.createElement('button');
      b.id = 'x-top'; b.className = 'x-top'; b.type = 'button'; b.textContent = '↑'; b.title = 'Back to top';
      b.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
      document.body.appendChild(b);
      window.addEventListener('scroll', () => b.classList.toggle('show', window.scrollY > 600), { passive: true });
    }
  }
