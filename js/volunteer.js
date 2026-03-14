/* ================================================
   FoodBridge – Volunteer Dashboard
   ================================================ */

const FBVolunteer = (() => {
  let map = null;
  let markers = [];
  let moveInterval = null;

  async function render() {
    const content = document.getElementById('volunteer-content');
    const user = FBData.getCurrentUser();
    if (!content || !user) return;

    const donations = await FBData.getDonations();
    const myTasks = donations.filter(d => d.volunteer_id === user.id);
    const pending = myTasks.filter(d => d.status === 'accepted');
    const inTransit = myTasks.filter(d => d.status === 'picked');
    const completed = myTasks.filter(d => d.status === 'delivered');

    content.innerHTML = `
      <div class="dashboard-wrapper">
        <div class="container">
          <div class="dashboard-header">
            <div>
              <h2>Volunteer Dashboard</h2>
              <div class="dash-sub">Assigned pickups & deliveries 🚚</div>
            </div>
            <div class="d-flex gap-2">
              <span class="badge-role badge-volunteer">Available</span>
            </div>
          </div>

          <!-- Stats -->
          <div class="row g-3 mb-4">
            <div class="col-6 col-md-3">
              <div class="stat-card">
                <div class="stat-icon fi-amber"><i class="bi bi-bell"></i></div>
                <div class="stat-value">${pending.length}</div>
                <div class="stat-label">Pending Pickups</div>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="stat-card">
                <div class="stat-icon fi-purple"><i class="bi bi-truck"></i></div>
                <div class="stat-value">${inTransit.length}</div>
                <div class="stat-label">In Transit</div>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="stat-card">
                <div class="stat-icon fi-green"><i class="bi bi-check2-all"></i></div>
                <div class="stat-value">${completed.length}</div>
                <div class="stat-label">Completed</div>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="stat-card">
                <div class="stat-icon fi-cyan"><i class="bi bi-egg-fried"></i></div>
                <div class="stat-value">${completed.reduce((s, d) => s + d.quantity, 0)}</div>
                <div class="stat-label">Meals Delivered</div>
              </div>
            </div>
          </div>

          <!-- Pending Pickups -->
          <div class="glass p-4 mb-4">
            <h5 style="font-weight:700; margin-bottom:1rem;">
              <i class="bi bi-bell" style="color:var(--accent);"></i> Pending Pickups
            </h5>
            ${pending.length === 0 ? `
              <div class="empty-state">
                <i class="bi bi-inbox"></i>
                <p>No pending pickups right now</p>
              </div>
            ` : `
              <div class="row g-3">
                ${pending.map(d => `
                    <div class="col-md-6">
                      <div class="donation-card ${d.image ? 'has-image' : ''}">
                        ${d.image ? `<img src="${d.image}" class="donation-image-card" alt="food">` : ''}
                        <div class="dc-content">
                          <div class="dc-header">
                            <span class="dc-title">${d.food_type}</span>
                            <span class="status-badge status-accepted">Pickup Required</span>
                          </div>
                          <div class="dc-meta">
                            <span><i class="bi bi-person"></i> ${d.donor_name}</span>
                            <span><i class="bi bi-box"></i> ${d.quantity} meals</span>
                          </div>
                          <div class="dc-meta">
                            <span><i class="bi bi-geo-alt"></i> From: ${d.location}</span>
                          </div>
                          <div class="dc-meta">
                            <span><i class="bi bi-clock"></i> Pickup by: ${formatDate(d.pickup_time)}</span>
                          </div>
                          <div class="dc-actions">
                            <button class="btn-fb btn-primary-fb btn-sm-fb" onclick="FBVolunteer.startPickup('${d.id}')">
                              <i class="bi bi-truck"></i> Start Pickup
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- In Transit -->
          <div class="glass p-4 mb-4">
            <h5 style="font-weight:700; margin-bottom:1rem;">
              <i class="bi bi-truck" style="color:var(--info);"></i> In Transit
            </h5>
            ${inTransit.length === 0 ? `
              <div class="empty-state">
                <i class="bi bi-truck"></i>
                <p>No deliveries in transit</p>
              </div>
            ` : `
              <div class="row g-3">
                ${inTransit.map(d => `
                    <div class="col-md-6">
                      <div class="donation-card" style="border-color: rgba(139,92,246,.2);">
                        <div class="dc-header">
                          <span class="dc-title">${d.food_type}</span>
                          <span class="status-badge status-picked">In Transit</span>
                        </div>
                        <div class="dc-meta">
                          <span><i class="bi bi-geo-alt"></i> ${d.location}</span>
                          <span><i class="bi bi-box"></i> ${d.quantity} meals</span>
                        </div>
                        <div class="dc-actions">
                          <button class="btn-fb btn-success-fb btn-sm-fb" onclick="FBVolunteer.markDelivered('${d.id}')">
                            <i class="bi bi-check2-all"></i> Mark Delivered
                          </button>
                        </div>
                      </div>
                    </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Map -->
          <div class="glass p-4 mb-4">
            <h5 style="font-weight:700; margin-bottom:1rem;">
              <i class="bi bi-map" style="color:var(--primary);"></i> Live Route Tracking
            </h5>
            <div id="volunteer-map" class="map-placeholder"></div>
          </div>

           <!-- Completed -->
          <div class="glass p-4 mb-4">
            <h5 style="font-weight:700; margin-bottom:1rem;">
              <i class="bi bi-check-circle" style="color:var(--success);"></i> Completed Deliveries
            </h5>
            ${completed.length === 0 ? `
              <div class="empty-state">
                <i class="bi bi-check-circle"></i>
                <p>No completed deliveries yet</p>
              </div>
            ` : `
              <div class="table-responsive">
                <table class="table-fb">
                  <thead>
                    <tr><th>Food</th><th>From</th><th>Qty</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    ${completed.map(d => `
                      <tr>
                        <td style="font-weight:600;">${d.food_type}</td>
                        <td>${d.donor_name}</td>
                        <td>${d.quantity} meals</td>
                        <td><span class="status-badge status-delivered">Delivered</span></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>

          <!-- 🎁 Reward Coupons -->
          <div class="glass p-4">
            <h5 style="font-weight:700; margin-bottom:1rem;">
              <i class="bi bi-gift" style="color:#f59e0b;"></i> Reward Coupons
              <span style="font-size:.75rem; background:linear-gradient(135deg,#f59e0b,#ef4444); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-left:.5rem; font-weight:800;">
                ${completed.length} deliveries = ${getRewardPoints(completed.length)} pts
              </span>
            </h5>

            <!-- Points Progress -->
            <div style="margin-bottom:1.5rem;">
              <div style="display:flex; justify-content:space-between; font-size:.75rem; color:var(--text-muted); margin-bottom:.35rem;">
                <span>Next reward: ${getNextTier(completed.length).name}</span>
                <span>${completed.length} / ${getNextTier(completed.length).target} deliveries</span>
              </div>
              <div style="height:8px; background:rgba(255,255,255,.06); border-radius:99px; overflow:hidden;">
                <div style="height:100%; width:${Math.min(100, (completed.length / getNextTier(completed.length).target) * 100)}%; background:linear-gradient(90deg,var(--primary),var(--accent)); border-radius:99px; transition:width .4s;"></div>
              </div>
            </div>

            ${generateCoupons(completed.length).length === 0 ? `
              <div class="empty-state">
                <i class="bi bi-gift" style="font-size:2rem;"></i>
                <p>Complete deliveries to earn reward coupons!</p>
                <small style="color:var(--text-muted);">Your first coupon unlocks at 3 deliveries</small>
              </div>
            ` : `
              <div class="row g-3">
                ${generateCoupons(completed.length).map(coupon => `
                  <div class="col-md-6 col-lg-4">
                    <div style="background:rgba(255,255,255,.03); border:1px solid ${coupon.color}33; border-radius:12px; padding:1rem; position:relative; overflow:hidden; transition:transform .2s, box-shadow .2s;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 25px ${coupon.color}22';" onmouseout="this.style.transform=''; this.style.boxShadow='';">
                      <div style="position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,${coupon.color},${coupon.colorEnd});"></div>
                      <div style="display:flex; align-items:center; gap:.75rem; margin-bottom:.75rem;">
                        <div style="width:40px; height:40px; border-radius:10px; background:${coupon.color}15; display:flex; align-items:center; justify-content:center; font-size:1.3rem;">
                          ${coupon.icon}
                        </div>
                        <div>
                          <div style="font-weight:700; font-size:.9rem; color:${coupon.color};">${coupon.tier}</div>
                          <div style="font-size:.7rem; color:var(--text-muted);">${coupon.description}</div>
                        </div>
                      </div>
                      <div style="background:rgba(0,0,0,.25); border-radius:8px; padding:.5rem .75rem; font-family:monospace; font-size:.8rem; letter-spacing:2px; text-align:center; color:var(--text-primary); margin-bottom:.5rem; border:1px dashed ${coupon.color}44;">
                        ${coupon.code}
                      </div>
                      <div style="display:flex; justify-content:space-between; align-items:center; font-size:.7rem;">
                        <span style="color:var(--text-muted);">Valid till: ${coupon.expiry}</span>
                        <button class="btn-fb btn-sm-fb" style="font-size:.65rem; padding:4px 10px; background:${coupon.color}22; color:${coupon.color}; border:1px solid ${coupon.color}44;" onclick="FBVolunteer.claimCoupon('${coupon.code}')">
                          <i class="bi bi-download"></i> Claim
                        </button>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      </div>
    `;

    setTimeout(() => initMap(pending.concat(inTransit)), 100);
  }

  function initMap(tasks) {
    if (map) {
      map.remove();
      map = null;
    }

    const mapElement = document.getElementById('volunteer-map');
    if (!mapElement) return;

    // Use simulated starting point (Bangalore center)
    const center = [12.9716, 77.5946];
    map = L.map('volunteer-map').setView(center, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    if (moveInterval) clearInterval(moveInterval);

    // Add simulated "You" marker
    const youIcon = L.divIcon({
      html: '<div style="background:var(--info); width:15px; height:15px; border-radius:50%; border:3px solid #fff; box-shadow:0 0 10px var(--info);"></div>',
      className: '',
      iconSize: [20, 20]
    });
    const youMarker = L.marker(center, { icon: youIcon }).addTo(map).bindPopup('<b>You (Volunteer)</b><br>Available for pickups');

    // Live movement simulation
    let currentPos = [...center];
    moveInterval = setInterval(() => {
      currentPos[0] += (Math.random() - 0.5) * 0.0005;
      currentPos[1] += (Math.random() - 0.5) * 0.0005;
      youMarker.setLatLng(currentPos);
    }, 3000);

    // Add simulated markers for tasks
    tasks.forEach(task => {
      // Generate some offset coordinates so they don't all stack on center
      const offsetLat = (Math.random() - 0.5) * 0.05;
      const offsetLng = (Math.random() - 0.5) * 0.05;
      const pos = [center[0] + offsetLat, center[1] + offsetLng];

      const taskIcon = L.divIcon({
        html: `<div style="background:var(--primary); width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; font-size:12px; border:2px solid #fff;">🍲</div>`,
        className: '',
        iconSize: [24, 24]
      });

      L.marker(pos, { icon: taskIcon }).addTo(map)
        .bindPopup(`<b>${task.food_type}</b><br>${task.donor_name}<br><small>${task.status}</small>`);

      // Add "route" line to center
      L.polyline([center, pos], { color: 'var(--primary)', weight: 3, dashArray: '10, 10', opacity: 0.5 }).addTo(map);
    });

    if (tasks.length > 0) {
      const allPoints = tasks.map((_, i) => [center[0] + (Math.random()-0.5)*0.05, center[1] + (Math.random()-0.5)*0.05]);
      allPoints.push(center);
      map.fitBounds(allPoints);
    }
  }

  async function startPickup(donationId) {
    await FBData.updateDonation(donationId, { status: 'picked' });

    const donations = await FBData.getDonations();
    const donation = donations.find(d => d.id === donationId);
    if (donation) {
      // Notify NGO
      if (donation.ngo_id) {
        await FBData.addNotification(donation.ngo_id, `Volunteer picked up ${donation.food_type} – en route!`, 'pickup');
      }
    }

    FBNotifications.show('Pickup Started', 'Navigate to donor location', 'pickup');
    await render();
    await FBNotifications.updateBell();
  }

  async function markDelivered(donationId) {
    await FBData.updateDonation(donationId, { status: 'delivered' });

    const donations = await FBData.getDonations();
    const donation = donations.find(d => d.id === donationId);
    if (donation) {
      // Notify donor and NGO
      await FBData.addNotification(donation.donor_id, `Your donation of ${donation.food_type} has been delivered!`, 'delivered');
      if (donation.ngo_id) {
        await FBData.addNotification(donation.ngo_id, `${donation.food_type} delivered successfully!`, 'delivered');
      }
    }

    FBNotifications.show('Delivery Complete!', 'Food has been delivered to the NGO', 'delivered');
    await render();
    await FBNotifications.updateBell();
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ' ' +
           d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  // ---------- Reward Coupon Helpers ----------
  function getRewardPoints(deliveryCount) {
    return deliveryCount * 10;
  }

  function getNextTier(deliveryCount) {
    const tiers = [
      { name: '🥉 Bronze Coupon', target: 3 },
      { name: '🥈 Silver Coupon', target: 5 },
      { name: '🥇 Gold Coupon', target: 10 },
      { name: '💎 Platinum Coupon', target: 25 }
    ];
    for (const tier of tiers) {
      if (deliveryCount < tier.target) return tier;
    }
    return { name: '🌟 Legend Status', target: 50 };
  }

  function generateCoupons(deliveryCount) {
    const coupons = [];
    const now = new Date();
    const expiry30 = new Date(now.getTime() + 30 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const expiry60 = new Date(now.getTime() + 60 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const expiry90 = new Date(now.getTime() + 90 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    if (deliveryCount >= 3) {
      coupons.push({
        tier: '🥉 Bronze', description: '10% off partner restaurants',
        code: 'FB-BRONZE-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        color: '#cd7f32', colorEnd: '#b87333', icon: '🎫', expiry: expiry30
      });
    }
    if (deliveryCount >= 5) {
      coupons.push({
        tier: '🥈 Silver', description: '₹100 dining voucher',
        code: 'FB-SILVER-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        color: '#c0c0c0', colorEnd: '#a8a8a8', icon: '🏷️', expiry: expiry60
      });
    }
    if (deliveryCount >= 10) {
      coupons.push({
        tier: '🥇 Gold', description: 'Free meal at partner outlet',
        code: 'FB-GOLD-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        color: '#ffd700', colorEnd: '#f59e0b', icon: '🍽️', expiry: expiry90
      });
    }
    if (deliveryCount >= 25) {
      coupons.push({
        tier: '💎 Platinum', description: 'FoodBridge Hero certificate + ₹500 voucher',
        code: 'FB-PLAT-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        color: '#a78bfa', colorEnd: '#8b5cf6', icon: '🏆', expiry: expiry90
      });
    }
    return coupons;
  }

  function claimCoupon(code) {
    // Copy coupon code to clipboard
    navigator.clipboard.writeText(code).then(() => {
      FBNotifications.show('Coupon Claimed! 🎉', `Code "${code}" copied to clipboard`, 'info');
    }).catch(() => {
      FBNotifications.show('Coupon Code', code, 'info');
    });
  }

  return { render, startPickup, markDelivered, claimCoupon };
})();

