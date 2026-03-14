/* ================================================
   FoodBridge – Donor Dashboard
   ================================================ */

const FBDonor = (() => {

  async function render() {
    const content = document.getElementById('donor-content');
    const user = FBData.getCurrentUser();
    if (!content || !user) return;

    const donations = await FBData.getDonationsByDonor(user.id);
    const delivered = donations.filter(d => d.status === 'delivered');
    const totalMeals = delivered.reduce((s, d) => s + (d.quantity || 0), 0);

    content.innerHTML = `
      <div class="dashboard-wrapper">
        <div class="container">
          <div class="dashboard-header">
            <div>
              <h2>Donor Dashboard</h2>
              <div class="dash-sub">Welcome back, ${user.name} 👋 ${user.donor_type ? `(${user.donor_type})` : ''}</div>
            </div>
            <button class="btn-fb btn-primary-fb" onclick="FBDonor.showUploadModal()">
              <i class="bi bi-plus-circle"></i> Donate Food
            </button>
          </div>

          <!-- Stats -->
          <div class="row g-3 mb-4">
            <div class="col-6 col-md-3">
              <div class="stat-card">
                <div class="stat-icon fi-green"><i class="bi bi-box-seam"></i></div>
                <div class="stat-value">${donations.length}</div>
                <div class="stat-label">Total Donations</div>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="stat-card">
                <div class="stat-icon fi-blue"><i class="bi bi-check2-all"></i></div>
                <div class="stat-value">${delivered.length}</div>
                <div class="stat-label">Delivered</div>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="stat-card">
                <div class="stat-icon fi-amber"><i class="bi bi-egg-fried"></i></div>
                <div class="stat-value">${totalMeals}</div>
                <div class="stat-label">Meals Saved</div>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="stat-card">
                <div class="stat-icon fi-cyan"><i class="bi bi-leaf"></i></div>
                <div class="stat-value">${Math.round(totalMeals * 0.45)}<span style="font-size:.9rem;">kg</span></div>
                <div class="stat-label">Waste Reduced</div>
              </div>
            </div>
          </div>

          <!-- Donation History -->
          <div class="glass p-4">
            <h5 style="font-weight:700; margin-bottom:1rem;"><i class="bi bi-clock-history" style="color:var(--primary);"></i> Donation History</h5>
            ${donations.length === 0 ? `
              <div class="empty-state">
                <i class="bi bi-box-seam"></i>
                <p>No donations yet. Start donating to make an impact!</p>
              </div>
            ` : `
              <div class="table-responsive">
                <table class="table-fb">
                  <thead>
                    <tr>
                      <th>Food Type</th>
                      <th>Qty</th>
                      <th>Pickup Time</th>
                      <th>Location</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${donations.map(d => `
                      <tr>
                        <td>
                          ${d.image ? `<img src="${d.image}" class="donation-image-small" alt="food">` : `<div class="donation-image-small d-flex align-items-center justify-content-center bg-dark" style="opacity:0.5;"><i class="bi bi-image"></i></div>`}
                        </td>
                        <td style="font-weight:600;">${d.food_type}</td>
                        <td>${d.quantity} meals</td>
                        <td>${formatDate(d.pickup_time)}</td>
                        <td><i class="bi bi-geo-alt" style="color:var(--text-muted);"></i> ${d.location}</td>
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

      <!-- Upload Modal -->
      <div class="modal-backdrop-fb" id="upload-modal">
        <div class="modal-fb">
          <h5 style="font-weight:700; margin-bottom:1.2rem;"><i class="bi bi-plus-circle" style="color:var(--primary);"></i> Upload Surplus Food</h5>
          <div class="mb-3">
            <label class="form-label-fb">Food Image</label>
            <div class="image-upload-wrapper" onclick="document.getElementById('upload-image-input').click()">
              <i class="bi bi-camera"></i>
              <span>Click to upload food photo</span>
              <div id="image-preview" class="image-preview-container"></div>
            </div>
            <input type="file" id="upload-image-input" style="display:none;" accept="image/*" onchange="FBDonor.handleImageSelect(this)">
          </div>
          <div class="mb-3">
            <label class="form-label-fb">Food Type / Name</label>
            <input type="text" class="form-control-fb" id="upload-food-type" placeholder="e.g. Cooked Meals, Biryani">
          </div>
          <div class="row g-3 mb-3">
            <div class="col-6">
              <label class="form-label-fb">Quantity (meals)</label>
              <input type="number" class="form-control-fb" id="upload-quantity" placeholder="e.g. 50">
            </div>
            <div class="col-6">
              <label class="form-label-fb">Pickup Time</label>
              <input type="datetime-local" class="form-control-fb" id="upload-pickup-time">
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label-fb">Pickup Location</label>
            <input type="text" class="form-control-fb" id="upload-location" value="${user.location || ''}" placeholder="Address">
          </div>
          <div class="d-flex gap-2">
            <button class="btn-fb btn-primary-fb flex-fill" onclick="FBDonor.submitDonation()">
              <i class="bi bi-check-lg"></i> Submit Donation
            </button>
            <button class="btn-fb btn-outline-fb" onclick="FBDonor.hideUploadModal()">Cancel</button>
          </div>
        </div>
      </div>
    `;
  }

  function showUploadModal() {
    document.getElementById('upload-modal').classList.add('show');
  }
  function hideUploadModal() {
    document.getElementById('upload-modal').classList.remove('show');
  }

  let selectedImageData = null;

  function handleImageSelect(input) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        selectedImageData = e.target.result;
        const preview = document.getElementById('image-preview');
        preview.style.backgroundImage = `url(${selectedImageData})`;
        preview.classList.add('active');
      }
      reader.readAsDataURL(input.files[0]);
    }
  }

  async function submitDonation() {
    const user = FBData.getCurrentUser();
    const foodType = document.getElementById('upload-food-type').value.trim();
    const quantity = parseInt(document.getElementById('upload-quantity').value);
    const pickupTime = document.getElementById('upload-pickup-time').value;
    const location = document.getElementById('upload-location').value.trim();
    const image = selectedImageData;

    if (!foodType || !quantity || !pickupTime || !location) {
      FBNotifications.show('Error', 'Please fill in all fields', 'error');
      return;
    }

    const donation = await FBData.addDonation({
      donorId: user.id,
      donorName: user.name,
      foodType,
      quantity,
      pickupTime,
      location,
      image
    });

    selectedImageData = null; // Reset

    // AI: find nearest NGO and notify
    const nearestNGO = FBAi.findNearestNGO(location);
    if (nearestNGO) {
      await FBData.addNotification(nearestNGO.id, `New donation: ${quantity} ${foodType} from ${user.name}`, 'donation');
    }

    // Notify volunteers
    const volunteer = FBAi.findAvailableVolunteer();
    if (volunteer) {
      await FBData.addNotification(volunteer.id, `Pickup request: ${foodType} from ${location}`, 'pickup');
    }

    FBNotifications.show('Donation Submitted!', `${quantity} ${foodType} uploaded successfully`, 'donation');
    hideUploadModal();
    await render();
    await FBNotifications.updateBell();
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ' ' +
           d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  return { render, showUploadModal, hideUploadModal, submitDonation, handleImageSelect };
})();
