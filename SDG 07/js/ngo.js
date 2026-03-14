/* ================================================
   FoodBridge – NGO Dashboard
   ================================================ */

const FBNGO = (() => {

  async function render() {
    const content = document.getElementById('ngo-content');
    const user = FBData.getCurrentUser();
    if (!content || !user) return;

    const myDonations = await FBData.getDonationsByNGO(user.id);
    const pendingAll = await FBData.getPendingDonations();
    const accepted = myDonations.filter(d => d.status === 'accepted');
    const delivered = myDonations.filter(d => d.status === 'delivered');
    const totalMeals = delivered.reduce((s, d) => s + (d.quantity || 0), 0);

    content.innerHTML = `
      <div class="dashboard-wrapper">
        <div class="container">
          <div class="dashboard-header">
            <div>
              <h2>NGO Dashboard</h2>
              <div class="dash-sub">Welcome, ${user.name} 🏥</div>
            </div>
            <div class="d-flex gap-2 align-items-center">
              <span class="badge-role badge-ngo">${user.location}</span>
            </div>
          </div>

          <!-- Stats -->
          <div class="row g-3 mb-4">
            <div class="col-6 col-md-3">
              <div class="stat-card">
                <div class="stat-icon fi-amber"><i class="bi bi-hourglass-split"></i></div>
                <div class="stat-value">${pendingAll.length}</div>
                <div class="stat-label">Available Donations</div>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="stat-card">
                <div class="stat-icon fi-blue"><i class="bi bi-hand-thumbs-up"></i></div>
                <div class="stat-value">${accepted.length}</div>
                <div class="stat-label">Accepted</div>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="stat-card">
                <div class="stat-icon fi-green"><i class="bi bi-check2-all"></i></div>
                <div class="stat-value">${delivered.length}</div>
                <div class="stat-label">Received</div>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="stat-card">
                <div class="stat-icon fi-cyan"><i class="bi bi-egg-fried"></i></div>
                <div class="stat-value">${totalMeals}</div>
                <div class="stat-label">Meals Received</div>
              </div>
            </div>
          </div>

          <!-- Available Donations -->
          <div class="glass p-4 mb-4">
            <h5 style="font-weight:700; margin-bottom:1rem;">
              <i class="bi bi-box-seam" style="color:var(--accent);"></i> Available Food Donations
            </h5>
            ${pendingAll.length === 0 ? `
              <div class="empty-state">
                <i class="bi bi-inbox"></i>
                <p>No pending donations at the moment</p>
              </div>
            ` : `
              <div class="row g-3">
                ${pendingAll.map(d => `
                  <div class="col-md-6">
                    <div class="donation-card ${d.image ? 'has-image' : ''}">
                      ${d.image ? `<img src="${d.image}" class="donation-image-card" alt="food">` : ''}
                      <div class="dc-content">
                        <div class="dc-header">
                          <span class="dc-title">${d.food_type}</span>
                          <span class="status-badge status-pending">${d.status}</span>
                        </div>
                        <div class="dc-meta">
                          <span><i class="bi bi-person"></i> ${d.donor_name}</span>
                          <span><i class="bi bi-box"></i> ${d.quantity} meals</span>
                          <span><i class="bi bi-clock"></i> ${formatDate(d.pickup_time)}</span>
                        </div>
                        <div class="dc-meta">
                          <span><i class="bi bi-geo-alt"></i> ${d.location}</span>
                          <span onclick="FBApp.showProfile('${d.donor_id || d.donorId}')" style="color:var(--info); cursor:pointer; margin-left:10px;">
                            <i class="bi bi-info-circle"></i> View Donor
                          </span>
                        </div>
                        <div class="dc-actions">
                          <button class="btn-fb btn-success-fb btn-sm-fb" onclick="FBNGO.acceptDonation('${d.id}')">
                            <i class="bi bi-check-lg"></i> Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- My Accepted / In-progress -->
          <div class="glass p-4">
            <h5 style="font-weight:700; margin-bottom:1rem;">
              <i class="bi bi-list-check" style="color:var(--primary);"></i> My Donations Tracker
            </h5>
            ${myDonations.length === 0 ? `
              <div class="empty-state">
                <i class="bi bi-clipboard-check"></i>
                <p>Accept donations to start tracking</p>
              </div>
            ` : `
              <div class="table-responsive">
                <table class="table-fb">
                  <thead>
                    <tr>
                      <th>Food</th>
                      <th>Donor</th>
                      <th>Qty</th>
                      <th>Pickup</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${myDonations.map(d => `
                      <tr>
                        <td style="font-weight:600;">${d.food_type}</td>
                        <td>${d.donor_name}</td>
                        <td>${d.quantity}</td>
                        <td>${formatDate(d.pickup_time)}</td>
                        <td><span class="status-badge status-${d.status}">${d.status}</span></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  }

  async function acceptDonation(donationId) {
    const user = FBData.getCurrentUser();
    await FBData.updateDonation(donationId, { status: 'accepted', ngo_id: user.id });

    // Notify donor
    const donations = await FBData.getDonations();
    const donation = donations.find(d => d.id === donationId);
    if (donation) {
      await FBData.addNotification(donation.donor_id, `${user.name} accepted your donation of ${donation.food_type}`, 'accepted');

      // Assign volunteer
      const volunteer = FBAi.findAvailableVolunteer();
      if (volunteer) {
        await FBData.updateDonation(donationId, { volunteer_id: volunteer.id });
        await FBData.addNotification(volunteer.id, `Pickup assigned: ${donation.food_type} from ${donation.location} → ${user.name}`, 'pickup');
      }
    }

    FBNotifications.show('Donation Accepted', 'Volunteer will be notified for pickup', 'accepted');
    await render();
    await FBNotifications.updateBell();
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ' ' +
           d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  return { render, acceptDonation };
})();
