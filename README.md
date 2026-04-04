<div align="center">

<img src="frontend/public/logo-transparent.png" alt="Kuriftu Logo" width="100" />

# Kuriftu Intelligence Platform
### *Executive Revenue Strategy Terminal for Kuriftu Resort & Spa*

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

</div>

---

## 📖 Overview

The **Kuriftu Intelligence Platform** is a full-stack AI-powered revenue management and guest experience system built for **Kuriftu Resort & Spa** — one of Ethiopia's most iconic luxury hospitality brands. The platform provides executive-level data simulations, AI-driven pricing recommendations, SMS marketing automation, and an immersive guest portal tailored to individual preferences.

---

## ✨ Features

### 🧠 Executive Dashboard (Admin)
- **AI Yield Simulation Engine** — Simulate revenue across Rooms, Spa, and Waterpark by adjusting base prices via interactive sliders
- **Real-Time Revenue Chart** — Recharts-powered stacked bar chart showing predicted departmental revenue share
- **KPI Cards** — Live TrevPAR, Room Demand, Wellness Flow, and Waterpark Hub metrics
- **Executive Intelligence Briefing** — AI-generated narrative with strategic action plans and projected impact percentages
- **Smart Strategy Protocol** — Actionable AI proposals that can be "operationalized" with a click
- **SMS Campaign Center** — Automated campaign generator targeting guests based on current demand data
- **Role-Based Access Control** — Three access tiers: `EXECUTIVE_ADMIN`, `ROOM_MANAGER`, and `SPA_MANAGER`

### 🌿 Guest Experience Portal
- **Personalized Welcome** — Curated resort experience based on preferences selected at signup
- **AI Assistant** — Floating AI chat bubble powered by Google Gemini for real-time recommendations
- **Live Context** — Weather and stability index-aware itinerary suggestions

### 🔐 Authentication System
- JWT-based secure login & registration
- Password hashing with `bcryptjs`
- Role-aware routing after login
- Guest preference collection during multi-step signup

### 🌐 Public-Facing Footer
- Resort & Spa location links
- Adventure & Wellness links
- Live Social Media links (Instagram, YouTube, Facebook, LinkedIn)
- Responsive 4-column layout, hidden on auth pages

---

## 🏗️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite 8, Tailwind CSS, Framer Motion |
| **Charts** | Recharts |
| **Forms** | React Hook Form + Zod |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB + Mongoose |
| **AI / ML** | Google Gemini AI (`@google/generative-ai`), Voyage AI (embeddings) |
| **Auth** | JWT + bcryptjs |
| **Calendar** | Ethiopian Calendar converter |
| **Fonts** | Playfair Display, Inter, Lora (Google Fonts) |

---

## 📁 Project Structure

```
kuriftu-pixle-pirate/
├── frontend/
│   ├── public/
│   │   ├── logo-transparent.png   # Kuriftu brand logo (no background)
│   │   └── favicon.ico
│   └── src/
│       ├── components/
│       │   ├── Dashboard.jsx       # Executive revenue terminal
│       │   ├── GuestPortal.jsx     # Guest experience page
│       │   ├── Login.jsx           # Member login
│       │   ├── Signup.jsx          # Multi-step guest registration
│       │   ├── Footer.jsx          # Global site footer
│       │   ├── AssistantBubble.jsx # Floating AI chat assistant
│       │   ├── SMSCampaignCenter.jsx # SMS marketing automation
│       │   ├── ThemeToggle.jsx     # Light/Dark mode toggle
│       │   └── ProtectedRoute.jsx  # Role-based route guard
│       ├── context/
│       │   ├── AuthContext.jsx     # Global auth state
│       │   └── ThemeContext.jsx    # Light/Dark theme state
│       └── api/
│           └── client.js          # Axios API client
│
└── backend/
    ├── server.js                  # Express app entry point
    ├── routers/                   # API route definitions
    │   ├── auth.route.js
    │   ├── chat.route.js
    │   ├── demand.route.js
    │   ├── pricing.route.js
    │   ├── analysis.route.js
    │   ├── simulation.route.js
    │   └── ecosystem.route.js
    ├── controllers/               # Business logic handlers
    ├── models/                    # Mongoose schemas (User, PricingRules, etc.)
    ├── services/                  # AI & data services
    ├── middlewares/               # JWT auth middleware
    └── validators/                # Zod request validators
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local or Atlas URI)
- A **Google Gemini API** key
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/kuriftu-pixle-pirate.git
cd kuriftu-pixle-pirate
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/kuriftu
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_google_gemini_api_key
VOYAGEAI_API_KEY=your_voyage_ai_key
```

Start the backend server:

```bash
npm run dev
```

> Backend runs at **http://localhost:3000**

### 3. Set Up the Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3000
```

Start the development server:

```bash
npm run dev
```

> Frontend runs at **http://localhost:5173**

---

## 🔐 User Roles

| Role | Access |
|------|--------|
| `EXECUTIVE_ADMIN` | Full dashboard — KPIs, charts, AI briefings, SMS campaigns |
| `ROOM_MANAGER` | Room pricing simulation & room demand chart |
| `SPA_MANAGER` | Spa & waterpark pricing simulation |
| `GUEST` | Personalized guest experience portal |

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login and receive JWT |
| `POST` | `/api/revenue/total` | ✅ | Get AI-driven revenue prediction |
| `GET` | `/api/demand` | ✅ | Get demand forecast |
| `GET` | `/api/pricing` | ✅ | Get pricing recommendations |
| `GET` | `/api/analysis` | ✅ | Get market analysis |
| `POST` | `/api/simulation` | ✅ | Run custom revenue simulation |
| `POST` | `/api/chat` | — | AI assistant chat |

---

## 🎨 Design System

The UI uses a luxury editorial aesthetic with the following palette:

| Token | Light | Dark |
|-------|-------|------|
| Background | `#FDFCFB` | `#0F1115` |
| Card | `#FFFFFF` | `#1A1D23` |
| Gold Accent | `#C5A059` | `#D4AF37` |
| Border | `#E5E7EB` | `#2D3139` |

Fonts: **Playfair Display** (headings) · **Inter** (body)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is built as part of the **ALX Software Engineering Program** and is intended for educational and demonstration purposes.

---

<div align="center">

**Built with ❤️ for Kuriftu Resort & Spa**

*Powered by PIER 5 STUDIOS*

</div>
