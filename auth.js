(function () {
  'use strict';

  const AUTH_KEY = 'wudu-industry-auth';
  const SESSION_KEY = 'wudu-industry-session';
  const DEFAULT_ACCOUNT = '13800138000';
  const DEFAULT_PASSWORD = '123456';

  function boot() {
    if (document.getElementById('authShell')) return;

    const savedAccount = readAccount();
    const defaultAccount = savedAccount.account || DEFAULT_ACCOUNT;
    const authShell = document.createElement('div');
    authShell.id = 'authShell';
    authShell.className = 'auth-shell';
    authShell.innerHTML = [
      '<div class="auth-login-view" id="loginView"><div class="auth-login-panel">',
      '<div class="auth-brand-mark">W</div><p class="auth-eyebrow">WUDU INDUSTRY CHAIN</p>',
      '<h1>五度智链</h1><p class="auth-login-subtitle">产业链数据洞察工作台</p>',
      '<form class="auth-form" id="loginForm" novalidate>',
      '<label class="auth-input-group"><span>登录账号</span><input id="loginAccount" name="account" type="text" inputmode="tel" autocomplete="username" placeholder="请输入手机号或登录账号" required></label>',
      '<label class="auth-input-group"><span>登录密码</span><input id="loginPassword" name="password" type="password" autocomplete="current-password" placeholder="请输入登录密码" required></label>',
      '<div class="auth-form-options"><label class="auth-check"><input id="rememberLogin" type="checkbox" checked><span>记住登录状态</span></label><span class="auth-hint">演示账号：13800138000 / 123456</span></div>',
      '<p class="auth-form-error" id="loginError" role="alert"></p><button class="auth-primary-button" type="submit">登录工作台</button>',
      '</form><p class="auth-login-footnote">数据仅保存在当前浏览器，用于本地原型演示</p>',
      '</div></div>',
      '<div class="account-menu" id="avatarMenu" role="menu" aria-hidden="true">',
      '<div class="account-menu-header"><span class="account-menu-avatar">W</span><div><strong id="menuAccount">', escapeHtml(defaultAccount), '</strong><small>已登录</small></div></div>',
      '<div class="account-menu-divider"></div>',
      '<button type="button" class="account-menu-item" data-account-action="phone" role="menuitem"><svg class="ui-icon mini"><use href="#icon-link"></use></svg><span>修改绑定手机号</span></button>',
      '<button type="button" class="account-menu-item" data-account-action="password" role="menuitem"><svg class="ui-icon mini"><use href="#icon-file"></use></svg><span>修改登录密码</span></button>',
      '<div class="account-menu-divider"></div>',
      '<button type="button" class="account-menu-item account-menu-logout" data-account-action="logout" role="menuitem"><svg class="ui-icon mini"><use href="#icon-arrow-left"></use></svg><span>退出登录</span></button>',
      '</div>',
      '<div class="account-dialog-layer" id="accountDialogLayer" aria-hidden="true"><div class="account-dialog" role="dialog" aria-modal="true" aria-labelledby="accountDialogTitle">',
      '<div class="account-dialog-header"><div><p class="dialog-eyebrow">ACCOUNT SECURITY</p><h2 id="accountDialogTitle"></h2></div><button type="button" class="dialog-close" data-dialog-close aria-label="关闭">×</button></div>',
      '<form id="phoneDialogForm" class="account-dialog-form" data-dialog-form="phone" novalidate><p class="dialog-description">更新绑定手机号后，下次将使用新手机号登录。</p>',
      '<label class="auth-input-group"><span>当前登录密码</span><input name="currentPassword" type="password" autocomplete="current-password" required></label>',
      '<label class="auth-input-group"><span>新手机号</span><input name="newPhone" type="tel" inputmode="numeric" maxlength="11" placeholder="请输入11位手机号" required></label>',
      '<p class="dialog-error" data-dialog-error></p><button class="auth-primary-button" type="submit">确认修改</button></form>',
      '<form id="passwordDialogForm" class="account-dialog-form" data-dialog-form="password" novalidate><p class="dialog-description">密码修改成功后，当前登录状态会保持不变。</p>',
      '<label class="auth-input-group"><span>当前登录密码</span><input name="currentPassword" type="password" autocomplete="current-password" required></label>',
      '<label class="auth-input-group"><span>新登录密码</span><input name="newPassword" type="password" autocomplete="new-password" minlength="6" placeholder="至少6位字符" required></label>',
      '<label class="auth-input-group"><span>确认新密码</span><input name="confirmPassword" type="password" autocomplete="new-password" minlength="6" required></label>',
      '<p class="dialog-error" data-dialog-error></p><button class="auth-primary-button" type="submit">确认修改</button></form>',
      '</div></div>'
    ].join('');
    document.body.appendChild(authShell);

    const loginForm = document.getElementById('loginForm');
    const loginView = document.getElementById('loginView');
    const loginError = document.getElementById('loginError');
    const loginAccount = document.getElementById('loginAccount');
    const loginPassword = document.getElementById('loginPassword');
    const rememberLogin = document.getElementById('rememberLogin');
    const avatarButton = document.getElementById('avatarButton') || document.querySelector('.avatar-button');
    const avatarMenu = document.getElementById('avatarMenu');
    const dialogLayer = document.getElementById('accountDialogLayer');
    const phoneForm = document.getElementById('phoneDialogForm');
    const passwordForm = document.getElementById('passwordDialogForm');
    const appShell = document.querySelector('.app-shell');
    loginAccount.value = defaultAccount;

    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const account = loginAccount.value.trim();
      const password = loginPassword.value;
      const saved = readAccount();
      const validAccount = saved.account || DEFAULT_ACCOUNT;
      const validPassword = saved.password || DEFAULT_PASSWORD;
      if (!account || !password) return setLoginError('请输入登录账号和密码');
      if (account !== validAccount || password !== validPassword) return setLoginError('账号或密码不正确，请检查后重试');
      clearLoginError();
      const storage = rememberLogin.checked ? localStorage : sessionStorage;
      const otherStorage = rememberLogin.checked ? sessionStorage : localStorage;
      storage.setItem(SESSION_KEY, 'signed-in');
      otherStorage.removeItem(SESSION_KEY);
      setAuthenticated(true);
      loginPassword.value = '';
      notify('登录成功，欢迎进入五度智链');
    });

    if (avatarButton) {
      avatarButton.setAttribute('aria-haspopup', 'menu');
      avatarButton.setAttribute('aria-expanded', 'false');
      avatarButton.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (!isAuthenticated()) return;
        closeDialog();
        toggleAvatarMenu();
      });
    }

    avatarMenu.addEventListener('click', function (event) {
      const actionButton = event.target.closest('[data-account-action]');
      if (!actionButton) return;
      const action = actionButton.dataset.accountAction;
      closeAvatarMenu();
      if (action === 'phone') openDialog('phone');
      if (action === 'password') openDialog('password');
      if (action === 'logout') logout();
    });

    dialogLayer.addEventListener('click', function (event) {
      if (event.target === dialogLayer || event.target.closest('[data-dialog-close]')) closeDialog();
    });

    phoneForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const currentPassword = phoneForm.elements.currentPassword.value;
      const newPhone = phoneForm.elements.newPhone.value.trim();
      const account = readAccount();
      if (!checkCurrentPassword(currentPassword, account)) return setDialogError(phoneForm, '当前登录密码不正确');
      if (!/^1\d{10}$/.test(newPhone)) return setDialogError(phoneForm, '请输入有效的11位手机号');
      saveAccount({ account: newPhone, password: account.password || DEFAULT_PASSWORD });
      loginAccount.value = newPhone;
      updateMenuAccount(newPhone);
      closeDialog();
      notify('绑定手机号已更新');
    });

    passwordForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const currentPassword = passwordForm.elements.currentPassword.value;
      const newPassword = passwordForm.elements.newPassword.value;
      const confirmPassword = passwordForm.elements.confirmPassword.value;
      const account = readAccount();
      if (!checkCurrentPassword(currentPassword, account)) return setDialogError(passwordForm, '当前登录密码不正确');
      if (newPassword.length < 6) return setDialogError(passwordForm, '新密码至少需要6位字符');
      if (newPassword !== confirmPassword) return setDialogError(passwordForm, '两次输入的新密码不一致');
      saveAccount({ account: account.account || DEFAULT_ACCOUNT, password: newPassword });
      closeDialog();
      notify('登录密码已更新');
    });

    document.addEventListener('click', function (event) {
      if (!avatarMenu.contains(event.target) && event.target !== avatarButton && !event.target.closest('.avatar-button')) closeAvatarMenu();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      if (dialogLayer.classList.contains('is-open')) closeDialog();
      else closeAvatarMenu();
    });
    window.addEventListener('resize', function () {
      if (avatarMenu.classList.contains('is-open')) positionAvatarMenu();
    });
    setAuthenticated(isAuthenticated());

    function readAccount() {
      try {
        return JSON.parse(localStorage.getItem(AUTH_KEY) || '{}');
      } catch (error) {
        return {};
      }
    }

    function saveAccount(account) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(account));
    }

    function isAuthenticated() {
      return sessionStorage.getItem(SESSION_KEY) === 'signed-in' || localStorage.getItem(SESSION_KEY) === 'signed-in';
    }

    function setAuthenticated(authenticated) {
      loginView.classList.toggle('is-hidden', authenticated);
      authShell.classList.toggle('is-authenticated', authenticated);
      document.body.classList.toggle('auth-required', !authenticated);
      if (appShell) {
        appShell.inert = !authenticated;
        appShell.setAttribute('aria-hidden', String(!authenticated));
      }
      if (avatarButton) avatarButton.tabIndex = authenticated ? 0 : -1;
    }

    function logout() {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      closeAvatarMenu();
      closeDialog();
      setAuthenticated(false);
      loginPassword.value = '';
      loginAccount.value = readAccount().account || DEFAULT_ACCOUNT;
      clearLoginError();
      window.setTimeout(function () { loginAccount.focus(); }, 50);
      notify('已退出登录');
    }

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

    function openDialog(type) {
      document.getElementById('accountDialogTitle').textContent = type === 'phone' ? '修改绑定手机号' : '修改登录密码';
      document.querySelectorAll('[data-dialog-form]').forEach(function (form) {
        form.classList.toggle('is-active', form.dataset.dialogForm === type);
        form.reset();
        setDialogError(form, '');
      });
      dialogLayer.classList.add('is-open');
      dialogLayer.setAttribute('aria-hidden', 'false');
      const activeForm = type === 'phone' ? phoneForm : passwordForm;
      window.setTimeout(function () { activeForm.elements.currentPassword.focus(); }, 30);
    }

    function closeDialog() {
      dialogLayer.classList.remove('is-open');
      dialogLayer.setAttribute('aria-hidden', 'true');
    }

    function updateMenuAccount(account) {
      document.getElementById('menuAccount').textContent = account;
    }

    function checkCurrentPassword(currentPassword, account) {
      return Boolean(currentPassword) && currentPassword === (account.password || DEFAULT_PASSWORD);
    }

    function setLoginError(message) {
      loginError.textContent = message;
      loginError.classList.toggle('has-error', Boolean(message));
    }

    function clearLoginError() {
      setLoginError('');
    }

    function setDialogError(form, message) {
      const error = form.querySelector('[data-dialog-error]');
      error.textContent = message;
      error.classList.toggle('has-error', Boolean(message));
    }

    function notify(message) {
      if (typeof window.showToast === 'function') window.showToast(message);
    }
  }

  function readAccount() {
    try {
      return JSON.parse(localStorage.getItem(AUTH_KEY) || '{}');
    } catch (error) {
      return {};
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
