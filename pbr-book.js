// ==UserScript==
// @name         PBR Book — Modern Reader
// @namespace    suresh.pbrbook
// @version      1.0
// @description  Restyles pbr-book.org: boxed, syntax-tinted code fragments with headers, copy buttons, nicer typography, dark mode.
// @match        https://www.pbr-book.org/*
// @match        https://pbr-book.org/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  /* ---------- fonts ---------- */
  const font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = 'https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=Inter:wght@500;600&family=JetBrains+Mono:wght@400;500&display=swap';
  document.head.appendChild(font);

  /* ---------- styles ---------- */
  const css = `
  :root{
    --lp-bg:#f7f5f0; --lp-paper:#fffdf8; --lp-ink:#1f2328; --lp-muted:#6b6f76; --lp-rule:#e6e1d6;
    --lp-accent:#b4532a; --lp-accent-soft:#f6e6dc;
    --lp-code-bg:#1e2230; --lp-code-head:#272c3d; --lp-code-ink:#e3e6ee; --lp-code-border:#323850;
    --lp-ref:#89ddff; --lp-gold:#ffcb6b;
  }
  html.lp-dark{
    --lp-bg:#14161c; --lp-paper:#1a1d25; --lp-ink:#e4e4e2; --lp-muted:#9a9ea8; --lp-rule:#2c303b;
    --lp-accent:#e8875a; --lp-accent-soft:#3a2a22;
    --lp-code-bg:#0f1117; --lp-code-head:#181b24; --lp-code-border:#2a2f3d;
  }
  html, body{background:var(--lp-bg)!important;color:var(--lp-ink)!important}
  body{font-family:"Source Serif 4",Georgia,serif!important;font-size:18px!important;line-height:1.72!important;
       -webkit-font-smoothing:antialiased}
  body p{hyphens:auto}
  h1,h2,h3,h4{font-family:"Source Serif 4",Georgia,serif!important;color:var(--lp-ink)!important;letter-spacing:-.01em}
  h2{font-size:2.2rem!important;line-height:1.15!important;margin:.6em 0 .5em!important}
  h3{font-size:1.45rem!important;margin-top:1.6em!important}
  a{color:var(--lp-accent)}
  nav, .navbar{background:color-mix(in srgb,var(--lp-bg) 88%,transparent)!important;backdrop-filter:blur(8px);
       border-bottom:1px solid var(--lp-rule)!important;font-family:Inter,system-ui,sans-serif!important}
  nav a, .navbar a{color:var(--lp-ink)!important}

  /* inline code */
  body tt, body code:not(.lp-card code), body span.code, body .inlinecode{
    font-family:"JetBrains Mono",monospace!important;font-size:.82em!important;
    background:var(--lp-accent-soft)!important;color:var(--lp-accent)!important;
    padding:.08em .36em;border-radius:5px;white-space:nowrap}

  /* code card */
  .lp-card{margin:1.6em 0!important;border-radius:12px;overflow:hidden;background:var(--lp-code-bg)!important;
    border:1px solid var(--lp-code-border);box-shadow:0 6px 24px -12px rgba(0,0,0,.35)}
  .lp-head{display:flex;align-items:center;gap:10px;padding:8px 14px;background:var(--lp-code-head);
    border-bottom:1px solid var(--lp-code-border);font:500 13px/1.3 "JetBrains Mono",monospace;color:#c9cfdd}
  .lp-head .lp-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .lp-head .lp-name, .lp-head .lp-name *{color:#e6e9f2!important;background:none!important;text-decoration:none!important}
  .lp-head a{color:#9be3b5!important}
  .lp-dots{display:flex;gap:6px}.lp-dots i{width:10px;height:10px;border-radius:50%;display:block}
  .lp-dots i:nth-child(1){background:#ff5f57}.lp-dots i:nth-child(2){background:#febc2e}.lp-dots i:nth-child(3){background:#28c840}
  .lp-copy{background:none;border:1px solid var(--lp-code-border);color:#aab2c8;border-radius:6px;padding:2px 8px;
    font:500 11px Inter,sans-serif;cursor:pointer;flex:none}
  .lp-copy:hover{color:#fff;border-color:#59607a}
  .lp-body{padding:12px 18px;overflow-x:auto}
  .lp-body, .lp-body *{font-family:"JetBrains Mono",monospace!important}
  .lp-body{font-size:14px!important;line-height:1.65!important;color:var(--lp-code-ink)!important}
  .lp-body pre, .lp-body code{background:transparent!important;border:0!important;margin:0!important;padding:0!important;
    color:inherit!important;font-size:inherit!important;box-shadow:none!important}
  .lp-body *:not(.lp-ref):not(.lp-ref *){background-color:transparent!important}
  /* tint common prettify / highlight classes if present */
  .lp-body .kwd,.lp-body .hljs-keyword{color:#c792ea!important}
  .lp-body .typ,.lp-body .hljs-type,.lp-body .hljs-built_in{color:#82aaff!important}
  .lp-body .lit,.lp-body .hljs-number,.lp-body .hljs-literal{color:#f78c6c!important}
  .lp-body .str,.lp-body .hljs-string{color:#c3e88d!important}
  .lp-body .com,.lp-body .hljs-comment{color:#7a8299!important;font-style:italic}
  .lp-body .pln,.lp-body .pun{color:var(--lp-code-ink)!important}
  .lp-body a{color:var(--lp-ref)!important;text-decoration:none!important}
  .lp-ref{color:var(--lp-ref)!important;background:#89ddff14!important;border:1px dashed #89ddff55;border-radius:5px;padding:0 5px}
  .lp-ref:hover{background:#89ddff2a!important}
  .lp-body svg, .lp-body i[class*="fa-"]{color:var(--lp-gold)!important;fill:var(--lp-gold)!important}

  /* floating theme toggle */
  #lp-theme{position:fixed;right:16px;bottom:16px;z-index:9999;border:1px solid var(--lp-rule);background:var(--lp-paper);
    color:var(--lp-ink);border-radius:999px;padding:8px 14px;font:500 13px Inter,sans-serif;cursor:pointer;
    box-shadow:0 4px 16px -6px rgba(0,0,0,.3)}
  html.lp-dark img:not([src*=".svg"]){filter:brightness(.9)}
  `;
  const style = document.createElement('style');
  style.id = 'lp-style';
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- helpers ---------- */
  const NAME_RE = /^\s*(<<|«|⟨)[^\n]{1,160}?(>>|»|⟩)\s*\+?=?\s*$/;

  function looksLikeName(el) {
    if (!el || el.nodeType !== 1) return false;
    const t = el.textContent.trim();
    return t.length < 200 && NAME_RE.test(t);
  }

  function codeText(el) {
    const clone = el.cloneNode(true);
    clone.querySelectorAll('.lp-head, button, svg, i[class*="fa-"]').forEach(n => n.remove());
    return clone.innerText.replace(/ /g, ' ').replace(/\s+$/,'');
  }

  function makeHead(nameEl) {
    const head = document.createElement('div');
    head.className = 'lp-head';
    if (nameEl) {
      const n = document.createElement('span');
      n.className = 'lp-name';
      n.appendChild(nameEl);           // move original (keeps its = / += links working)
      head.appendChild(n);
    } else {
      head.innerHTML = '<div class="lp-dots"><i></i><i></i><i></i></div><span style="flex:1"></span>';
    }
    const btn = document.createElement('button');
    btn.className = 'lp-copy';
    btn.textContent = 'Copy';
    head.appendChild(btn);
    return { head, btn };
  }

  /* ---------- find code blocks ---------- */
  function candidates() {
    const set = new Set();
    // pbr-book fragment containers (several plausible class names) + any <pre>
    document.querySelectorAll(
      '.fragmentcode, .fragment-code, .fragment, div[class*="fragmentcode"], pre'
    ).forEach(el => {
      if (el.closest('.lp-card')) return;
      // prefer the outermost fragment container
      const outer = el.parentElement && el.parentElement.closest('.fragmentcode, .fragment-code, .fragment');
      set.add(outer || el);
    });
    return [...set].filter(el => !el.closest('nav, .navbar, footer') && el.textContent.trim().length);
  }

  function enhance(block) {
    if (block.closest('.lp-card') || block.dataset.lpDone) return;
    block.dataset.lpDone = '1';

    // fragment name: first child line, or the element right before the block
    let nameEl = null;
    const first = block.firstElementChild;
    if (first && looksLikeName(first)) nameEl = first;
    else if (looksLikeName(block.previousElementSibling)) nameEl = block.previousElementSibling;

    const card = document.createElement('div');
    card.className = 'lp-card';
    block.parentNode.insertBefore(card, block);
    const { head, btn } = makeHead(nameEl);
    const body = document.createElement('div');
    body.className = 'lp-body';
    card.appendChild(head);
    card.appendChild(body);
    body.appendChild(block);

    // mark references to other fragments inside code
    body.querySelectorAll('a[href*="#fragment-"], span, a').forEach(el => {
      if (el.closest('.lp-head') || el.children.length > 3) return;
      const t = el.textContent.trim();
      if (/^(<<|«|⟨).+(>>|»|⟩)$/.test(t) || (el.matches('a[href*="#fragment-"]') && !/^\+?=$/.test(t))) {
        el.classList.add('lp-ref');
      }
    });

    btn.addEventListener('click', () => {
      navigator.clipboard?.writeText(codeText(body)).then(() => {
        btn.textContent = 'Copied';
        setTimeout(() => (btn.textContent = 'Copy'), 1200);
      });
    });
  }

  function run() { candidates().forEach(enhance); }
  run();
  // pages that load content lazily / MathJax re-renders
  new MutationObserver(() => { clearTimeout(run.t); run.t = setTimeout(run, 300); })
    .observe(document.body, { childList: true, subtree: true });

  /* ---------- theme toggle ---------- */
  const KEY = 'lp-theme';
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) document.documentElement.classList.add('lp-dark');
  const tbtn = document.createElement('button');
  tbtn.id = 'lp-theme';
  tbtn.textContent = '◐ Theme';
  tbtn.onclick = () => {
    const dark = document.documentElement.classList.toggle('lp-dark');
    try { localStorage.setItem(KEY, dark ? 'dark' : 'light'); } catch (e) {}
  };
  document.body.appendChild(tbtn);
})();
