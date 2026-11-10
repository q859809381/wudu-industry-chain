(function () {
  'use strict';

  // 用户体系：游客（未登录）/ 注册用户 / 收费用户
  // - USER_KEY 保存当前登录用户（存在即视为已登录）
  // - USERS_KEY 保存注册过的手机号及会员类型，登录即注册、再次登录保留身份
  const AUTH_KEY = 'wudu-industry-auth'; // 密码登录演示账号
  const USER_KEY = 'wudu-industry-user';
  const USERS_KEY = 'wudu-industry-users';
  const DEFAULT_ACCOUNT = '13800138000';
  const DEFAULT_PASSWORD = '123456';
  const CAPTCHA_POOL = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

  let smsPending = null; // { phone, code, expire }
  let smsTimer = null;
  let smsCountdown = 0;
  let captchaCode = '';
  let currentView = 'sms';

  function boot() {
    if (document.getElementById('authShell')) return;

    const authShell = document.createElement('div');
    authShell.id = 'authShell';
    authShell.className = 'auth-shell';
    authShell.innerHTML = [
      // 登录弹窗（短信登录 / 密码登录，登录即注册）
      '<div class="auth-login-view" id="loginView" aria-hidden="true"><div class="auth-login-panel">',
      '<button type="button" class="auth-modal-close" data-auth-close aria-label="关闭登录窗口">×</button>',
      '<div class="auth-brand-mark">W</div>',
      '<h1>五度易链</h1>',
      '<p class="auth-login-subtitle">产业链数据洞察工作台</p>',
      '<p class="auth-modal-hint" id="authModalHint" hidden></p>',
      '<div class="auth-tabs" role="tablist"><button type="button" class="auth-tab is-active" data-auth-tab="sms">短信登录</button><button type="button" class="auth-tab" data-auth-tab="password">密码登录</button></div>',
      '<form class="auth-form is-active" id="smsLoginForm" novalidate>',
      '<label class="auth-input-group"><input id="smsPhone" name="phone" type="tel" inputmode="numeric" maxlength="11" autocomplete="tel" placeholder="请输入手机号" required></label>',
      '<div class="auth-inline-row"><input id="imageCaptchaInput" type="text" maxlength="4" autocomplete="off" placeholder="请输入图形验证码"><canvas id="captchaCanvas" width="110" height="42" title="点击刷新图形验证码"></canvas></div>',
      '<div class="auth-inline-row"><input id="smsCodeInput" type="text" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="请输入验证码"><button type="button" class="auth-code-button" id="smsSendButton">获取验证码</button></div>',
      '<p class="auth-form-error" id="smsLoginError" role="alert"></p>',
      '<button class="auth-primary-button" type="submit">登录 / 注册</button>',
      '<label class="auth-check auth-agreement"><input id="smsAgreement" type="checkbox"><span>勾选并同意 <a href="javascript:void(0)" data-agreement="user">用户协议</a> 与 <a href="javascript:void(0)" data-agreement="privacy">隐私政策</a></span></label>',
      '<p class="auth-login-footnote">未注册账号？登录即自动注册</p>',
      '</form>',
      '<form class="auth-form" id="passwordLoginForm" novalidate>',
      '<label class="auth-input-group"><input id="loginAccount" name="account" type="text" inputmode="tel" autocomplete="username" placeholder="请输入手机号或登录账号" required></label>',
      '<label class="auth-input-group"><input id="loginPassword" name="password" type="password" autocomplete="current-password" placeholder="请输入登录密码" required></label>',
      '<p class="auth-form-error" id="loginError" role="alert"></p>',
      '<button class="auth-primary-button" type="submit">登录</button>',
      '<p class="auth-login-footnote">演示账号：13800138000 / 123456</p>',
      '</form>',
      '</div></div>',
      // 开通服务对话框（注册用户触发收费功能时提示）
      '<div class="account-dialog-layer" id="upgradeDialogLayer" aria-hidden="true"><div class="account-dialog" role="dialog" aria-modal="true" aria-labelledby="upgradeDialogTitle">',
      '<div class="account-dialog-header"><div><p class="dialog-eyebrow">MEMBERSHIP</p><h2 id="upgradeDialogTitle">开通服务</h2></div><button type="button" class="dialog-close" data-upgrade-close aria-label="关闭">×</button></div>',
      '<p class="dialog-description" id="upgradeDialogMessage"></p>',
      '<div class="upgrade-benefit-list">',
      '<span>收费用户专属权益</span>',
      '<ul><li>查看全部 153 条产业链</li><li>企业清单导出</li><li>AI 智能分析</li></ul>',
      '</div>',
      '<div class="upgrade-actions"><button type="button" class="upgrade-secondary-button" id="upgradeContactButton">联系客服</button><button type="button" class="auth-primary-button upgrade-primary-button" id="upgradeBuyButton">开通服务</button></div>',
      '<p class="auth-upgrade-note">演示环境：点击「开通服务」直接体验收费用户权益</p>',
      '</div></div>',
      // 头像菜单
      '<div class="account-menu" id="avatarMenu" role="menu" aria-hidden="true">',
      '<div class="account-menu-header"><span class="account-menu-avatar" id="menuAvatar">W</span><div><strong id="menuAccount">未登录</strong><small id="menuUserType">游客</small></div></div>',
      '<div class="account-menu-divider"></div>',
      '<button type="button" class="account-menu-item" data-account-action="upgrade" role="menuitem" id="menuUpgradeItem"><svg class="ui-icon mini"><use href="#icon-spark"></use></svg><span>开通收费会员（演示）</span></button>',
      '<button type="button" class="account-menu-item" data-account-action="downgrade" role="menuitem" id="menuDowngradeItem" hidden><svg class="ui-icon mini"><use href="#icon-arrow-left"></use></svg><span>恢复注册用户（演示）</span></button>',
      '<button type="button" class="account-menu-item account-menu-logout" data-account-action="logout" role="menuitem"><svg class="ui-icon mini"><use href="#icon-arrow-left"></use></svg><span>退出登录</span></button>',
      '</div>'
    ].join('');
    document.body.appendChild(authShell);

    const loginView = document.getElementById('loginView');
    const authModalHint = document.getElementById('authModalHint');
    const tabs = [...authShell.querySelectorAll('.auth-tab')];
    const smsForm = document.getElementById('smsLoginForm');
    const passwordForm = document.getElementById('passwordLoginForm');
    const smsPhone = document.getElementById('smsPhone');
    const captchaCanvas = document.getElementById('captchaCanvas');
    const imageCaptchaInput = document.getElementById('imageCaptchaInput');
    const smsCodeInput = document.getElementById('smsCodeInput');
    const smsSendButton = document.getElementById('smsSendButton');
    const smsError = document.getElementById('smsLoginError');
    const loginError = document.getElementById('loginError');
    const upgradeLayer = document.getElementById('upgradeDialogLayer');
    const upgradeMessage = document.getElementById('upgradeDialogMessage');
    const avatarButton = document.getElementById('avatarButton') || document.querySelector('.avatar-button');
    const avatarMenu = document.getElementById('avatarMenu');

    /* ---------- 图形验证码 ---------- */
    function drawCaptcha() {
      captchaCode = Array.from({ length: 4 }, () => CAPTCHA_POOL[Math.floor(Math.random() * CAPTCHA_POOL.length)]).join('');
      captchaCanvas.dataset.captcha = captchaCode; // 静态演示原型：供自动化验证读取
      const ctx = captchaCanvas.getContext('2d');
      const width = captchaCanvas.width;
      const height = captchaCanvas.height;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#eef3f5';
      ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < 4; i += 1) {
        ctx.save();
        ctx.translate(14 + i * 22, height / 2 + 6);
        ctx.rotate((Math.random() - 0.5) * 0.5);
        ctx.font = `${18 + Math.floor(Math.random() * 5)}px bold sans-serif`;
        ctx.fillStyle = ['#2c6fb5', '#0c7773', '#b3543d', '#5a6f9c'][i % 4];
        ctx.fillText(captchaCode[i], 0, 0);
        ctx.restore();
      }
      for (let i = 0; i < 4; i += 1) {
        ctx.strokeStyle = 'rgba(60, 90, 110, .25)';
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        ctx.lineTo(Math.random() * width, Math.random() * height);
        ctx.stroke();
      }
      for (let i = 0; i < 24; i += 1) {
        ctx.fillStyle = 'rgba(60, 90, 110, .3)';
        ctx.fillRect(Math.random() * width, Math.random() * height, 1.5, 1.5);
      }
    }
    captchaCanvas.addEventListener('click', () => { drawCaptcha(); imageCaptchaInput.value = ''; });
    drawCaptcha();

    /* ---------- 页签切换 ---------- */
    function switchTab(tabName) {
      currentView = tabName;
      tabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.authTab === tabName));
      smsForm.classList.toggle('is-active', tabName === 'sms');
      passwordForm.classList.toggle('is-active', tabName === 'password');
      clearErrors();
    }
    tabs.forEach((tab) => tab.addEventListener('click', () => switchTab(tab.dataset.authTab)));

    function clearErrors() {
      smsError.textContent = '';
      smsError.classList.remove('has-error');
      loginError.textContent = '';
      loginError.classList.remove('has-error');
    }

    function setError(element, message) {
      element.textContent = message;
      element.classList.toggle('has-error', Boolean(message));
    }

    /* ---------- 短信验证码（演示环境：直接在提示中回显验证码） ---------- */
    smsSendButton.addEventListener('click', () => {
      const phone = smsPhone.value.trim();
      if (!/^1\d{10}$/.test(phone)) return setError(smsError, '请输入有效的11位手机号');
      if (imageCaptchaInput.value.trim().toUpperCase() !== captchaCode) {
        drawCaptcha();
        imageCaptchaInput.value = '';
        return setError(smsError, '图形验证码不正确，请重新输入');
      }
      setError(smsError, '');
      const code = String(Math.floor(100000 + Math.random() * 900000));
      smsPending = { phone, code, expire: Date.now() + 5 * 60 * 1000 };
      notify(`验证码已发送（演示环境验证码：${code}）`);
      smsCountdown = 60;
      smsSendButton.disabled = true;
      smsSendButton.classList.add('is-counting');
      clearInterval(smsTimer);
      smsTimer = setInterval(() => {
        smsCountdown -= 1;
        if (smsCountdown <= 0) {
          clearInterval(smsTimer);
          smsSendButton.disabled = false;
          smsSendButton.classList.remove('is-counting');
          smsSendButton.textContent = '获取验证码';
        } else {
          smsSendButton.textContent = `${smsCountdown}s 后重发`;
        }
      }, 1000);
    });

    /* ---------- 登录即注册 ---------- */
    function findOrRegisterUser(phone) {
      const users = readUsers();
      if (!users[phone]) {
        users[phone] = { type: 'registered', createdAt: new Date().toISOString() };
        saveUsers(users);
        notify('注册成功，已自动登录');
      }
      return users[phone];
    }

    function signIn(phone, type, options = {}) {
      const users = readUsers();
      const user = users[phone] || { type: 'registered', createdAt: new Date().toISOString() };
      const finalType = type || user.type || 'registered';
      users[phone] = { ...user, type: finalType, lastLoginAt: new Date().toISOString() };
      saveUsers(users);
      localStorage.setItem(USER_KEY, JSON.stringify({ phone, type: finalType, loginAt: Date.now() }));
      closeLogin();
      updateAuthUi();
      if (!options.silent) notify(type === 'paid' ? '已开通收费会员（演示）' : '登录成功，欢迎进入五度易链');
      document.dispatchEvent(new CustomEvent('wudu-auth-change', { detail: { phone, type: finalType } }));
    }

    smsForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const phone = smsPhone.value.trim();
      if (!/^1\d{10}$/.test(phone)) return setError(smsError, '请输入有效的11位手机号');
      if (!document.getElementById('smsAgreement').checked) return setError(smsError, '请先勾选同意用户协议与隐私政策');
      if (!smsPending || smsPending.phone !== phone) return setError(smsError, '请先获取短信验证码');
      if (Date.now() > smsPending.expire) return setError(smsError, '验证码已过期，请重新获取');
      if (smsCodeInput.value.trim() !== smsPending.code) return setError(smsError, '短信验证码不正确');
      const isNew = !readUsers()[phone];
      setError(smsError, '');
      smsPending = null;
      smsCodeInput.value = '';
      signIn(phone);
      if (!isNew) notify('登录成功，欢迎进入五度易链');
    });

    passwordForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const account = document.getElementById('loginAccount').value.trim();
      const password = document.getElementById('loginPassword').value;
      const saved = readAccount();
      if (!account || !password) return setError(loginError, '请输入登录账号和密码');
      if (account !== (saved.account || DEFAULT_ACCOUNT) || password !== (saved.password || DEFAULT_PASSWORD)) {
        return setError(loginError, '账号或密码不正确，请检查后重试');
      }
      setError(loginError, '');
      document.getElementById('loginPassword').value = '';
      signIn(account);
    });

    /* ---------- 弹窗开关 ---------- */
    function openLogin(message) {
      closeAvatarMenu();
      upgradeLayer.classList.remove('is-open');
      authModalHint.hidden = !message;
      authModalHint.textContent = message || '';
      clearErrors();
      switchTab('sms');
      loginView.classList.add('is-open');
      loginView.setAttribute('aria-hidden', 'false');
      document.body.classList.add('auth-open');
      setTimeout(() => { smsPhone.focus(); }, 60);
    }

    function closeLogin() {
      loginView.classList.remove('is-open');
      loginView.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('auth-open');
    }

    loginView.addEventListener('click', (event) => {
      if (event.target === loginView || event.target.closest('[data-auth-close]')) closeLogin();
    });

    authShell.querySelectorAll('[data-agreement]').forEach((link) => {
      link.addEventListener('click', () => notify('协议文本为演示占位，正式版本接入法务定稿'));
    });

    /* ---------- 开通服务对话框 ---------- */
    function openUpgrade(message) {
      closeLogin();
      closeAvatarMenu();
      upgradeMessage.textContent = message || '您当前为注册用户，开通服务后可使用收费用户专属权益。';
      upgradeLayer.classList.add('is-open');
      upgradeLayer.setAttribute('aria-hidden', 'false');
    }

    function closeUpgrade() {
      upgradeLayer.classList.remove('is-open');
      upgradeLayer.setAttribute('aria-hidden', 'true');
    }

    upgradeLayer.addEventListener('click', (event) => {
      if (event.target === upgradeLayer || event.target.closest('[data-upgrade-close]')) closeUpgrade();
    });
    document.getElementById('upgradeContactButton').addEventListener('click', () => {
      closeUpgrade();
      notify('客服热线 400-000-0000（演示），工作日 9:00-18:00');
    });
    document.getElementById('upgradeBuyButton').addEventListener('click', () => {
      const user = getUser();
      if (!user) return openLogin('请先登录后再开通服务');
      signIn(user.phone, 'paid');
      closeUpgrade();
    });

    /* ---------- 头像按钮与菜单 ---------- */
    if (avatarButton) {
      avatarButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!getUser()) { openLogin(); return; }
        closeLogin();
        toggleAvatarMenu();
      });
    }

    avatarMenu.addEventListener('click', (event) => {
      const actionButton = event.target.closest('[data-account-action]');
      if (!actionButton) return;
      const action = actionButton.dataset.accountAction;
      closeAvatarMenu();
      if (action === 'upgrade') openUpgrade('开通收费会员后可使用 AI 智能、企业清单导出与全部产业链。');
      if (action === 'downgrade') {
        const user = getUser();
        if (user) signIn(user.phone, 'registered', { silent: true });
        notify('已恢复为注册用户（演示）');
      }
      if (action === 'logout') logout();
    });

    document.addEventListener('click', (event) => {
      if (!avatarMenu.contains(event.target) && event.target !== avatarButton && !event.target.closest('.avatar-button')) closeAvatarMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (upgradeLayer.classList.contains('is-open')) closeUpgrade();
      else if (loginView.classList.contains('is-open')) closeLogin();
      else closeAvatarMenu();
    });
    window.addEventListener('resize', () => {
      if (avatarMenu.classList.contains('is-open')) positionAvatarMenu();
    });

    function toggleAvatarMenu() {
      const open = avatarMenu.classList.toggle('is-open');
      avatarMenu.setAttribute('aria-hidden', String(!open));
      if (avatarButton) avatarButton.setAttribute('aria-expanded', String(open));
      if (open) positionAvatarMenu();
    }

    function closeAvatarMenu() {
      avatarMenu.classList.remove('is-open');
      avatarMenu.setAttribute('aria-hidden', 'true');
      if (avatarButton) avatarButton.setAttribute('aria-expanded', 'false');
    }

    function positionAvatarMenu() {
      if (!avatarButton) return;
      const rect = avatarButton.getBoundingClientRect();
      const menuWidth = Math.max(238, avatarMenu.offsetWidth);
      const left = Math.min(Math.max(16, rect.right - menuWidth), window.innerWidth - menuWidth - 16);
      avatarMenu.style.top = String(rect.bottom + 10) + 'px';
      avatarMenu.style.left = String(left) + 'px';
    }

    function logout() {
      localStorage.removeItem(USER_KEY);
      closeLogin();
      closeUpgrade();
      closeAvatarMenu();
      updateAuthUi();
      notify('已退出登录');
      document.dispatchEvent(new CustomEvent('wudu-auth-change', { detail: { phone: null, type: 'visitor' } }));
    }

    function updateAuthUi() {
      const user = getUser();
      const typeLabel = user ? (user.type === 'paid' ? '收费会员' : '注册用户') : '游客';
      document.getElementById('menuAccount').textContent = user ? user.phone : '未登录';
      document.getElementById('menuUserType').textContent = user ? typeLabel : '游客 — 登录后可查看更多';
      document.getElementById('menuAvatar').textContent = user ? user.phone.slice(-4) : 'W';
      document.getElementById('menuUpgradeItem').hidden = !user || user.type === 'paid';
      document.getElementById('menuDowngradeItem').hidden = !user || user.type !== 'paid';
      if (avatarButton) {
        avatarButton.textContent = user ? (user.type === 'paid' ? 'V' : '会') : '登录';
        avatarButton.title = user ? `${user.phone}（${typeLabel}）` : '点击登录';
        avatarButton.setAttribute('aria-label', user ? `当前用户：${user.phone}（${typeLabel}）` : '点击登录');
      }
    }

    updateAuthUi();

    /* ---------- 存取 ---------- */
    function readAccount() {
      try { return JSON.parse(localStorage.getItem(AUTH_KEY) || '{}'); } catch (error) { return {}; }
    }
    function readUsers() {
      try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}'); } catch (error) { return {}; }
    }
    function saveUsers(users) {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    function notify(message) {
      if (typeof window.showToast === 'function') window.showToast(message);
    }

    /* ---------- 对外 API ---------- */
    window.WuduAuth = {
      isAuthenticated: () => Boolean(getUser()),
      getUser,
      getUserType,
      openLogin,
      openUpgrade,
      logout
    };

    function getUser() {
      try {
        const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
        return user && user.phone ? user : null;
      } catch (error) {
        return null;
      }
    }
    function getUserType() {
      const user = getUser();
      if (!user) return 'visitor';
      return user.type === 'paid' ? 'paid' : 'registered';
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
