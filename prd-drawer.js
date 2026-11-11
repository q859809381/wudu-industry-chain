/* PRD 文档抽屉：左下角白色悬浮按钮 → 左侧滑出窗口。
 * 两个页签：全局介绍、页面与功能描述，均带左侧锚点导航（页签内编号从 1 重排）。
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
          <button type="button" data-prd-mode="global" class="active">全局介绍</button>
          <button type="button" data-prd-mode="pages">页面与功能描述</button>
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
    if (!data || !data.tabs || !data.tabs.length) return;
    const { fab, overlay, drawer } = buildDom();
    const contentEl = drawer.querySelector('[data-prd-content]');
    const navEl = drawer.querySelector('[data-prd-nav]');
    const tipEl = drawer.querySelector('[data-prd-tip]');
    const modeButtons = [...drawer.querySelectorAll('[data-prd-mode]')];
    let mode = 'global';

    /* 各页签左侧锚点导航（全局介绍 / 页面与功能描述 各自一份） */
    function navListFor(m) {
      return m === 'global' ? (data.globalNav || []) : (data.pagesNav || []);
    }

    function bindNavClicks() {
      navEl.querySelectorAll('[data-prd-anchor]').forEach((btn) => {
        btn.addEventListener('click', () => {
          navEl.querySelectorAll('[data-prd-anchor]').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          tipEl.textContent = btn.textContent;
          const target = contentEl.querySelector(`#${CSS.escape(btn.getAttribute('data-prd-anchor'))}`);
          const scroll = drawer.querySelector('.prd-doc-scroll');
          if (target && scroll) {
            scroll.scrollTo({ top: target.offsetTop - scroll.offsetTop - 12, behavior: 'smooth' });
          }
        });
      });
    }

    function escapeHtml(text) {
      return String(text).replace(/[&<>"']/g, (ch) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      }[ch]));
    }

    function renderTab() {
      const navList = navListFor(mode);
      if (navList.length) {
        navEl.hidden = false;
        navEl.innerHTML = navList.map((m) =>
          `<button type="button" class="prd-module-item" data-prd-anchor="${m.id}">${escapeHtml(m.title)}</button>`
        ).join('');
        bindNavClicks();
        navEl.querySelectorAll('[data-prd-anchor]').forEach((b, i) => b.classList.toggle('active', i === 0));
        tipEl.textContent = navList[0].title;
      } else {
        navEl.hidden = true;
        tipEl.textContent = mode === 'global' ? '引言 · 用户角色 · 产品概述 · 全局业务规则' : '';
      }
      contentEl.innerHTML = (mode === 'global' ? data.globalHtml : data.pagesHtml) || '<div class="prd-doc-empty">暂无内容</div>';
      const scroll = drawer.querySelector('.prd-doc-scroll');
      if (scroll) scroll.scrollTop = 0;
    }

    function setMode(next) {
      mode = next;
      modeButtons.forEach((btn) => btn.classList.toggle('active', btn.getAttribute('data-prd-mode') === mode));
      renderTab();
    }

    function openDrawer() {
      renderTab();
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
