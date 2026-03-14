/* ================================================
   FoodBridge – Notification System
   ================================================ */

const FBNotifications = (() => {
  const container = () => document.getElementById('toast-container');

  function show(title, message, type = 'info') {
    const el = document.createElement('div');
    el.className = 'toast-fb';

    const iconMap = {
      donation: { icon: 'bi-box-seam', bg: 'fi-green' },
      pickup: { icon: 'bi-truck', bg: 'fi-amber' },
      accepted: { icon: 'bi-check-circle', bg: 'fi-blue' },
      delivered: { icon: 'bi-check2-all', bg: 'fi-green' },
      info: { icon: 'bi-info-circle', bg: 'fi-cyan' },
      warning: { icon: 'bi-exclamation-triangle', bg: 'fi-amber' },
      error: { icon: 'bi-x-circle', bg: 'fi-red' },
    };

    const cfg = iconMap[type] || iconMap.info;

    el.innerHTML = `
      <div class="toast-icon ${cfg.bg}"><i class="bi ${cfg.icon}"></i></div>
      <div class="toast-body">
        <h6>${title}</h6>
        <p>${message}</p>
      </div>
      <button class="toast-close" onclick="this.closest('.toast-fb').remove()"><i class="bi bi-x"></i></button>
    `;

    container().appendChild(el);

    // Auto-remove after 5s
    setTimeout(() => {
      el.classList.add('hiding');
      setTimeout(() => el.remove(), 300);
    }, 5000);
  }

  async function updateBell() {
    const user = FBData.getCurrentUser();
    if (!user) return;
    const count = await FBData.getUnreadCount(user.id);
    const bell = document.querySelector('.notification-badge');
    if (bell) {
      bell.textContent = count;
      bell.style.display = count > 0 ? 'block' : 'none';
    }
  }

  async function renderPanel() {
    const content = document.getElementById('notification-panel-content');
    const user = FBData.getCurrentUser();
    if (!content || !user) return;

    const notes = await FBData.getNotifications(user.id);
    const panel = document.getElementById('notif-panel-list');
    if (!panel) return;

    if (notes.length === 0) {
      panel.innerHTML = '<div class="empty-state"><i class="bi bi-bell-slash"></i><p>No notifications yet</p></div>';
      return;
    }

    panel.innerHTML = notes.map(n => {
      const timeAgo = getTimeAgo(n.time);
      const iconMap = {
        donation: 'bi-box-seam',
        pickup: 'bi-truck',
        accepted: 'bi-check-circle',
        delivered: 'bi-check2-all',
        info: 'bi-info-circle'
      };
      const icon = iconMap[n.type] || 'bi-info-circle';
      const unread = n.status === 'unread' ? 'border-left: 3px solid var(--primary);' : '';

      return `
        <div class="donation-card mb-2" style="${unread}" onclick="FBData.markNotificationRead('${n.id}'); FBNotifications.updateBell(); FBNotifications.renderPanel();">
          <div class="d-flex align-items-center gap-2">
            <i class="bi ${icon}" style="font-size:1.1rem; color: var(--primary);"></i>
            <div>
              <div style="font-size:.85rem; font-weight:${n.status === 'unread' ? '700' : '400'};">${n.message}</div>
              <div style="font-size:.72rem; color:var(--text-muted);">${timeAgo}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function getTimeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  return { show, updateBell, renderPanel };
})();
