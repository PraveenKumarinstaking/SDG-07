# 🍲 FoodBridge: Smart Surplus Food Redistribution

> **Bridging the gap between surplus food waste and community hunger through AI and seamless logistics.**

[![Supabase](https://img.shields.io/badge/Backend-Supabase-green?style=flat-square&logo=supabase)](https://supabase.com)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini_1.5_Flash-blue?style=flat-square&logo=google-gemini)](https://deepmind.google/technologies/gemini/)
[![Leaflet](https://img.shields.io/badge/Maps-Leaflet.js-darkgreen?style=flat-square&logo=leaflet)](https://leafletjs.com/)
[![License-MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

---

## 📖 Table of Contents
- [Project Overview](#-project-overview)
- [The Problem](#-the-problem)
- [The Solution (Unified Workflow)](#-the-solution-unified-workflow)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Setup & Installation](#-setup--installation)
- [Documentation & Assets](#-documentation--assets)
- [Future Roadmap](#-future-roadmap)

---

## 🌍 Project Overview
FoodBridge is a high-impact digital platform designed to solve **UN SDG Goal 2: Zero Hunger**. It connects businesses with surplus food (Restaurants, Hotels, Event Handlers) directly to NGOs and Volunteers using a real-time, AI-driven redistribution engine.

## ⚠️ The Problem
- **Massive Inefficiency**: Millions of tons of nutritious food are discarded by businesses.
- **Logistical Gap**: Lack of real-time coordination between those who *have* and those who *need*.
- **Barrier to Entry**: Communities in need often lack the smartphones or internet required for traditional apps.

---

## 🔄 The Solution (Unified Workflow)
FoodBridge operates a unique **Dual-Entry System** that ensures 100% inclusivity.

![Unified Workflow Diagram](C:/Users/SURYA/.gemini/antigravity/brain/fc03e4c0-6d0c-45de-a733-b3c6ac8ec909/unified_foodbridge_workflow_1773494636366.png)

1.  **Dual Entry**: Businesses upload via **Web Portal**; community members call the **IVR Helpline**.
2.  **AI Triage**: **Google Gemini AI** predicts surplus quantity and prioritizes requests based on urgency.
3.  **Smart Matching**: The system automatically assigns the nearest registered NGO and Volunteer.
4.  **Live Pickup**: Volunteers navigate via an interactive **Live Track Map** to ensure 30–60 min delivery.
5.  **Loop Closed**: Digital receipts for businesses and SMS confirmations for offline callers.

---

## 🚀 Key Features

### 🏢 For Donors (Restaurants/Events)
- **Fast Upload**: Real-time surplus reporting with image upload support.
- **Impact Analytics**: Track "Meals Saved" and "CO2 Diverted" for CSR reporting.
- **Predictive AI**: Forecast peak surplus days to optimize prep.

### 🏥 For NGOs
- **Real-time Discovery**: Live dashboard of all available food in the vicinity.
- **Capacity Management**: Manage storage and distribution queues centrally.

### 🚚 For Volunteers
- **Interactive Live Tracking**: Map-based navigation powered by Leaflet.js.
- **Gamified Rewards**: Earn **Vouchers** (Bronze to Platinum) for completed deliveries.

### 📞 For the Community (Helpline)
- **IVR Accessibility**: Offline helpline (+13505301125) for those without internet.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | Vanilla ES6+, CSS3, Bootstrap 5 | High-performance, responsive SPA with Glassmorphism UI. |
| **Database** | **Supabase** (Postgres) | Real-time data sync, secure Auth, and edge functions. |
| **Artificial Intelligence** | **Google Gemini 1.5 Flash** | Powerful AI for matching logic and surplus forecasting. |
| **Maps & Tracking** | **Leaflet.js** (OSM) | Real-time interactive map for volunteer navigation. |
| **Charts** | Chart.js | Data visualization for impact tracking. |

---

## ⚙️ Setup & Installation

1.  **Clone the Repository**
2.  **Configuration**:
    - Open `js/config.js` and add your **Gemini API Key**.
    - Initialize Supabase by adding your `SB_URL` and `SB_KEY`.
3.  **Run Locally**:
    - Simply open `index.html` in any browser or use a live server extension.

---

## 📚 Documentation & Assets
- 📊 [**Pitch Deck / Presentation**](file:///C:/Users/SURYA/.gemini/antigravity/brain/fc03e4c0-6d0c-45de-a733-b3c6ac8ec909/presentation.md)
- 🏗️ [**System Architecture**](file:///C:/Users/SURYA/.gemini/antigravity/brain/fc03e4c0-6d0c-45de-a733-b3c6ac8ec909/architecture.md)
- 🧪 [**Project Walkthrough**](file:///C:/Users/SURYA/.gemini/antigravity/brain/fc03e4c0-6d0c-45de-a733-b3c6ac8ec909/walkthrough.md)
- 🛣️ [**Web App Workflow**](file:///C:/Users/SURYA/.gemini/antigravity/brain/fc03e4c0-6d0c-45de-a733-b3c6ac8ec909/system_workflow.md)
- 🔊 [**IVR Logic Workflow**](file:///C:/Users/SURYA/.gemini/antigravity/brain/fc03e4c0-6d0c-45de-a733-b3c6ac8ec909/caller_to_ngo_workflow.md)

---

## 📈 Future Roadmap
- [ ] **IoT Smart Bins**: Real-time waste detection.
- [ ] **Blockchain Integration**: Immutable "Seed-to-Feed" transparency.
- [ ] **Mobile App**: Native iOS/Android apps for easier field use.

---

*Built with ❤️ for SDG Goal: Zero Hunger.*
