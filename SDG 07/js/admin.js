/* ================================================
   FoodBridge – Admin Dashboard
   ================================================ */

const FBAdmin = (() => {

  async function render() {
    const content = document.getElementById('admin-content');
    if (!content) return;

    // Fetch live data (with fallback for demo mode)
    const donations = await FBData.getDonations();
    let users = FBData.getUsers(); // default to local seed data
    try {
      const { data } = await supabase.from('profiles').select('*');
      if (data && data.length > 0) users = data;
    } catch (e) { /* use local fallback */ }
    
    // Calculate live stats
    const delivered = donations.filter(d => d.status === 'delivered');
    const totalMeals = delivered.reduce((s, d) => s + (d.quantity || 0), 0);
    const wasteReduced = Math.round(totalMeals * 0.45);
    const donors = users.filter(u => u.role === 'donor');
    const ngos = users.filter(u => u.role === 'ngo');

    content.innerHTML = `
      <div class="dashboard-wrapper">
        <div class="container">
          <div class="dashboard-header">
            <div>
              <h2>Admin Dashboard</h2>
              <div class="dash-sub">Platform overview & analytics 📊</div>
            </div>
            <button class="btn-fb btn-outline-fb btn-sm-fb" onclick="FBData.resetData(); location.reload();">
              <i class="bi bi-arrow-clockwise"></i> Reset Demo Data
            </button>
          </div>

          <!-- Stats -->
          <div class="row g-3 mb-4">
            <div class="col-6 col-lg-3">
              <div class="stat-card">
                <div class="stat-icon fi-green"><i class="bi bi-egg-fried"></i></div>
                <div class="stat-value">${totalMeals}</div>
                <div class="stat-label">Meals Distributed</div>
                <div class="stat-change up">↑ 18% this week</div>
              </div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="stat-card">
                <div class="stat-icon fi-cyan"><i class="bi bi-leaf"></i></div>
                <div class="stat-value">${wasteReduced}<span style="font-size:.85rem;">kg</span></div>
                <div class="stat-label">Food Waste Reduced</div>
                <div class="stat-change up">↑ 12% this week</div>
              </div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="stat-card">
                <div class="stat-icon fi-amber"><i class="bi bi-people"></i></div>
                <div class="stat-value">${donors.length}</div>
                <div class="stat-label">Active Donors</div>
                <div class="stat-change up">↑ 3 new</div>
              </div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="stat-card">
                <div class="stat-icon fi-blue"><i class="bi bi-building"></i></div>
                <div class="stat-value">${ngos.length}</div>
                <div class="stat-label">Active NGOs</div>
                <div class="stat-change up">↑ 1 new</div>
              </div>
            </div>
          </div>

          <!-- Additional stats row -->
          <div class="row g-3 mb-4">
            <div class="col-4">
              <div class="stat-card" style="text-align:center;">
                <div class="stat-value" style="color:var(--accent);">${donations.filter(d => d.status === 'pending').length}</div>
                <div class="stat-label">Pending</div>
              </div>
            </div>
            <div class="col-4">
              <div class="stat-card" style="text-align:center;">
                <div class="stat-value" style="color:#8b5cf6;">${donations.filter(d => d.status === 'accepted').length}</div>
                <div class="stat-label">In Transit</div>
              </div>
            </div>
            <div class="col-4">
              <div class="stat-card" style="text-align:center;">
                <div class="stat-value" style="color:var(--info);">${Math.round(totalMeals * 2.5)}<span style="font-size:.85rem;">kg</span></div>
                <div class="stat-label">CO₂ Saved</div>
              </div>
            </div>
          </div>

          <!-- Charts -->
          <div class="row g-4 mb-4">
            <div class="col-lg-8">
              <div class="chart-container">
                <h6><i class="bi bi-bar-chart" style="color:var(--primary);"></i> Monthly Food Distribution</h6>
                <canvas id="chart-distribution" height="280"></canvas>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="chart-container">
                <h6><i class="bi bi-pie-chart" style="color:var(--accent);"></i> Donation Status</h6>
                <canvas id="chart-status" height="280"></canvas>
              </div>
            </div>
          </div>

          <div class="row g-4 mb-4">
            <div class="col-lg-6">
              <div class="chart-container">
                <h6><i class="bi bi-graph-up" style="color:var(--info);"></i> Donor Growth</h6>
                <canvas id="chart-growth" height="240"></canvas>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="chart-container">
                <h6><i class="bi bi-geo" style="color:var(--primary);"></i> Top Locations</h6>
                <canvas id="chart-locations" height="240"></canvas>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="glass p-4 mb-4">
            <h5 style="font-weight:700; margin-bottom:1rem;">
              <i class="bi bi-activity" style="color:var(--primary);"></i> Recent Donations
            </h5>
            <div class="table-responsive">
              <table class="table-fb">
                <thead>
                  <tr>
                    <th>Food</th>
                    <th>Donor</th>
                    <th>Qty</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  ${donations.slice().reverse().map(d => `
                    <tr>
                      <td style="font-weight:600;">${d.food_type}</td>
                      <td>${d.donor_name}</td>
                      <td>${d.quantity}</td>
                      <td><i class="bi bi-geo-alt" style="color:var(--text-muted);"></i> ${d.location}</td>
                      <td><span class="status-badge status-${d.status}">${d.status}</span></td>
                      <td style="color:var(--text-muted); font-size:.82rem;">${formatDate(d.created_at)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Users Table -->
          <div class="glass p-4">
            <h5 style="font-weight:700; margin-bottom:1rem;">
              <i class="bi bi-people" style="color:var(--info);"></i> Registered Users
            </h5>
            <div class="table-responsive">
              <table class="table-fb">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Location</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${users.map(u => `
                    <tr>
                      <td style="font-weight:600;">${u.name}</td>
                      <td style="color:var(--text-muted);">${u.email}</td>
                      <td><span class="badge-role badge-${u.role}">${u.role}</span></td>
                      <td>${u.location}</td>
                      <td style="color:var(--text-muted);">${u.phone}</td>
                      <td>
                        <button class="btn btn-sm btn-outline-info" onclick="FBApp.showProfile('${u.id}')" style="font-size:.7rem; padding: 2px 8px;">
                          View Details
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    // Render charts after DOM is ready
    setTimeout(async () => {
      renderDistributionChart();
      await renderStatusChart();
      renderGrowthChart();
      renderLocationsChart();
    }, 100);
  }

  function renderDistributionChart() {
    const ctx = document.getElementById('chart-distribution');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Meals Distributed',
            data: [120, 190, 230, 310, 280, 390, 420, 380, 450, 520, 480, 610],
            backgroundColor: 'rgba(34, 197, 94, 0.6)',
            borderColor: '#22c55e',
            borderWidth: 1,
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: 'Food Waste Prevented (kg)',
            data: [54, 86, 104, 140, 126, 176, 189, 171, 203, 234, 216, 275],
            backgroundColor: 'rgba(6, 182, 212, 0.4)',
            borderColor: '#06b6d4',
            borderWidth: 1,
            borderRadius: 6,
            borderSkipped: false,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: '#94a3b8', font: { family: 'Inter' } } }
        },
        scales: {
          x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,.05)' } },
          y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,.05)' } }
        }
      }
    });
  }

  async function renderStatusChart() {
    const ctx = document.getElementById('chart-status');
    if (!ctx) return;

    const stats = await FBData.getStats();
    const donations = await FBData.getDonations();

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Delivered', 'Pending', 'In Transit'],
        datasets: [{
          data: [
            donations.filter(d => d.status === 'delivered').length,
            stats.pendingDonations,
            stats.inTransit + donations.filter(d => d.status === 'accepted').length
          ],
          backgroundColor: ['#22c55e', '#f59e0b', '#8b5cf6'],
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#94a3b8', font: { family: 'Inter' }, padding: 15 }
          }
        }
      }
    });
  }

  function renderGrowthChart() {
    const ctx = document.getElementById('chart-growth');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Donors',
            data: [2, 3, 5, 7, 9, 12],
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34,197,94,.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
          },
          {
            label: 'NGOs',
            data: [1, 2, 3, 4, 5, 6],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,.05)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
          },
          {
            label: 'Volunteers',
            data: [1, 3, 4, 6, 8, 10],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245,158,11,.05)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Inter' } } } },
        scales: {
          x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,.05)' } },
          y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,.05)' } }
        }
      }
    });
  }

  function renderLocationsChart() {
    const ctx = document.getElementById('chart-locations');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Mumbai Central', 'Bandra', 'Juhu', 'Dadar', 'Andheri'],
        datasets: [{
          label: 'Donations',
          data: [85, 62, 48, 38, 30],
          backgroundColor: [
            'rgba(34,197,94,.7)',
            'rgba(59,130,246,.7)',
            'rgba(245,158,11,.7)',
            'rgba(139,92,246,.7)',
            'rgba(6,182,212,.7)',
          ],
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,.05)' } },
          y: { ticks: { color: '#94a3b8' }, grid: { display: false } }
        }
      }
    });
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  return { render };
})();
