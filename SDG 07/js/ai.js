/* ================================================
   FoodBridge – AI Prediction Module
   ================================================ */

const FBAi = (() => {
  // Simple linear regression simulation
  // Based on: surplus = 0.65 * event_size - 12 + noise
  function predictSurplus(eventSize) {
    const base = 0.65 * eventSize - 12;
    const noise = (Math.random() - 0.5) * 8;
    return Math.max(0, Math.round(base + noise));
  }

  // Food type multipliers
  const typeMultipliers = {
    'cooked_meals': 1.0,
    'dry_goods': 0.3,
    'bakery': 0.8,
    'fruits_vegs': 0.6,
    'dairy': 0.9,
    'beverages': 0.4
  };

  function predictWithType(eventSize, foodType) {
    const mult = typeMultipliers[foodType] || 1.0;
    const base = (0.65 * eventSize - 12) * mult;
    const noise = (Math.random() - 0.5) * 6;
    return Math.max(0, Math.round(base + noise));
  }

  // Find nearest NGO (simulated distance)
  function findNearestNGO(donorLocation) {
    const ngos = FBData.getNGOs();
    if (ngos.length === 0) return null;

    // Simulated distances
    const distances = ngos.map(ngo => ({
      ...ngo,
      distance: (Math.random() * 8 + 0.5).toFixed(1)
    }));

    distances.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    return distances[0];
  }

  // Find available volunteer
  function findAvailableVolunteer() {
    const volunteers = FBData.getVolunteers();
    const available = volunteers.filter(v => v.availability !== false);
    return available.length > 0 ? available[Math.floor(Math.random() * available.length)] : null;
  }

  // Spoilage risk based on time and food type
  function calculateSpoilageRisk(hoursUntilPickup, foodType) {
    const baseRisk = Math.max(0, 100 - hoursUntilPickup * 15);
    const mult = typeMultipliers[foodType] || 1.0;
    return Math.min(100, Math.round(baseRisk * mult));
  }

  // Render AI prediction page
  function render() {
    const content = document.getElementById('ai-content');
    if (!content) return;

    content.innerHTML = `
      <div class="dashboard-wrapper">
        <div class="container">
          <div class="dashboard-header">
            <div>
              <h2><i class="bi bi-cpu" style="color:var(--primary);"></i> AI Prediction Engine</h2>
              <div class="dash-sub">Predict surplus food quantities using machine learning simulation</div>
            </div>
          </div>

          <div class="row g-4">
            <!-- Prediction Form -->
            <div class="col-lg-6">
              <div class="ai-card">
                <h5 style="font-weight:700; margin-bottom:1.2rem;">
                  <i class="bi bi-graph-up" style="color:var(--primary);"></i> Surplus Prediction
                </h5>
                <div class="mb-3">
                  <label class="form-label-fb">Event / Preparation Size (meals)</label>
                  <input type="number" class="form-control-fb" id="ai-event-size" placeholder="e.g. 200" value="200">
                </div>
                <div class="mb-3">
                  <label class="form-label-fb">Food Type</label>
                  <select class="form-control-fb form-select-fb" id="ai-food-type">
                    <option value="cooked_meals">Cooked Meals</option>
                    <option value="bakery">Bakery Items</option>
                    <option value="fruits_vegs">Fruits & Vegetables</option>
                    <option value="dairy">Dairy Products</option>
                    <option value="dry_goods">Dry Goods</option>
                    <option value="beverages">Beverages</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label-fb">Hours Until Pickup</label>
                  <input type="number" class="form-control-fb" id="ai-hours" placeholder="e.g. 3" value="3">
                </div>
                <button class="btn-fb btn-primary-fb w-100" onclick="FBAi.runPrediction()">
                  <i class="bi bi-lightning-charge"></i> Run Prediction
                </button>

                <div id="ai-result-box" style="display:none;">
                  <div class="ai-result mt-3">
                    <div class="ai-value" id="ai-predicted-value">0</div>
                    <div class="ai-label">Predicted Surplus Meals</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Smart Matching -->
            <div class="col-lg-6">
              <div class="ai-card">
                <h5 style="font-weight:700; margin-bottom:1.2rem;">
                  <i class="bi bi-geo-alt" style="color:var(--info);"></i> Smart Matching Result
                </h5>
                <div id="ai-match-result">
                  <div class="empty-state">
                    <i class="bi bi-arrow-left-circle"></i>
                    <p>Run a prediction to see matching results</p>
                  </div>
                </div>
              </div>

              <div class="ai-card mt-4">
                <h5 style="font-weight:700; margin-bottom:1.2rem;">
                  <i class="bi bi-exclamation-triangle" style="color:var(--accent);"></i> Spoilage Risk
                </h5>
                <div id="ai-spoilage-result">
                  <div class="empty-state">
                    <i class="bi bi-clock-history"></i>
                    <p>Run a prediction to see spoilage risk</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Historical Data -->
          <div class="row mt-4">
            <div class="col-12">
              <div class="glass p-4">
                <h5 style="font-weight:700; margin-bottom:1rem;">
                  <i class="bi bi-bar-chart" style="color:var(--accent);"></i> Historical Prediction Accuracy
                </h5>
                <div class="chart-container" style="border:none; padding:0;">
                  <canvas id="ai-accuracy-chart" height="250"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    renderAccuracyChart();
  }

  async function runPrediction() {
    const eventSize = parseInt(document.getElementById('ai-event-size').value) || 100;
    const foodType = document.getElementById('ai-food-type').value;
    const hours = parseInt(document.getElementById('ai-hours').value) || 3;

    // Show loading state
    const matchDiv = document.getElementById('ai-match-result');
    const spoilageDiv = document.getElementById('ai-spoilage-result');
    matchDiv.innerHTML = '<div class="empty-state"><div class="spinner-border text-primary" role="status"></div><p>Gemini is thinking...</p></div>';
    spoilageDiv.innerHTML = '<div class="empty-state"><div class="spinner-border text-accent" role="status"></div><p>Calculating risks...</p></div>';

    try {
      // Real Gemini API Call
      const prompt = `Act as an expert food logistics and sustainability consultant. 
      Input Data:
      - Event/Preparation Size: ${eventSize} meals
      - Food Type: ${foodType}
      - Hours until pickup: ${hours} hours

      Tasks:
      1. Predict the likely surplus quantity (an integer).
      2. Calculate spoilage risk percentage (0-100).
      3. Provide a brief (1 sentence) matching advice or insight based on this food type and timeline.

      Return ONLY a JSON object with keys: "surplus", "risk", "insight".`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${FBConfig.GEMINI_MODEL}:generateContent?key=${FBConfig.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      const result = JSON.parse(text.replace(/```json/g, '').replace(/```/g, ''));

      // Update UI
      document.getElementById('ai-result-box').style.display = 'block';
      const valueEl = document.getElementById('ai-predicted-value');
      animateNumber(valueEl, 0, result.surplus, 800);

      // Insights & Matching
      const nearestNGO = findNearestNGO('');
      matchDiv.innerHTML = `
        <div class="glass p-3 mb-3" style="border-left: 4px solid var(--primary);">
          <div style="font-weight:700; color:var(--primary); font-size:.85rem; text-transform:uppercase; margin-bottom:.5rem;">Gemini Insight</div>
          <p style="font-size:.9rem; line-height:1.4; margin:0;">"${result.insight}"</p>
        </div>
        ${nearestNGO ? `
          <div class="donation-card">
            <div class="dc-header">
              <span class="dc-title">${nearestNGO.name}</span>
              <span class="status-badge status-accepted">${nearestNGO.distance} km</span>
            </div>
            <div class="dc-meta">
              <span><i class="bi bi-geo-alt"></i> ${nearestNGO.location}</span>
            </div>
          </div>
        ` : ''}
      `;

      // Spoilage risk
      const spoilageRisk = result.risk;
      const riskColor = spoilageRisk > 70 ? 'var(--danger)' : spoilageRisk > 40 ? 'var(--accent)' : 'var(--success)';
      const riskLabel = spoilageRisk > 70 ? 'HIGH' : spoilageRisk > 40 ? 'MEDIUM' : 'LOW';
      spoilageDiv.innerHTML = `
        <div class="d-flex align-items-center gap-3 mb-2">
          <div style="font-size:2.5rem; font-weight:900; color:${riskColor};">${spoilageRisk}%</div>
          <div>
            <div style="font-weight:700; color:${riskColor};">${riskLabel} RISK</div>
            <div style="font-size:.82rem; color:var(--text-muted); text-transform:capitalize;">${foodType.replace('_', ' ')}</div>
          </div>
        </div>
        <div style="width:100%; height:8px; background:var(--bg-input); border-radius:4px; overflow:hidden;">
          <div style="width:${spoilageRisk}%; height:100%; background:${riskColor}; border-radius:4px; transition: width .8s ease;"></div>
        </div>
      `;

      FBNotifications.show('Gemini Prediction', `Surplus forecasted: ${result.surplus} meals`, 'success');
      
    } catch (err) {
      console.error(err);
      FBNotifications.show('Prediction Error', 'Could not connect to Gemini AI', 'error');
      matchDiv.innerHTML = '<div class="empty-state text-danger"><i class="bi bi-exclamation-triangle"></i><p>Connection failed</p></div>';
    }
  }

  function animateNumber(el, start, end, duration) {
    const startTime = performance.now();
    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function renderAccuracyChart() {
    const ctx = document.getElementById('ai-accuracy-chart');
    if (!ctx) return;

    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const predicted = [45, 52, 48, 61, 55, 70, 65, 72, 68, 80, 75, 85];
    const actual = [42, 50, 51, 58, 53, 68, 62, 70, 71, 78, 73, 82];

    new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Predicted Surplus',
            data: predicted,
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34,197,94,.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: '#22c55e'
          },
          {
            label: 'Actual Surplus',
            data: actual,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,.05)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: '#3b82f6'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: '#94a3b8', font: { family: 'Inter' } }
          }
        },
        scales: {
          x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,.05)' } },
          y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,.05)' } }
        }
      }
    });
  }

  return { render, runPrediction, predictSurplus, findNearestNGO, findAvailableVolunteer };
})();
