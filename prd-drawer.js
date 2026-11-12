/* PRD 文档抽屉：左下角白色悬浮按钮 → 左侧滑出窗口。
 * 两个页签：全局介绍、页面与功能描述，均带左侧锚点导航（页签内编号从 1 重排）。
 * 内容来自 prd-content.js（由 PRD docx 自动生成），本文件只负责 UI 与交互。 */
(function () {
  'use strict';

  const PRD_VERSION_LABEL = 'PRD 版本历史';

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
  }

  /* 版本下拉：左列版本列表，点击某个版本后右侧出现该版更新说明 */
  function versionListHtml(versions) {
    if (!versions || !versions.length) return '';
    return versions.map((v, i) => `
      <button type="button" class="prd-version-item${i === 0 ? ' active' : ''}" data-prd-version-index="${i}">
        <strong>${escapeHtml(v.version)}</strong>
        <span class="prd-version-date">${escapeHtml(v.date)}</span>
        ${i === 0 ? '<span class="prd-version-current">当前</span>' : ''}
      </button>`).join('');
  }

  function icon(name, cls) {
    return `<svg class="${cls || 'ui-icon'}" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
  }

  function buildDom() {
    const fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'prd-fab';
    fab.id = 'prdFab';
    fab.title = '查看产品需求文档（PRD）｜快捷键 Tab';
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
          <span class="prd-version-wrap">
            <button type="button" class="prd-version-btn" data-prd-version-btn title="${PRD_VERSION_LABEL}">
              <span data-prd-version-label></span><span class="prd-version-caret">▾</span>
            </button>
            <div class="prd-version-panel" data-prd-version-panel hidden>
              <div class="prd-version-list" data-prd-version-list></div>
              <div class="prd-version-detail" data-prd-version-detail hidden></div>
            </div>
          </span>
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
    const versionBtn = drawer.querySelector('[data-prd-version-btn]');
    const versionLabel = drawer.querySelector('[data-prd-version-label]');
    const versionWrap = drawer.querySelector('.prd-version-wrap');
    const versionPanel = drawer.querySelector('[data-prd-version-panel]');
    const versionList = drawer.querySelector('[data-prd-version-list]');
    const versionDetail = drawer.querySelector('[data-prd-version-detail]');
    const versions = data.versions || [];
    if (versions.length) {
      versionLabel.textContent = `${versions[0].version} · ${versions[0].date}`;
      versionList.innerHTML = versionListHtml(versions);
    } else {
      versionLabel.textContent = '依据 PRD 文档自动生成';
      versionBtn.hidden = true;
    }
    let mode = 'global';
    /* 关闭时的停留状态：页签 + 选中导航项 + 滚动位置，再次打开时恢复 */
    let savedState = null;

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
      hideUpdTip(true);
      const scroll = drawer.querySelector('.prd-doc-scroll');
      if (scroll) scroll.scrollTop = 0;
    }

    function setMode(next) {
      mode = next;
      modeButtons.forEach((btn) => btn.classList.toggle('active', btn.getAttribute('data-prd-mode') === mode));
      renderTab();
    }

    function openDrawer() {
      if (savedState && savedState.mode !== mode) {
        /* 恢复关闭前所在页签（setMode 内部会重新渲染） */
        mode = savedState.mode;
        modeButtons.forEach((btn) => btn.classList.toggle('active', btn.getAttribute('data-prd-mode') === mode));
        renderTab();
      } else {
        renderTab();
      }
      if (savedState) {
        if (savedState.anchor) {
          const btn = navEl.querySelector(`[data-prd-anchor="${CSS.escape(savedState.anchor)}"]`);
          if (btn) {
            navEl.querySelectorAll('[data-prd-anchor]').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            tipEl.textContent = btn.textContent;
          }
        }
        const scroll = drawer.querySelector('.prd-doc-scroll');
        if (scroll && typeof savedState.scrollTop === 'number') {
          scroll.scrollTop = savedState.scrollTop;
        }
      }
      overlay.classList.add('open');
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      const btn = navEl.querySelector('[data-prd-anchor].active');
      const scroll = drawer.querySelector('.prd-doc-scroll');
      savedState = {
        mode,
        anchor: btn ? btn.getAttribute('data-prd-anchor') : null,
        scrollTop: scroll ? scroll.scrollTop : 0,
      };
      overlay.classList.remove('open');
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    fab.addEventListener('click', openDrawer);
    overlay.addEventListener('click', closeDrawer);
    drawer.querySelector('[data-prd-close]').addEventListener('click', closeDrawer);
    /* 版本下拉：点击按钮展开列表；点列表中的版本，右侧出现该版更新说明 */
    function toggleVersionPanel(open) {
      versionPanel.hidden = !open;
      versionBtn.classList.toggle('open', open);
    }
    function showVersionDetail(i) {
      versionList.querySelectorAll('[data-prd-version-index]').forEach((b) =>
        b.classList.toggle('active', Number(b.getAttribute('data-prd-version-index')) === i));
      const v = versions[i];
      const title = i === 0 ? '本版更新内容' : `较 ${versions[i - 1].version} 的更新记录`;
      versionDetail.innerHTML =
        `<div class="prd-version-detail-title">${escapeHtml(title)}</div>` +
        `<ul class="prd-version-changes">${v.changes.map((c) => `<li>${escapeHtml(c)}</li>`).join('')}</ul>`;
      versionDetail.hidden = false;
    }
    versionBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleVersionPanel(versionPanel.hidden);
    });
    versionPanel.addEventListener('click', (event) => event.stopPropagation());
    versionList.addEventListener('click', (event) => {
      const item = event.target.closest('[data-prd-version-index]');
      if (item) showVersionDetail(Number(item.getAttribute('data-prd-version-index')));
    });
    document.addEventListener('click', () => toggleVersionPanel(false));
    /* 脚注气泡：挂在 body 上用 fixed 定位，避免被左侧导航或滚动容器裁剪。
       悬浮临时显示，点击固定/取消；点击其他区域或切换页签时收起 */
    const updTip = document.createElement('div');
    updTip.className = 'prd-upd-tip';
    updTip.hidden = true;
    document.body.appendChild(updTip);
    let pinnedMark = null;
    function showUpdTip(mark, pin) {
      updTip.textContent = mark.getAttribute('data-note') || '';
      updTip.hidden = false;
      const r = mark.getBoundingClientRect();
      const tw = updTip.offsetWidth;
      const th = updTip.offsetHeight;
      let left = r.left + r.width / 2 - tw / 2;
      left = Math.max(12, Math.min(left, window.innerWidth - tw - 12));
      let top = r.bottom + 9;
      if (top + th > window.innerHeight - 12) top = Math.max(12, r.top - th - 9);
      updTip.style.left = `${left}px`;
      updTip.style.top = `${top}px`;
      if (pin) pinnedMark = mark;
    }
    function hideUpdTip(force) {
      if (!force && pinnedMark) return;
      updTip.hidden = true;
      pinnedMark = null;
    }
    contentEl.addEventListener('click', (event) => {
      const mark = event.target.closest('.prd-upd-mark');
      if (!mark) return;
      event.stopPropagation();
      if (pinnedMark === mark) hideUpdTip(true);
      else showUpdTip(mark, true);
    });
    contentEl.addEventListener('mouseover', (event) => {
      const mark = event.target.closest('.prd-upd-mark');
      if (mark && !pinnedMark) showUpdTip(mark, false);
    });
    contentEl.addEventListener('mouseout', (event) => {
      const mark = event.target.closest('.prd-upd-mark');
      if (mark && !pinnedMark) hideUpdTip(true);
    });
    document.addEventListener('click', (event) => {
      if (pinnedMark && !updTip.contains(event.target) && !event.target.closest('.prd-upd-mark')) hideUpdTip(true);
    });
    modeButtons.forEach((btn) => btn.addEventListener('click', () => setMode(btn.getAttribute('data-prd-mode'))));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (!versionPanel.hidden) { toggleVersionPanel(false); return; }
        if (pinnedMark) { hideUpdTip(true); return; }
        if (drawer.classList.contains('open')) closeDrawer();
      }
      if (event.key === 'Tab') {
        /* 输入控件内按 Tab 仍走默认焦点移动，不触发抽屉 */
        const t = event.target;
        if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
        event.preventDefault();
        if (drawer.classList.contains('open')) {
          closeDrawer();
        } else {
          openDrawer();
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
