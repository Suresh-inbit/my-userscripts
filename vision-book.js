// ==UserScript==
// @name         Vision Book — Modern Reader
// @namespace    suresh.visionbook
// @version      1.1
// @description  Restyles visionbook.mit.edu (Quarto): figure cards, boxed equations, better typography, reading progress, figure zoom. Follows the site's own light/dark toggle.
// @match        https://visionbook.mit.edu/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  /* ---------- fonts ---------- */
  const font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = 'https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';
  document.head.appendChild(font);

  /* ---------- styles ---------- */
  const css = `
  :root{
    --vb-bg:#f7f5f0; --vb-paper:#fffdf8; --vb-ink:#1f2328; --vb-muted:#6b6f76; --vb-rule:#e6e1d6;
    --vb-accent:#b4532a; --vb-accent-soft:#f6e6dc; --vb-eq:#f1ede3; --vb-shadow:rgba(60,40,20,.12);
  }
  body.quarto-dark{
    --vb-bg:#14161c; --vb-paper:#1b1e26; --vb-ink:#e4e4e2; --vb-muted:#9a9ea8; --vb-rule:#2c303b;
    --vb-accent:#e8875a; --vb-accent-soft:#3a2a22; --vb-eq:#20242e; --vb-shadow:rgba(0,0,0,.45);
  }

  /* base */
  body{background:var(--vb-bg)!important;color:var(--vb-ink)!important;-webkit-font-smoothing:antialiased}
  #quarto-document-content, main.content{
    font-family:"Source Serif 4",Georgia,serif!important;font-size:18.5px!important;line-height:1.75!important;color:var(--vb-ink)!important}
  #quarto-document-content p{hyphens:auto;margin-bottom:1.1em}
  #quarto-document-content a:not(.anchorjs-link){color:var(--vb-accent)!important;text-decoration:none;
    border-bottom:1px solid color-mix(in srgb,var(--vb-accent) 30%,transparent)}
  #quarto-document-content a:not(.anchorjs-link):hover{border-bottom-color:var(--vb-accent)}

  /* reading progress */
  #vb-progress{position:fixed;top:0;left:0;height:3px;width:0;background:var(--vb-accent);z-index:2000;transition:width .1s linear}

  /* title block */
  .quarto-title h1.title, header#title-block-header h1{
    font-family:"Source Serif 4",Georgia,serif!important;font-weight:700!important;
    font-size:clamp(2.2rem,5vw,3.1rem)!important;line-height:1.08!important;letter-spacing:-.015em;margin:.2em 0 .6em!important}
  .quarto-title .chapter-number, h1 .chapter-number{
    display:block;font:600 13px/1 Inter,sans-serif!important;letter-spacing:.16em;text-transform:uppercase;
    color:var(--vb-accent)!important;margin-bottom:.6em}
  .quarto-title .chapter-number::before{content:"Chapter "}
  .quarto-page-breadcrumbs, .breadcrumb{font:500 13px Inter,sans-serif!important}

  /* headings */
  #quarto-document-content h2, #quarto-document-content h3, #quarto-document-content h4{
    font-family:"Source Serif 4",Georgia,serif!important;color:var(--vb-ink)!important;letter-spacing:-.01em}
  #quarto-document-content h2{font-size:1.9rem!important;margin-top:2.2em!important;padding-bottom:.35em;
    border-bottom:1px solid var(--vb-rule)!important}
  #quarto-document-content h3{font-size:1.4rem!important;margin-top:1.8em!important}
  .header-section-number{color:var(--vb-accent)!important;font-weight:600;margin-right:.35em;
    font-family:Inter,sans-serif;font-size:.78em;vertical-align:.08em}

  /* figures as cards */
  .vb-card{background:var(--vb-paper)!important;border:1px solid var(--vb-rule)!important;border-radius:14px;
    padding:18px 18px 12px!important;margin:2em 0!important;box-shadow:0 10px 30px -18px var(--vb-shadow)}
  .vb-subcard{background:var(--vb-paper)!important;border:1px solid var(--vb-rule)!important;border-radius:12px;
    padding:12px 12px 6px!important}
  .vb-card .vb-subcard{border-color:transparent!important;padding:4px!important}
  .margin-caption, figcaption.margin-caption{border-top:0!important;padding-top:0!important}
  #quarto-document-content figure img, #quarto-document-content .quarto-figure img{
    border-radius:8px;cursor:zoom-in;max-width:100%;height:auto}
  body.quarto-dark #quarto-document-content figure img{background:#f4f2ec;padding:4px}
  #quarto-document-content figcaption, #quarto-document-content .figure-caption, #quarto-document-content .quarto-float-caption{
    font:400 14.5px/1.55 Inter,system-ui,sans-serif!important;color:var(--vb-muted)!important;
    margin-top:12px!important;padding-top:10px;border-top:1px dashed var(--vb-rule);text-align:left!important}
  .quarto-subfloat-fig figcaption, .quarto-layout-cell figcaption{border-top:0!important;text-align:center!important;padding-top:0}
  .vb-label{display:inline-block;font-weight:600;color:var(--vb-accent);background:var(--vb-accent-soft);
    border-radius:6px;padding:0 7px;margin-right:6px;font-size:.92em}

  /* display equations */
  #quarto-document-content span.math.display, #quarto-document-content mjx-container[display="true"],
  #quarto-document-content .katex-display{
    display:block;background:var(--vb-eq);border-left:3px solid var(--vb-accent);border-radius:0 10px 10px 0;
    padding:12px 18px!important;margin:1.4em 0!important;overflow-x:auto;overflow-y:hidden}
  #quarto-document-content span.math.display mjx-container[display="true"],
  #quarto-document-content span.math.display .katex-display{background:none;border:0;padding:0!important;margin:0!important}
  [id^="eq-"]:target span.math.display{box-shadow:0 0 0 2px var(--vb-accent)}

  /* tables */
  #quarto-document-content table{font:15px/1.5 Inter,sans-serif;border-collapse:separate!important;border-spacing:0;
    border:1px solid var(--vb-rule);border-radius:10px;overflow:hidden;background:var(--vb-paper)}
  #quarto-document-content table th{background:var(--vb-accent-soft)!important;color:var(--vb-ink)!important;font-weight:600}
  #quarto-document-content table td, #quarto-document-content table th{padding:8px 14px!important;border-color:var(--vb-rule)!important}
  #quarto-document-content table tbody tr:nth-child(even){background:color-mix(in srgb,var(--vb-eq) 60%,transparent)}

  /* citations + references */
  a[role="doc-biblioref"]{font:600 .75em Inter,sans-serif;background:var(--vb-accent-soft);border:0!important;
    border-radius:999px;padding:.05em .45em;vertical-align:.12em}
  #refs .csl-entry, .references .csl-entry{font:14.5px/1.55 Inter,sans-serif;padding:10px 14px;margin:8px 0;
    background:var(--vb-paper);border:1px solid var(--vb-rule);border-radius:10px}
  #refs .csl-left-margin{color:var(--vb-accent);font-weight:600}

  /* inline + block code (in case some chapters have it) */
  #quarto-document-content code:not(pre code){font-family:"JetBrains Mono",monospace;font-size:.84em;
    background:var(--vb-accent-soft)!important;color:var(--vb-accent)!important;padding:.08em .36em;border-radius:5px}
  #quarto-document-content div.sourceCode, #quarto-document-content pre{
    background:#1e2230!important;color:#e3e6ee!important;border-radius:12px!important;border:1px solid #323850!important;
    font:14px/1.6 "JetBrains Mono",monospace}

  /* blockquotes / callouts */
  #quarto-document-content blockquote{background:var(--vb-eq);border-left:4px solid var(--vb-accent)!important;
    border-radius:0 10px 10px 0;padding:.9em 1.2em;font-style:italic;color:var(--vb-ink)}
  #quarto-document-content .callout{border-radius:12px!important;overflow:hidden}

  /* left sidebar */
  #quarto-sidebar{background:var(--vb-bg)!important;font-family:Inter,system-ui,sans-serif!important}
  #quarto-sidebar .sidebar-item-text, #quarto-sidebar .menu-text{font-size:14px}
  #quarto-sidebar .sidebar-link{border-radius:8px;padding:3px 8px!important;transition:background .15s}
  #quarto-sidebar .sidebar-link:hover{background:var(--vb-accent-soft)}
  #quarto-sidebar .sidebar-link.active{background:var(--vb-accent-soft)!important;color:var(--vb-accent)!important;font-weight:600}
  #quarto-sidebar .sidebar-link.active *{color:var(--vb-accent)!important}
  #quarto-sidebar .sidebar-section > .sidebar-item-container .menu-text{font-weight:600;letter-spacing:.02em}

  /* right "on this page" */
  #quarto-margin-sidebar, #TOC{font-family:Inter,system-ui,sans-serif!important;font-size:13.5px}
  #TOC h2, #toc-title{font:600 11px Inter,sans-serif!important;letter-spacing:.14em;text-transform:uppercase;color:var(--vb-muted)!important}
  #TOC a.nav-link{color:var(--vb-muted)!important;border-left:2px solid transparent!important}
  #TOC a.nav-link.active{color:var(--vb-accent)!important;border-left-color:var(--vb-accent)!important;font-weight:600}

  /* prev / next */
  nav.page-navigation{display:grid!important;grid-template-columns:1fr 1fr;gap:12px;margin-top:3em!important;border:0!important}
  nav.page-navigation > div{border:1px solid var(--vb-rule);border-radius:12px;background:var(--vb-paper);padding:14px 16px;
    font:500 14px/1.4 Inter,sans-serif;transition:border-color .15s}
  nav.page-navigation > div:hover{border-color:var(--vb-accent)}
  nav.page-navigation .nav-page-previous::before{content:"← Previous";display:block;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--vb-muted)}
  nav.page-navigation .nav-page-next::before{content:"Next →";display:block;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--vb-muted);text-align:right}
  nav.page-navigation .nav-page-next{text-align:right}
  nav.page-navigation > div:empty{visibility:hidden}

  /* lightbox */
  #vb-lightbox{position:fixed;inset:0;z-index:3000;background:rgba(10,10,14,.86);display:none;
    align-items:center;justify-content:center;padding:24px;cursor:zoom-out}
  #vb-lightbox.open{display:flex}
  #vb-lightbox img{max-width:96vw;max-height:88vh;border-radius:10px;background:#f4f2ec;box-shadow:0 20px 60px rgba(0,0,0,.5)}
  #vb-lightbox p{position:absolute;bottom:16px;left:16px;right:16px;margin:0;text-align:center;
    color:#ddd;font:14px/1.5 Inter,sans-serif}
  `;
  const style = document.createElement('style');
  style.id = 'vb-style';
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- reading progress bar ---------- */
  const bar = document.createElement('div');
  bar.id = 'vb-progress';
  document.body.appendChild(bar);
  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- "Figure 6.1:" / "Table 6.1:" caption labels ---------- */
  function labelCaptions() {
    document.querySelectorAll('#quarto-document-content figcaption, #quarto-document-content .quarto-float-caption')
      .forEach(cap => {
        if (cap.dataset.vb) return;
        cap.dataset.vb = '1';
        const walker = document.createTreeWalker(cap, NodeFilter.SHOW_TEXT);
        const node = walker.nextNode();
        if (!node) return;
        const m = node.nodeValue.match(/^(\s*)((Figure|Table|Fig\.)\s+[\d.]+[a-z]?)(:?\s*)/);
        if (!m) return;
        const span = document.createElement('span');
        span.className = 'vb-label';
        span.textContent = m[2];
        node.nodeValue = node.nodeValue.slice(m[0].length);
        node.parentNode.insertBefore(span, node);
      });
  }
  labelCaptions();

  /* ---------- figure cards: only around figures that fit the text column ---------- */
  function cardFigures() {
    const root = document.getElementById('quarto-document-content');
    if (!root) return;
    const p = root.querySelector(':scope > section p, :scope > p');
    const colW = p ? p.getBoundingClientRect().width : root.getBoundingClientRect().width;
    const SEL = '.quarto-float, .quarto-figure, figure.figure';

    root.querySelectorAll(SEL).forEach(el => {
      el.classList.remove('vb-card', 'vb-subcard');
    });
    root.querySelectorAll(SEL).forEach(el => {
      const outer = el.parentElement && el.parentElement.closest(SEL);
      const isSub = el.closest('.quarto-subfloat-fig, .quarto-layout-cell') && outer;
      const wide = el.getBoundingClientRect().width > colW * 1.12 ||
                   el.matches('.page-columns, .page-full, [class*="column-page"], [class*="column-screen"]') ||
                   el.querySelector(':scope > .margin-caption, :scope > figcaption.margin-caption, :scope > figure > figcaption.margin-caption');
      if (isSub) { el.classList.add('vb-subcard'); return; }
      if (outer && outer.classList.contains('vb-card')) return;     // already inside a card
      if (outer && !wide) return;                                     // let the outermost fitting one be the card
      if (!wide) el.classList.add('vb-card');
    });
  }
  cardFigures();
  addEventListener('load', cardFigures);
  addEventListener('resize', () => { clearTimeout(cardFigures.t); cardFigures.t = setTimeout(cardFigures, 200); });

  /* ---------- click figure to zoom ---------- */
  const lb = document.createElement('div');
  lb.id = 'vb-lightbox';
  lb.innerHTML = '<img alt=""><p></p>';
  document.body.appendChild(lb);
  lb.addEventListener('click', () => lb.classList.remove('open'));
  addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('open'); });
  document.addEventListener('click', e => {
    const img = e.target.closest('#quarto-document-content figure img, #quarto-document-content .quarto-figure img');
    if (!img || img.closest('a[href]:not([href$=".png"]):not([href$=".jpg"]):not([href$=".svg"])')) return;
    e.preventDefault();
    lb.querySelector('img').src = img.currentSrc || img.src;
    const cap = img.closest('figure, .quarto-figure, .quarto-float')?.querySelector('figcaption');
    lb.querySelector('p').textContent = cap ? cap.textContent.trim() : '';
    lb.classList.add('open');
  }, true);

  /* re-run caption labels if Quarto/MathJax re-renders anything */
  new MutationObserver(() => { clearTimeout(labelCaptions.t); labelCaptions.t = setTimeout(labelCaptions, 300); })
    .observe(document.getElementById('quarto-document-content') || document.body, { childList: true, subtree: true });
})();
