/* PRD 文档抽屉：左下角白色悬浮按钮 → 左侧滑出窗口，支持「完整文档 / 按模块查看」两种模式。
 * 内容来自 prd-content.js（由 PRD docx 自动生成），本文件只负责 UI 与交互。 */
(function () {
  'use strict';

  const PRD_VERSION_LABEL = '依据 PRD 文档自动生成';

  function icon(name, cls) {
    return `<svg class="${cls || 'ui-icon'}" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
  }

  function buildDom() {
    const fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'prd-fab';
    fab.id = 'prdFab';
    fab.title = '查看产品需求文档（PRD）';
    fab.setAttribute('aria-label', '查看产品需求文档');
    fab.innerHTML = icon('file');

    const overlay = document.createElement('div');
    overlay.className = 'prd-drawer-overlay';
    overlay.id = 'prdDrawerOverlay';

    const drawer = document.createElement('aside');
    drawer.className = 'prd-drawer';
    drawer.id = 'prdDrawer';
    drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML = `
      <div class="prd-drawer-head">
        <span class="prd-drawer-head-icon">${icon('file')}</span>
        <div class="prd-drawer-head-titles">
          <strong>产业链全景图谱平台 PRD</strong>
          <span>${PRD_VERSION_LABEL}</span>
        </div>
        <button type="button" class="prd-drawer-close" data-prd-close aria-label="关闭">${icon('x', 'ui-icon mini')}</button>
      </div>
      <div class="prd-drawer-toolbar">
        <div class="prd-mode-switch" role="tablist">
          <button type="button" data-prd-mode="full" class="active">完整文档</button>
          <button type="button" data-prd-mode="module">按模块查看</button>
        </div>
        <span class="prd-mode-tip" data-prd-tip></span>
      </div>
      <div class="prd-drawer-body">
        <nav class="prd-module-nav" data-prd-nav hidden></nav>
        <div class="prd-doc-scroll"><div class="prd-doc" data-prd-content></div></div>
      </div>`;

    document.body.appendChild(fab);
    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
    return { fab, overlay, drawer };
  }

  function init() {
    const data = window.WUDU_PRD;
    if (!data || !data.modules || !data.modules.length) return;
    const { fab, overlay, drawer } = buildDom();
    const contentEl = drawer.querySelector('[data-prd-content]');
    const navEl = drawer.querySelector('[data-prd-nav]');
    const tipEl = drawer.querySelector('[data-prd-tip]');
    const modeButtons = [...drawer.querySelectorAll('[data-prd-mode]')];
    let mode = 'full';
    let currentModule = data.modules[0].id;

    /* 模块导航：H1 作为分组标题，H2 作为可点击模块 */
    function renderNav() {
      const parts = [];
      data.modules.forEach((m) => {
        if (m.level === 1) {
          parts.push(`<button type="button" class="prd-module-item" data-prd-module="${m.id}">${escapeHtml(m.title)}</button>`);
        } else {
          parts.push(`<button type="button" class="prd-module-item is-sub" data-prd-module="${m.id}">${escapeHtml(m.title)}</button>`);
        }
      });
      navEl.innerHTML = parts.join('');
      navEl.querySelectorAll('[data-prd-module]').forEach((btn) => {
        btn.addEventListener('click', () => selectModule(btn.getAttribute('data-prd-module')));
      });
    }

    function escapeHtml(text) {
      return String(text).replace(/[&<>"']/g, (ch) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      }[ch]));
    }

    function syncNavActive() {
      navEl.querySelectorAll('[data-prd-module]').forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-prd-module') === currentModule);
      });
      const active = navEl.querySelector('[data-prd-module].active');
      if (active) active.scrollIntoView({ block: 'nearest' });
    }

    function renderModule() {
      const html = data.moduleHtml && data.moduleHtml[currentModule];
      contentEl.innerHTML = html || '<div class="prd-doc-empty">该模块暂无内容</div>';
      const mod = data.modules.find((m) => m.id === currentModule);
      tipEl.textContent = mod ? `正在查看：${mod.title}` : '';
    }

    function renderFull() {
      contentEl.innerHTML = data.fullHtml || '<div class="prd-doc-empty">文档内容为空</div>';
      tipEl.textContent = '滚动查看完整 PRD 内容';
    }

    function setMode(next) {
      mode = next;
      modeButtons.forEach((btn) => btn.classList.toggle('active', btn.getAttribute('data-prd-mode') === mode));
      if (mode === 'full') {
        navEl.hidden = true;
        renderFull();
      } else {
        navEl.hidden = false;
        renderModule();
        syncNavActive();
      }
      const scroll = drawer.querySelector('.prd-doc-scroll');
      if (scroll) scroll.scrollTop = 0;
    }

    function selectModule(id) {
      currentModule = id;
      renderModule();
      syncNavActive();
      const scroll = drawer.querySelector('.prd-doc-scroll');
      if (scroll) scroll.scrollTop = 0;
    }

    function openDrawer() {
      if (mode === 'full') renderFull(); else { renderModule(); syncNavActive(); }
      overlay.classList.add('open');
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      overlay.classList.remove('open');
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    fab.addEventListener('click', openDrawer);
    overlay.addEventListener('click', closeDrawer);
    drawer.querySelector('[data-prd-close]').addEventListener('click', closeDrawer);
    modeButtons.forEach((btn) => btn.addEventListener('click', () => setMode(btn.getAttribute('data-prd-mode'))));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
    });

    renderNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
