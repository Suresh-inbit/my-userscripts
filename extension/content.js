// IITM Placement Portal — Clean Dashboard (extension build)
// Generated from iitm-placement-enhancer.js by build.sh — edit the userscript, not this file.

(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   * 0. Settings
   * ------------------------------------------------------------------ */
  // The portal's bootstrap-table plugin re-renders the whole table ~1-2 s after load
  // (that was the second "flash"). The tables use none of its features, so we switch it off.
  const DISABLE_BOOTSTRAP_TABLE = true;
  const REVEAL_FAILSAFE_MS = 2500;   // show the page no matter what after this long

  const root = () => document.documentElement;
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ------------------------------------------------------------------ *
   * 1. Pre-paint: theme class + CSS + "hide until styled"
   * ------------------------------------------------------------------ */
  const CSS = `
  :root{
    --x-bg:#f1f5f9; --x-surface:#fff; --x-hover:#f8fafc; --x-subtle:#e2e8f0;
    --x-ink:#0f172a; --x-muted:#475569; --x-border:#cbd5e1;
    --x-accent:#4f46e5; --x-accent-soft:#e0e7ff; --x-link:#4338ca;
    --x-warn-soft:#fef3c7; --x-warn:#b45309; --x-ok-soft:#d1fae5; --x-ok:#047857;
    --x-shadow:0 4px 18px -2px rgba(15,23,42,.08); --x-nav-h:64px;
  }
  html.x-dark{
    --x-bg:#0b0f17; --x-surface:#151c28; --x-hover:#1e293b; --x-subtle:#243044;
    --x-ink:#f8fafc; --x-muted:#cbd5e1; --x-border:#334155;
    --x-accent:#6366f1; --x-accent-soft:rgba(99,102,241,.28); --x-link:#a5b4fc;
    --x-warn-soft:rgba(245,158,11,.22); --x-warn:#fbbf24; --x-ok-soft:rgba(16,185,129,.18); --x-ok:#34d399;
    --x-shadow:0 8px 28px -4px rgba(0,0,0,.5); color-scheme:dark;
  }
  html{background:var(--x-bg)!important}

  /* hide the page until the restyle is applied (removed by JS => no flash) */
  html.x-loading body{opacity:0!important}

  body,main.page-wrapper{background:var(--x-bg)!important;color:var(--x-ink)!important}
  main.page-wrapper .bg-light,main.page-wrapper .bg-white,main.page-wrapper .card,
  main.page-wrapper .alert,.modal .bg-light,.modal .bg-white,.modal .card,.modal .alert{
    background:var(--x-surface)!important;color:var(--x-ink)!important;
    border:1px solid var(--x-border)!important;box-shadow:var(--x-shadow)!important;border-radius:14px!important}
  h1,h2,h3,h4,h5,h6,label{color:var(--x-ink)!important}

  /* form controls */
  input:not([type=checkbox]):not([type=radio]):not([type=hidden]):not([type=file]),textarea,select,.form-control{
    background:var(--x-subtle)!important;color:var(--x-ink)!important;
    border:1px solid var(--x-border)!important;border-radius:8px!important;opacity:1!important}
  input::placeholder{color:var(--x-muted)!important;opacity:.85!important}
  input:focus,select:focus,textarea:focus{border-color:var(--x-accent)!important;
    box-shadow:0 0 0 3px var(--x-accent-soft)!important;outline:none!important}
  .btn,.btn-sm,button.hideadvanced,button.showadvanced{opacity:1!important}
  button.hideadvanced,button.showadvanced{background:var(--x-subtle)!important;color:var(--x-ink)!important;
    border:1px solid var(--x-border)!important;border-radius:8px!important;font-weight:600!important;padding:5px 12px!important}

  /* navbar (beats the portal's #8d0707 rule) */
  nav.navbar.fixed-top{background:var(--x-surface)!important;border-bottom:1px solid var(--x-border)!important;
    box-shadow:var(--x-shadow)!important;padding:.4rem 1rem!important}
  nav.navbar .navbar-nav{display:flex!important;flex-wrap:wrap!important;align-items:center!important;gap:4px!important}
  nav.navbar .nav-item>a.nav-link{background:var(--x-subtle)!important;color:var(--x-ink)!important;
    border:1px solid var(--x-border)!important;border-radius:7px!important;font-weight:600!important;
    font-size:.8rem!important;padding:.35rem .65rem!important;opacity:1!important}
  nav.navbar .nav-item>a.nav-link:hover{background:var(--x-accent-soft)!important;border-color:var(--x-accent)!important}
  nav.navbar .nav-item>a.nav-link.x-current,nav.navbar .nav-item>a.nav-link.active,nav.navbar .nav-item>a.nav-link.show{
    background:var(--x-accent)!important;color:#fff!important;border-color:var(--x-accent)!important}
  nav.navbar .dropdown-menu{background:var(--x-surface)!important;border:1px solid var(--x-border)!important;box-shadow:var(--x-shadow)!important}
  nav.navbar .dropdown-item{color:var(--x-ink)!important;font-weight:500!important}
  nav.navbar .dropdown-item.active,nav.navbar .dropdown-item:hover{background:var(--x-accent)!important;color:#fff!important}
  /* keep content below the (possibly 2-row) fixed navbar */
  main.page-wrapper>.container-fluid.mb-7{height:calc(var(--x-nav-h) + 8px);margin-bottom:0!important}

  /* chips (used for every small button we add) */
  .x-chip{background:var(--x-subtle)!important;color:var(--x-ink)!important;border:1px solid var(--x-border)!important;
    border-radius:999px!important;padding:5px 12px!important;font-size:.78rem!important;font-weight:600!important;
    cursor:pointer;opacity:1!important}
  .x-chip:hover{border-color:var(--x-accent)!important;background:var(--x-accent-soft)!important}
  .x-chip.active{background:var(--x-accent)!important;color:#fff!important;border-color:var(--x-accent)!important}
  .x-select{padding:5px 10px!important;font-size:.8rem!important;font-weight:600!important;cursor:pointer}

  /* credit HUD */
  .x-hud{display:flex;flex-wrap:wrap;align-items:center;gap:14px;background:var(--x-subtle);
    border:1px solid var(--x-border);border-radius:10px;padding:10px 16px;margin-bottom:14px}
  .x-stat{font-size:.88rem;color:var(--x-muted)} .x-stat b{font-size:1rem;color:var(--x-ink);margin-left:4px}
  .x-meter{width:110px;height:7px;background:var(--x-border);border-radius:99px;overflow:hidden}
  .x-meter i{display:block;height:100%;background:var(--x-accent)}

  /* sticky command bar */
  .x-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;
    background:var(--x-surface);border:1px solid var(--x-border);border-radius:12px;padding:12px 14px;
    margin-bottom:14px;position:sticky;top:calc(var(--x-nav-h) + 6px);z-index:95;box-shadow:var(--x-shadow)}
  .x-bar .x-search{flex:1 1 250px;max-width:340px;padding:7px 12px;font-size:.86rem}
  .x-group{display:flex;flex-wrap:wrap;align-items:center;gap:6px}
  .x-count{font-size:.78rem;font-weight:600;color:var(--x-muted);margin-left:4px}

  /* tables */
  table.table{background:var(--x-surface)!important;margin:0!important;border-collapse:separate!important;border-spacing:0!important}
  table.table thead th{background:var(--x-subtle)!important;color:var(--x-ink)!important;font-size:.75rem!important;
    font-weight:700!important;text-transform:uppercase;letter-spacing:.04em;padding:12px!important;
    border:0!important;border-bottom:1px solid var(--x-border)!important;user-select:none}
  table.table thead th.x-sortable{cursor:pointer}
  table.table thead th.x-sortable:hover{color:var(--x-accent)!important}
  .x-arrow{margin-left:5px;color:var(--x-accent)}
  table.table tbody tr,table.table tbody tr.bg-warning{background:var(--x-surface)!important;color:var(--x-ink)!important;opacity:1!important}
  table.table tbody tr:hover{background:var(--x-hover)!important}
  table.table tbody tr[hidden]{display:none!important}
  table.table tbody td{background:transparent!important;color:var(--x-ink)!important;padding:12px!important;
    vertical-align:middle!important;border:0!important;border-bottom:1px solid var(--x-border)!important;opacity:1!important}
  table.table tbody tr.x-urgent td:first-child{border-left:4px solid #f59e0b!important}
  table.table tbody tr.x-applied{background:var(--x-ok-soft)!important}
  table.table tbody tr.x-applied td:first-child{border-left:4px solid #10b981!important}
  table.table tbody tr.x-ineligible td{color:var(--x-muted)!important}
  #x-main tbody td:nth-child(2){font-weight:600!important;min-width:170px}
  #x-main tbody td.txtwrap{max-width:340px!important;white-space:normal!important;overflow:visible!important}

  /* links inside tables: normal links are coloured text ... */
  table.table tbody td a{color:var(--x-link)!important;font-weight:600!important;text-decoration:none!important;
    opacity:1!important}
  table.table tbody td a:hover{text-decoration:underline!important}
  /* ... and .x-btn links are solid buttons (higher specificity, so the text is always white) */
  table.table tbody td a.x-btn{display:inline-flex!important;align-items:center;gap:4px;margin:2px;padding:5px 12px!important;
    border-radius:7px!important;font-size:.78rem!important;white-space:nowrap;color:#fff!important;text-decoration:none!important}
  table.table tbody td a.x-btn:hover{filter:brightness(1.12);text-decoration:none!important}
  a.x-btn.x-register,a.x-btn.x-apply{background:#4f46e5!important;border:1px solid #6366f1!important}
  a.x-btn.x-update{background:#059669!important;border:1px solid #10b981!important}
  a.x-btn.x-remove{background:#dc2626!important;border:1px solid #ef4444!important}
  a.x-btn.x-wa{background:#16a34a!important;border:1px solid #22c55e!important}
  a.x-role{display:inline-block;line-height:1.35;margin-bottom:4px}

  /* small pills */
  .x-pill,.x-reg,.x-tag,.x-due{display:inline-block;border-radius:6px;font-weight:600;border:1px solid var(--x-border)}
  .x-pill{min-width:28px;text-align:center;padding:2px 6px;font-size:.82rem;background:var(--x-subtle);color:var(--x-ink)}
  .x-reg{padding:2px 8px;font-size:.75rem;background:var(--x-subtle);color:var(--x-ink)}
  .x-cat{display:inline-block;padding:3px 9px;border-radius:99px;font-size:.75rem;font-weight:600;white-space:nowrap;
    background:var(--x-accent-soft);color:var(--x-ink);border:1px solid rgba(99,102,241,.35)}
  .x-due{margin-top:4px;padding:1px 7px;font-size:.72rem;font-weight:700;background:var(--x-subtle);color:var(--x-ink)}
  .x-due.urgent{background:var(--x-warn-soft);color:var(--x-warn);border-color:rgba(245,158,11,.45)}
  .x-tag{padding:4px 10px;font-size:.75rem;background:var(--x-subtle);color:var(--x-muted)}

  .pagination .page-link{background:var(--x-subtle)!important;color:var(--x-ink)!important;border-color:var(--x-border)!important}
  .pagination .page-item.active .page-link{background:var(--x-accent)!important;color:#fff!important}
  /* company-profile popup: wide, readable, keeps its heading colours */
  .modal-dialog{max-width:min(1500px,96vw)!important;margin:1.25rem auto!important}
  .modal-content{background:var(--x-surface)!important;color:var(--x-ink)!important;border:1px solid var(--x-border)!important}
  .modal-header,.modal-footer{border-color:var(--x-border)!important}
  .modal-title{color:var(--x-ink)!important;font-weight:700}
  .modal-header .close{color:var(--x-ink)!important;background:var(--x-subtle)!important;border:1px solid var(--x-border)!important;
    border-radius:8px;opacity:1!important;padding:2px 12px;font-size:1.2rem;line-height:1.4}
  .modal-body{padding:1.25rem 1.5rem!important}
  .modal-body .card,.modal-body .alert{box-shadow:none!important}
  .modal-body hr{border-color:var(--x-border)!important;opacity:1}
  .modal-body td{white-space:pre-line}                      /* "Breakup of CTC" lines */
  .modal-body td:last-child{min-width:260px}
  .modal-body .table-responsive{overflow-x:auto}
  @media(min-width:1200px){.modal-body .row>.col-6{flex:0 0 auto!important;width:33.3333%!important}}   /* 3 columns */
  html.x-dark .modal-body,html.x-dark .modal-body label,html.x-dark .modal-body .text-dark,
  html.x-dark .modal-body td,html.x-dark .modal-body th{color:var(--x-ink)!important}
  html.x-dark .modal-body .text-primary,html.x-dark .modal-body a{color:var(--x-link)!important}
  html.x-dark .modal-body .text-danger{color:#f87171!important}
  /* any other white panel found by the dark-mode sweep (see sweepWhitePanels) */
  html.x-dark .x-flip{background-color:var(--x-surface)!important;color:var(--x-ink)!important}
  .fixed-table-loading{display:none!important}
  .x-toast{position:fixed;right:18px;bottom:18px;z-index:2000;max-width:420px;padding:12px 16px;border-radius:10px;
    font-size:.88rem;font-weight:600;background:var(--x-surface);color:var(--x-ink);border:1px solid var(--x-border);
    border-left:4px solid #10b981;box-shadow:var(--x-shadow)}
  .x-toast.bad{border-left-color:#ef4444}
  `;

  function boot() {
    const el = root();
    if (!el) return false;
    if (isDark()) el.classList.add('x-dark');
    el.classList.add('x-loading');
    const style = document.createElement('style');
    style.id = 'x-style';
    style.textContent = CSS;
    el.appendChild(style);
    return true;
  }
  function isDark() { try { return localStorage.getItem('x-iitm-theme') === 'dark'; } catch (e) { return false; } }

  // documentElement may not exist yet on some managers: wait for it
  if (!boot()) {
    const mo = new MutationObserver(() => { if (boot()) mo.disconnect(); });
    mo.observe(document, { childList: true });
  }

  function reveal() { root() && root().classList.remove('x-loading'); }

  /* ------------------------------------------------------------------ *
   * 2. Row parsing — a pure function of the cells, so it works on raw rows,
   *    decorated rows and rows fetched from other pages.
   * ------------------------------------------------------------------ */
  // text of a cell without hidden sort helpers / our own badges
  function cleanText(td) {
    const c = td.cloneNode(true);
    c.querySelectorAll('.d-none,.x-due').forEach(n => n.remove());
    return c.textContent.replace(/\s+/g, ' ').trim();
  }

  function info(tr) {
    const td = tr.children;
    const roleA = td[2].querySelector('a');
    const hidden = td[2].querySelector('.d-none');
    const role = ((hidden && hidden.textContent) || (roleA && roleA.textContent) || '').trim();
    const reg = (td[2].textContent.match(/(?:Registered Count:|👥)\s*(\d+)/) || [])[1];

    const key = (td[5].querySelector('.d-none') || {}).textContent || '';
    let deadline = Date.parse(cleanText(td[5]));
    if (isNaN(deadline)) {
      const m = key.trim().match(/^(\d{4})(\d{2})(\d{2})$/);
      deadline = m ? Date.parse(`${m[1]}-${m[2]}-${m[3]}T23:59:00`) : Infinity;
    }

    // PPT (col 6) and Test (col 7) dates; empty cell => Infinity (sorted last)
    const when = c => { const t = Date.parse(cleanText(c)); return isNaN(t) ? Infinity : t; };

    // action cell: links => Register / Update+Remove; plain text => Ineligible / Applied / Closed / Yet To Open
    const act = td[td.length - 1];
    const actText = act.textContent.replace(/\s+/g, ' ');
    const hasLink = !!act.querySelector('a');
    let status = 'other';
    if (/Ineligible/i.test(actText)) status = 'ineligible';
    else if (act.querySelector('a.x-update, a.x-remove') || (hasLink && /\bUpdate\b|\bRemove\b/.test(actText))) status = 'applied';
    else if (hasLink && /Register/i.test(actText)) status = 'eligible';
    else if (/Yet\s*To\s*Open/i.test(actText)) status = 'yet';
    else if (/Closed/i.test(actText)) status = 'closed';
    else if (/\bApplied\b/i.test(actText)) status = 'done';      // applied, but edits are locked

    return {
      sl: +tr.dataset.xSeq || parseInt(td[0].textContent, 10) || 0,   // xSeq = page*1000 + position
      company: td[1].textContent.trim().toLowerCase(),
      role: role.toLowerCase(),
      credits: parseInt(td[3].textContent, 10) || 0,
      cat: td[4].textContent.trim(),
      reg: parseInt(reg, 10) || 0,
      deadline, ppt: when(td[6]), test: when(td[7]), status
    };
  }

  /* ------------------------------------------------------------------ *
   * 3. Row decoration (idempotent)
   * ------------------------------------------------------------------ */
  let seq = 0;
  function decorate(tr) {
    const td = tr.children;
    if (tr.classList.contains('x-done') || td.length < 11) return;
    if (!tr.dataset.xSeq) tr.dataset.xSeq = ++seq;
    const i = info(tr);                         // read first, rewrite after
    tr.classList.add('x-done');

    // drop the portal's orange "text-white" styling, remember urgency
    if (tr.classList.contains('bg-warning')) tr.classList.add('x-urgent');
    tr.classList.remove('bg-warning', 'text-white');
    tr.querySelectorAll('.text-white').forEach(n => n.classList.remove('text-white'));

    // profile: keep the role link (+ hidden sort span), replace "Registered Count: N" by a badge
    const roleA = td[2].querySelector('a');
    if (roleA) roleA.classList.add('x-role');
    Array.from(td[2].childNodes).forEach(n => {
      if (n !== roleA && !(n.nodeType === 1 && n.classList.contains('d-none'))) n.remove();
    });
    td[2].insertAdjacentHTML('beforeend', `<div><span class="x-reg" title="Registered count">👥 ${i.reg}</span></div>`);

    td[3].innerHTML = `<span class="x-pill">${i.credits}</span>`;
    td[4].innerHTML = `<span class="x-cat">${i.cat || 'Other'}</span>`;

    // deadline, PPT, test: keep hidden key span, add "Nh left" / "Tomorrow"
    [[td[5], i.deadline], [td[6], i.ppt], [td[7], i.test]].forEach(([cell, when]) => {
      if (!isFinite(when)) return;
      const hrs = (when - Date.now()) / 36e5;
      const due = hrs > 0 && hrs <= 24 ? `<span class="x-due urgent">⏳ ${Math.ceil(hrs)}h left</span>`
                : hrs > 24 && hrs <= 48 ? `<span class="x-due">Tomorrow</span>` : '';
      const keySpan = cell.querySelector('.d-none');
      cell.innerHTML = (keySpan ? keySpan.outerHTML : '') + `<div>${cleanText(cell)}${due ? '<div>' + due + '</div>' : ''}</div>`;
    });

    // external + whatsapp links -> buttons
    const ext = td[9].querySelector('a');
    if (ext) { ext.className = 'x-btn x-apply'; ext.title = ext.href; ext.textContent = 'Apply ↗'; }
    const wa = td[10].textContent.trim();
    if (/^https?:/i.test(wa)) {
      td[10].innerHTML = `<a class="x-btn x-wa" href="${wa}" target="_blank" rel="noopener" title="${wa}">💬 Join</a>`;
    } else if (!wa) {
      td[10].textContent = '-';
    }

    // action cell (inline onclick handlers stay untouched)
    const act = td[td.length - 1];
    if (i.status === 'ineligible') {
      tr.classList.add('x-ineligible');
      act.innerHTML = '<span class="x-tag">Ineligible</span>';
    } else {
      act.querySelectorAll('a').forEach(a => {
        const t = a.textContent.trim();
        a.classList.add('x-btn');
        if (/Register/i.test(t)) a.classList.add('x-register');
        else if (/Update/i.test(t)) { a.classList.add('x-update'); a.textContent = '✓ Update'; }
        else if (/Remove/i.test(t)) a.classList.add('x-remove');
      });
      if (i.status === 'applied' || i.status === 'done') tr.classList.add('x-applied');
      const label = { done: 'Applied', closed: 'Closed', yet: 'Yet To Open' }[i.status];
      if (label) act.innerHTML = `<span class="x-tag">${label}</span>`;
    }
  }

  /* ------------------------------------------------------------------ *
   * 4. Filters, sorting, toolbar
   * ------------------------------------------------------------------ */
  const state = { q: '', status: 'all', cat: 'all', sort: 'sl', dir: 1 };
  const pageOf = u => +((u.match(/[?&]page=(\d+)/) || [])[1]) || 1;
  const loadedPages = new Set([pageOf(location.search)]);   // pages currently merged into the table
  const DEFAULT_DIR = { sl: 1, company: 1, role: 1, credits: -1, reg: -1, deadline: 1, ppt: 1, test: 1 };
  const SORTABLE_TH = { 0: 'sl', 1: 'company', 2: 'role', 3: 'credits', 5: 'deadline', 6: 'ppt', 7: 'test' };

  function mainTable() {
    return $$('table.table').find(t => {
      const ths = t.querySelectorAll('thead th');
      const head = Array.from(ths).map(th => th.textContent.toLowerCase()).join(' ');
      return ths.length >= 11 && head.includes('company') && head.includes('profile') && !t.closest('.fixed-table-header');
    });
  }

  function dataRows(table) {
    return $$('tbody tr', table).filter(r => r.children.length >= 11);
  }

  function applyView(table) {
    const rows = dataRows(table);
    const q = state.q.trim().toLowerCase();
    const items = rows.map(tr => ({ tr, i: info(tr) }));

    let shown = 0;
    items.forEach(({ tr, i }) => {
      const okQ = !q || i.company.includes(q) || i.role.includes(q) || i.cat.toLowerCase().includes(q);
      const okS = state.status === 'all' ||
                  (state.status === 'actionable' ? (i.status === 'eligible' || i.status === 'applied')   // things you can still act on
                 : state.status === 'applied'    ? (i.status === 'applied' || i.status === 'done')       // every role you applied to
                 : i.status === state.status);
      const okC = state.cat === 'all' || i.cat === state.cat;
      tr.hidden = !(okQ && okS && okC);
      if (!tr.hidden) shown++;
    });

    const k = state.sort, d = state.dir;
    items.sort((a, b) => {
      const x = a.i[k], y = b.i[k];
      if ((x === Infinity) !== (y === Infinity)) return x === Infinity ? 1 : -1;   // no date => always last
      const c = typeof x === 'string' ? x.localeCompare(y) : (x === y ? 0 : x < y ? -1 : 1);
      return (c * d) || (a.i.sl - b.i.sl);
    });
    const tbody = table.tBodies[0];
    items.forEach(({ tr }) => tbody.appendChild(tr));

    // header arrows + dropdown sync
    $$('thead th', table).forEach((th, idx) => {
      if (SORTABLE_TH[idx]) { th.classList.add('x-sortable'); th.title = 'Click to sort'; }
      const old = th.querySelector('.x-arrow'); if (old) old.remove();
      if (SORTABLE_TH[idx] === k && (k !== 'sl' || d !== 1)) {
        const s = document.createElement('span'); s.className = 'x-arrow'; s.textContent = d === 1 ? '↑' : '↓'; th.appendChild(s);
      }
    });
    const sel = $('#x-sort'); if (sel) sel.value = `${k}:${d}`;
    const cnt = $('#x-count'); if (cnt) cnt.textContent = `${shown} / ${rows.length} roles`;
  }

  function fillCategories(table) {
    const sel = $('#x-cat'); if (!sel) return;
    const cats = Array.from(new Set(dataRows(table).map(r => info(r).cat).filter(Boolean))).sort();
    sel.innerHTML = `<option value="all">All Categories (${cats.length})</option>` +
                    cats.map(c => `<option value="${c}">${c}</option>`).join('');
    sel.value = cats.includes(state.cat) ? state.cat : 'all';
  }

  function buildToolbar(table) {
    if ($('#x-bar')) return;
    const wrap = table.closest('.table-responsive');
    if (!wrap) return;
    const bar = document.createElement('div');
    bar.id = 'x-bar'; bar.className = 'x-bar';
    bar.innerHTML = `
      <input type="search" id="x-search" class="x-search" placeholder="🔍 Filter company, role, category… (press /)">
      <div class="x-group" id="x-status">
        <button type="button" class="x-chip active" data-s="all">All</button>
        <button type="button" class="x-chip" data-s="actionable">Eligible + Applied</button>
        <button type="button" class="x-chip" data-s="eligible">Can Register</button>
        <button type="button" class="x-chip" data-s="applied">Applied ✓</button>
        <button type="button" class="x-chip" data-s="yet">Yet To Open</button>
        <button type="button" class="x-chip" data-s="closed">Closed</button>
        <button type="button" class="x-chip" data-s="ineligible">Ineligible</button>
      </div>
      <div class="x-group">
        <select id="x-cat" class="x-select"></select>
        <select id="x-sort" class="x-select">
          <option value="sl:1">Sort: Sl No. (default)</option>
          <option value="sl:-1">Sl No. (high → low)</option>
          <option value="deadline:1">Deadline (soonest)</option>
          <option value="deadline:-1">Deadline (latest)</option>
          <option value="test:1">Test date (soonest)</option>
          <option value="test:-1">Test date (latest)</option>
          <option value="ppt:1">PPT date (soonest)</option>
          <option value="ppt:-1">PPT date (latest)</option>
          <option value="reg:-1">Registered (high → low)</option>
          <option value="reg:1">Registered (low → high)</option>
          <option value="credits:1">Credits (low → high)</option>
          <option value="credits:-1">Credits (high → low)</option>
          <option value="company:1">Company (A → Z)</option>
          <option value="company:-1">Company (Z → A)</option>
          <option value="role:1">Role (A → Z)</option>
          <option value="role:-1">Role (Z → A)</option>
        </select>
        <button type="button" id="x-load" class="x-chip">⚡ Load All Pages</button>
        <span id="x-count" class="x-count"></span>
      </div>`;
    wrap.parentNode.insertBefore(bar, wrap);

    const refresh = () => applyView(mainTable());
    $('#x-search').addEventListener('input', e => { state.q = e.target.value; refresh(); });
    $('#x-status').addEventListener('click', e => {
      const b = e.target.closest('button[data-s]'); if (!b) return;
      $$('#x-status .x-chip').forEach(c => c.classList.toggle('active', c === b));
      state.status = b.dataset.s; refresh();
    });
    $('#x-cat').addEventListener('change', e => { state.cat = e.target.value; refresh(); });
    $('#x-sort').addEventListener('change', e => {
      const [k, d] = e.target.value.split(':'); state.sort = k; state.dir = +d; refresh();
    });
    $('#x-load').addEventListener('click', e => loadAllPages(e.currentTarget));
    document.addEventListener('keydown', e => {
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
        e.preventDefault(); $('#x-search').focus();
      }
    });
  }

  // one delegated listener on the table itself, so it survives any re-rendering of <thead>
  function bindHeaders(table) {
    if (table.dataset.xHead) return;
    table.dataset.xHead = '1';
    table.addEventListener('click', e => {
      const th = e.target.closest('thead th');
      const key = th && SORTABLE_TH[th.cellIndex];
      if (!key) return;
      if (state.sort === key) state.dir = -state.dir; else { state.sort = key; state.dir = DEFAULT_DIR[key]; }
      applyView(table);
    });
  }

  async function loadAllPages(btn) {
    const table = mainTable(); if (!table) return;
    const urls = Array.from(new Set($$('ul.pagination a.page-link').map(a => a.href).filter(h => /page=\d+/.test(h))));
    btn.disabled = true;
    if (!urls.length) { btn.textContent = '✓ All pages loaded'; return; }
    const tbody = table.tBodies[0];
    let n = 1;
    for (const url of urls) {
      btn.textContent = `⏳ Loading page ${++n}…`;
      try {
        const doc = new DOMParser().parseFromString(await (await fetch(url, { credentials: 'same-origin' })).text(), 'text/html');
        const t = Array.from(doc.querySelectorAll('table.table')).find(x => x.querySelectorAll('thead th').length >= 11);
        const pageNo = pageOf(url);
        if (t) loadedPages.add(pageNo);
        if (t) dataRows(t).forEach((tr, k) => {
          const copy = document.importNode(tr, true);
          copy.dataset.xSeq = pageNo * 1000 + k;
          tbody.appendChild(copy);
        });
      } catch (err) { console.error('[x-placement] page failed', url, err); }
    }
    dataRows(table).forEach(decorate);
    fillCategories(table);
    applyView(table);
    const pg = $('ul.pagination'); if (pg) pg.closest('nav').hidden = true;
    btn.textContent = `✓ All ${n} pages merged`;
  }

  /* ------------------------------------------------------------------ *
   * 5. Navbar, credit HUD, theme, plain URL cells on other pages
   * ------------------------------------------------------------------ */
  function setTheme(dark) {
    root().classList.toggle('x-dark', dark);
    try { localStorage.setItem('x-iitm-theme', dark ? 'dark' : 'light'); } catch (e) {}
    const b = $('#x-theme'); if (b) b.textContent = dark ? '☀️ Light' : '🌙 Dark';
    sweepWhitePanels();
  }

  function enhanceNavbar() {
    const ul = $('nav.navbar ul.navbar-nav');
    if (!ul || ul.dataset.xDone) return;
    ul.dataset.xDone = '1';
    const path = location.pathname;

    // "Companies" dropdown -> two always-visible buttons
    $$('li.nav-item.dropdown', ul).forEach(li => {
      if (!/Companies/i.test(li.querySelector('.dropdown-toggle')?.textContent || '')) return;
      $$('.dropdown-item', li).forEach(a => {
        const n = document.createElement('li');
        n.className = 'nav-item';
        const href = a.getAttribute('href') || '';
        n.innerHTML = `<a class="nav-link" href="${href}"><i class="fas fa-building px-1"></i> ${a.textContent.trim()}</a>`;
        li.before(n);
      });
      li.remove();
    });
    $$('li.nav-item > a.nav-link:not(.dropdown-toggle)', ul).forEach(a => {
      try { if (new URL(a.href, location.href).pathname === path) a.classList.add('x-current'); } catch (e) {}
    });

    const li = document.createElement('li');
    li.className = 'nav-item';
    li.innerHTML = `<button type="button" id="x-theme" class="x-chip">${root().classList.contains('x-dark') ? '☀️ Light' : '🌙 Dark'}</button>`;
    ul.appendChild(li);
    li.firstChild.addEventListener('click', () => setTheme(!root().classList.contains('x-dark')));
  }

  // Pages we haven't seen (forms, the ajax-loaded profile modal) have white panels whose
  // text we turn light. Find every near-white block and mark it so dark mode can repaint it.
  function sweepWhitePanels() {
    if (!root().classList.contains('x-dark')) return;
    $$('div,section,fieldset,form,ul,li,p,.modal-content').forEach(el => {
      if (el.classList.contains('x-flip') || el.closest('nav,table,.x-bar,.x-hud')) return;
      const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
      if (!m) return;
      const [r, g, b, a = 1] = m.map(Number);
      if (a > 0.5 && r > 225 && g > 225 && b > 225) el.classList.add('x-flip');
    });
  }

  function measureNavbar() {
    const nav = $('nav.navbar.fixed-top');
    if (nav) root().style.setProperty('--x-nav-h', nav.offsetHeight + 'px');
  }

  function setCredits(total, used, bal) {
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set('x-c-total', total); set('x-c-used', used); set('x-c-bal', bal);
    const bar = document.getElementById('x-c-bar'), pct = Math.min(100, used / total * 100);
    if (bar) bar.style.width = pct + '%';
    const m = document.getElementById('x-c-meter'); if (m) m.title = Math.round(pct) + '% used';
  }

  function enhanceCredits() {
    const row = $('.row.text-danger');
    if (!row || row.dataset.xDone) return;
    row.dataset.xDone = '1';
    const g = re => parseInt((row.textContent.match(re) || [])[1], 10);
    const total = g(/Total Credits\s*:\s*(\d+)/i), used = g(/Used Credits\s*:\s*(\d+)/i), bal = g(/Balance Credits\s*:\s*(\d+)/i);
    if (isNaN(total)) return;
    const btns = $$('button', row);
    row.className = 'x-hud';
    row.innerHTML = `
      <span class="x-stat">Total <b id="x-c-total"></b></span>
      <span class="x-stat">Used <b id="x-c-used"></b></span>
      <span class="x-stat">Balance <b id="x-c-bal" style="color:var(--x-ok)"></b></span>
      <span class="x-meter" id="x-c-meter"><i id="x-c-bar"></i></span>`;
    setCredits(total, used, bal);
    btns.forEach(b => { b.classList.add('x-chip'); row.appendChild(b); });
  }

  // other pages: turn bare URLs in table cells into buttons
  function linkifyCells(main) {
    $$('table.table tbody td').forEach(td => {
      if (td.dataset.xUrl || (main && main.contains(td))) return;
      td.dataset.xUrl = '1';
      const t = td.textContent.trim();
      if (/^https?:\/\/\S+$/i.test(t) && !td.querySelector('a')) {
        td.innerHTML = `<a class="x-btn x-apply" href="${t}" target="_blank" rel="noopener" title="${t}">🔗 Open ↗</a>`;
      }
    });
  }

  /* ------------------------------------------------------------------ *
   * 5b. Register / update resume WITHOUT leaving the page
   *     The portal does: applyresume() -> $('#apply_resume').submit() -> full POST -> redirect to page 1.
   *     We send the same POST with fetch(), then re-read the pages already in the table and swap
   *     the rows in place, so page number, merged pages, filters, sort and scroll all stay put.
   * ------------------------------------------------------------------ */
  function toast(msg, bad) {
    const t = document.createElement('div');
    t.className = 'x-toast' + (bad ? ' bad' : '');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), bad ? 6000 : 3500);
  }

  // message the portal wants to show after saving (flash alert / bootbox), if any
  function flashMessage(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const a = doc.querySelector('.alert-success,.alert-danger,.alert-info,.alert-primary');
    let msg = a ? a.textContent : '';
    if (!msg) {
      const js = Array.from(doc.scripts).map(x => x.textContent).join('\n');
      msg = (js.match(/(?:bootbox\.alert|alert)\(\s*(["'`])((?:(?!\1)[\s\S])*?)\1/) || [])[2] || '';
    }
    return msg.replace(/\s+/g, ' ').trim().slice(0, 160);
  }

  async function refreshTable() {
    const table = mainTable(); if (!table) return;
    const search = $('#register_company_list');
    const filtered = !!search && ['startdate', 'enddate', 'selectfor', 'keywords'].some(n => search.elements[n] && search.elements[n].value);
    const fresh = [];
    let creditsText = '';
    for (const p of Array.from(loadedPages).sort((a, b) => a - b)) {
      const url = (filtered ? search.action : location.pathname) + (p > 1 ? '?page=' + p : '');
      const res = await fetch(url, filtered ? { method: 'POST', body: new FormData(search), credentials: 'same-origin' }
                                           : { credentials: 'same-origin' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
      const t = Array.from(doc.querySelectorAll('table.table')).find(x => x.querySelectorAll('thead th').length >= 11);
      if (!t) throw new Error('table not found in response');
      dataRows(t).forEach((tr, k) => { const c = document.importNode(tr, true); c.dataset.xSeq = p * 1000 + k; fresh.push(c); });
      const cr = doc.querySelector('.row.text-danger'); if (cr && !creditsText) creditsText = cr.textContent;
    }
    const tbody = table.tBodies[0];
    dataRows(table).forEach(r => r.remove());
    fresh.forEach(tr => tbody.appendChild(tr));
    dataRows(table).forEach(decorate);
    fillCategories(table);
    applyView(table);                       // same filters + sort as before
    const g = re => parseInt((creditsText.match(re) || [])[1], 10);
    const total = g(/Total Credits\s*:\s*(\d+)/i), used = g(/Used Credits\s*:\s*(\d+)/i), bal = g(/Balance Credits\s*:\s*(\d+)/i);
    if (!isNaN(total) && !isNaN(used)) setCredits(total, used, isNaN(bal) ? total - used : bal);
  }

  async function saveInPlace(form) {
    if (!mainTable()) { form.dataset.xNative = '1'; return nativeSubmit.call(form); }   // other pages: portal's normal flow
    let text;
    try {
      const method = (form.method || 'get').toUpperCase();
      const fd = new FormData(form);
      const res = method === 'GET'
        ? await fetch(form.action + (form.action.includes('?') ? '&' : '?') + new URLSearchParams(fd), { credentials: 'same-origin' })
        : await fetch(form.action, { method, body: fd, credentials: 'same-origin' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      text = await res.text();
    } catch (err) {                          // couldn't save: do exactly what the portal would have done
      console.error('[x-placement] in-place save failed, falling back', err);
      toast('Could not save in place — submitting normally…', true);
      form.dataset.xNative = '1';
      setTimeout(() => nativeSubmit.call(form), 700);
      return;
    }
    toast('✓ ' + (flashMessage(text) || 'Saved'));
    try { await refreshTable(); }
    catch (err) { console.error('[x-placement] refresh failed', err); toast('Saved, but the table could not be refreshed — reload to see it.', true); }
  }

  // jQuery's .submit() ends in the native form.submit(), which fires no 'submit' event, so patch both routes
  const nativeSubmit = HTMLFormElement.prototype.submit;
  HTMLFormElement.prototype.submit = function () {
    if (this.id === 'apply_resume' && !this.dataset.xNative) { saveInPlace(this); return; }
    return nativeSubmit.call(this);
  };
  document.addEventListener('submit', e => {
    if (e.target.id === 'apply_resume' && !e.target.dataset.xNative) { e.preventDefault(); saveInPlace(e.target); }
  }, true);

  // the popup's X button calls closemodel(), which reloads the whole page; just close the popup
  function patchClosemodel() {
    window.closemodel = function () { try { window.jQuery('.modal').modal('hide'); } catch (e) {} };
  }

  /* ------------------------------------------------------------------ *
   * 6. Orchestration
   * ------------------------------------------------------------------ */
  function run() {
    if (!document.body) return;
    enhanceNavbar();
    enhanceCredits();
    const table = mainTable();
    if (DISABLE_BOOTSTRAP_TABLE) {
      // must happen before the portal's end-of-body scripts run
      $$('table[data-toggle="table"]').forEach(t => t.removeAttribute('data-toggle'));
    }
    if (table) {
      table.id = 'x-main';
      buildToolbar(table);
      const curPage = +((location.search.match(/page=(\d+)/) || [])[1]) || 1;
      dataRows(table).forEach((tr, k) => { if (!tr.dataset.xSeq) tr.dataset.xSeq = curPage * 1000 + k; decorate(tr); });
      bindHeaders(table);
      fillCategories(table);
      applyView(table);
    }
    linkifyCells(table);
    sweepWhitePanels();
    measureNavbar();
  }

  let started = false;
  function start() {
    if (started) return;
    started = true;
    try { run(); } catch (e) { console.error('[x-placement]', e); }
    reveal();
  }

  // The portal puts all its (slow, external) scripts after </main>. As soon as the parser
  // has moved past </main> the whole table is in the DOM, so we restyle right then instead of
  // waiting 1-2 s for DOMContentLoaded.
  const contentParsed = () => {
    const m = document.querySelector('main.page-wrapper');
    return document.readyState !== 'loading' || !!(m && m.nextElementSibling);
  };
  const watcher = new MutationObserver(() => { if (contentParsed()) { watcher.disconnect(); start(); } });
  watcher.observe(document, { childList: true, subtree: true });

  document.addEventListener('DOMContentLoaded', () => {
    watcher.disconnect(); start();
    patchClosemodel();                     // after the portal's own scripts have defined it
    let t; // content added later (e.g. the company-profile modal) gets the same treatment
    new MutationObserver(() => { clearTimeout(t); t = setTimeout(sweepWhitePanels, 60); })
      .observe(document.body, { childList: true, subtree: true });
  });
  // idempotent re-runs in case the portal's own scripts touched the DOM afterwards
  window.addEventListener('load', () => { try { run(); } catch (e) {} patchClosemodel(); reveal(); });
  window.addEventListener('resize', () => { try { measureNavbar(); } catch (e) {} });
  setTimeout(() => { started || start(); reveal(); }, REVEAL_FAILSAFE_MS);
})();
