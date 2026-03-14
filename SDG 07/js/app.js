/* ================================================
   FoodBridge – Core App / Router
   ================================================ */

const FBApp = (() => {
  const pages = ['landing', 'auth', 'donor', 'ngo', 'volunteer', 'admin', 'ai', 'notifications'];

  function init() {
    FBData.init();
    setupRouter();
    updateNav();
    FBNotifications.updateBell();

    // Navigate based on hash or check login
    const hash = location.hash.replace('#', '') || '';
    if (hash && pages.includes(hash)) {
      navigate(hash);
    } else {
      const user = FBData.getCurrentUser();
      if (user) {
        navigate(user.role === 'admin' ? 'admin' : user.role);
      } else {
        navigate('landing');
      }
    }
  }

  function setupRouter() {
    window.addEventListener('hashchange', () => {
      const page = location.hash.replace('#', '');
      if (pages.includes(page)) showPage(page);
    });
  }

  function navigate(page) {
    location.hash = page;
    showPage(page);
  }

  async function showPage(page) {
    // Hide all
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));

    // Show target
    const target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');

    // Render page content
    switch (page) {
      case 'donor': await FBDonor.render(); break;
      case 'ngo': await FBNGO.render(); break;
      case 'volunteer': await FBVolunteer.render(); break;
      case 'admin': await FBAdmin.render(); break;
      case 'ai': FBAi.render(); break;
      case 'notifications': await FBNotifications.renderPanel(); break;
    }

    // Update active nav
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (activeLink) activeLink.classList.add('active');

    updateNav();
    await FBNotifications.updateBell();
  }

  function updateNav() {
    const user = FBData.getCurrentUser();
    const navLinks = document.getElementById('nav-links');
    const userPill = document.getElementById('user-pill');

    if (!user) {
      // Not logged in
      navLinks.innerHTML = `
        <li class="nav-item"><a class="nav-link" href="#landing" data-page="landing" onclick="FBApp.navigate('landing')">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="#auth" data-page="auth" onclick="FBApp.navigate('auth')">Login</a></li>
      `;
      userPill.style.display = 'none';
      return;
    }

    userPill.style.display = 'flex';
    userPill.onclick = () => showProfile(); 
    userPill.title = 'View Profile';
    document.getElementById('user-avatar-text').textContent = user.name.charAt(0).toUpperCase();
    document.getElementById('user-name-text').textContent = user.name;

    let links = '';

    switch (user.role) {
      case 'donor':
        links = `
          <li class="nav-item"><a class="nav-link" data-page="donor" onclick="FBApp.navigate('donor')"><i class="bi bi-speedometer2"></i> Dashboard</a></li>
          <li class="nav-item"><a class="nav-link" data-page="ai" onclick="FBApp.navigate('ai')"><i class="bi bi-cpu"></i> AI Predict</a></li>
        `;
        break;
      case 'ngo':
        links = `
          <li class="nav-item"><a class="nav-link" data-page="ngo" onclick="FBApp.navigate('ngo')"><i class="bi bi-speedometer2"></i> Dashboard</a></li>
          <li class="nav-item"><a class="nav-link" data-page="ai" onclick="FBApp.navigate('ai')"><i class="bi bi-cpu"></i> AI Predict</a></li>
        `;
        break;
      case 'volunteer':
        links = `
          <li class="nav-item"><a class="nav-link" data-page="volunteer" onclick="FBApp.navigate('volunteer')"><i class="bi bi-speedometer2"></i> Dashboard</a></li>
        `;
        break;
      case 'admin':
        links = `
          <li class="nav-item"><a class="nav-link" data-page="admin" onclick="FBApp.navigate('admin')"><i class="bi bi-speedometer2"></i> Dashboard</a></li>
          <li class="nav-item"><a class="nav-link" href="manager.html" target="_blank"><i class="bi bi-telephone-outbound"></i> IVR Manager</a></li>
          <li class="nav-item"><a class="nav-link" data-page="donor" onclick="FBApp.navigate('donor')"><i class="bi bi-box-seam"></i> Donors</a></li>
          <li class="nav-item"><a class="nav-link" data-page="ngo" onclick="FBApp.navigate('ngo')"><i class="bi bi-building"></i> NGOs</a></li>
          <li class="nav-item"><a class="nav-link" data-page="volunteer" onclick="FBApp.navigate('volunteer')"><i class="bi bi-truck"></i> Volunteers</a></li>
          <li class="nav-item"><a class="nav-link" data-page="ai" onclick="FBApp.navigate('ai')"><i class="bi bi-cpu"></i> AI</a></li>
        `;
        break;
    }

    navLinks.innerHTML = links;
  }

  // ---------- Auth ----------
  async function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
      FBNotifications.show('Error', 'Please fill in all fields', 'error');
      return;
    }

    const user = await FBData.login(email, password);
    if (user) {
      FBNotifications.show('Welcome!', `Logged in as ${user.name}`, 'info');
      navigate(user.role === 'admin' ? 'admin' : user.role);
    } else {
      FBNotifications.show('Login Failed', 'Invalid email or password', 'error');
    }
  }

  async function handleRegister() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const password = document.getElementById('reg-password').value;
    const role = document.querySelector('.role-option.selected')?.dataset.role;

    let donorType = null;
    if (role === 'donor') {
      const selectedDt = document.querySelector('input[name="donor-type"]:checked');
      if (!selectedDt) {
        FBNotifications.show('Role Required', 'Please select a donor type (Restaurant, Event Handler, etc.)', 'warning');
        return;
      }
      donorType = selectedDt.value;
    }

    if (!name || !email || !phone || !password || !role) {
      FBNotifications.show('Error', 'Please fill all fields and select a role', 'error');
      return;
    }

    const result = await FBData.register({ name, email, phone, password, role, donorType, location: '' });
    if (result.error) {
      FBNotifications.show('Error', result.error, 'error');
    } else {
      FBNotifications.show('Welcome!', `Account created as ${role}`, 'info');
      navigate(role === 'admin' ? 'admin' : role);
    }
  }

  function logout() {
    FBData.logout();
    FBNotifications.show('Logged out', 'See you next time!', 'info');
    navigate('landing');
  }

  function switchAuthTab(tab) {
    document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('register-form').style.display = tab === 'register' ? 'block' : 'none';
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.auth-tab[data-tab="${tab}"]`).classList.add('active');
  }

  function selectRole(el) {
    document.querySelectorAll('.role-option').forEach(r => r.classList.remove('selected'));
    el.classList.add('selected');

    // Show/hide donor types
    const dtContainer = document.getElementById('donor-type-container');
    if (el.dataset.role === 'donor') {
      dtContainer.style.display = 'block';
    } else {
      dtContainer.style.display = 'none';
    }
  }

  async function showProfile(userId = null) {
    const currentUser = FBData.getCurrentUser();
    const id = userId || (currentUser ? currentUser.id : null);
    if (!id) return;

    const user = FBData.getUser(id);
    if (!user) return;

    document.getElementById('prof-avatar').textContent = user.name.charAt(0).toUpperCase();
    document.getElementById('prof-name').textContent = user.name;
    document.getElementById('prof-email').textContent = user.email;
    document.getElementById('prof-phone').textContent = user.phone || 'N/A';
    
    const roleBadge = document.getElementById('prof-role-badge');
    roleBadge.textContent = user.role;
    roleBadge.className = `badge-role badge-${user.role} mb-3 d-inline-block`;

    const donorBox = document.getElementById('prof-donor-type-box');
    if (user.role === 'donor' && user.donorType) {
      donorBox.style.display = 'block';
      document.getElementById('prof-donor-type').textContent = user.donorType;
    } else {
      donorBox.style.display = 'none';
    }

    const modal = new bootstrap.Modal(document.getElementById('profileModal'));
    modal.show();
  }

  // Quick login for demo
  async function quickLogin(role) {
    const demoAccounts = {
      donor: { email: 'anand@restaurant.com', password: '1234' },
      ngo: { email: 'hope@ngo.org', password: '1234' },
      volunteer: { email: 'rahul@volunteer.com', password: '1234' },
      admin: { email: 'admin@foodbridge.com', password: 'admin' }
    };

    const account = demoAccounts[role];
    if (!account) return;

    // Show loading feedback
    FBNotifications.show('Logging in...', `Connecting as ${role}...`, 'info');

    try {
      const user = await FBData.login(account.email, account.password);
      if (user) {
        FBNotifications.show('Welcome!', `Quick login as ${user.name} (${role})`, 'info');
        navigate(role === 'admin' ? 'admin' : role);
      } else {
        FBNotifications.show('Login Failed', `Could not log in as ${role}. Try registering first.`, 'error');
      }
    } catch (err) {
      console.error('Quick login error:', err);
      FBNotifications.show('Login Error', err.message || 'Something went wrong', 'error');
    }
  }

  return {
    init, navigate, handleLogin, handleRegister, logout,
    switchAuthTab, selectRole, quickLogin, showPage, showProfile
  };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', FBApp.init);
