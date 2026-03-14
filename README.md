# FoodBridge – Smart Surplus Food Redistributions System

[![Supabase](https://img.shields.io/badge/Backend-Supabase-green)](https://supabase.com)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini-blue)](https://deepmind.google/technologies/gemini/)
[![License-MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

> **"Bridging Surplus Food to Those in Need"**

FoodBridge is a comprehensive platform designed to tackle food waste by connecting food donors (restaurants, hotels, events) with NGOs and volunteers. Using **Gemini AI** for surplus prediction and **Supabase** for real-time data synchronization, FoodBridge ensures that surplus food reaches people in need efficiently and safely.

---

## 🚀 Key Features

*   **Donor Dashboard**: Easily upload surplus food, set pickup times, and track donation impact.
*   **NGO Portal**: View available donations nearby, accept matching requests, and manage distribution.
*   **Volunteer Tracking**: Real-time notifications for pickup and delivery tasks.
*   **AI Surplus Forecasting**: Powered by Google's Gemini AI to predict surplus peaks and optimize matches.
*   **Real-time Synchronization**: Built on Supabase for instant updates across all user dashboards.
*   **IVR Integration (Demo)**: A mock IVR Manager dashboard for handling community helpline requests via phone.

---

## 🏗️ System Architecture

FoodBridge follows a modern cloud-native architecture:

1.  **Frontend**: Single Page Application (SPA) built with Vanilla HTML/CSS/JS for high performance and zero build-step overhead.
2.  **Data Layer**: 
    *   **Supabase Auth**: Secure role-based access control.
    *   **Supabase PostgreSQL**: Real-time database for donations and user profiles.
3.  **AI Engine**: **Gemini 1.5 Flash** for intelligent surplus prediction and NGO matching insights.
4.  **Security**: Configurable environment via `js/config.js`.

---

## 🛣️ User Workflows

### 1. Donor Flow
1. **Login** -> Select **Donor** role.
2. **Donate** -> Add food details (Quantity, Type, Image).
3. **AI Insight** -> Get predicted surplus analysis before submitting.
4. **Monitor** -> Track when an NGO accepts and a Volunteer picks up.

### 2. NGO Flow
1. **Login** -> Select **NGO** role.
2. **Discover** -> View real-time "Pending" donations in the area.
3. **Accept** -> "Claim" a donation to trigger volunteer notification.

---

## 🛠️ Setup & Installation

1.  **Clone the Repository**
2.  **Configure API Keys**:
    *   Open `js/config.js`.
    *   Add your **Supabase URL** and **Anon Key**.
    *   Add your **Gemini API Key**.
3.  **Launch**:
    *   Serve the directory using a local server (e.g., `python -m http.server` or `Live Server`).
    *   Open `index.html`.

---

## 📈 Impact Dashboard

Visit the **Admin Dashboard** to view global metrics:
*   Total Meals Distributed
*   Active Donors vs NGOs
*   Real-time Food Waste Reduction Tracking

---

*Built with ❤️ for the Smart India Hackathon.*

