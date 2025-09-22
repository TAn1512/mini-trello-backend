# Mini Trello - Backend (NestJS)

This is the **backend service** for Mini Trello, built with **NestJS**.  
It provides APIs for authentication, board & card management, notifications, and tasks.

---

## 📂 Project Structure
```
mini-trello-backend/
├── src/
│   ├── common/
│   │   └── mailer.service.ts       # Mailer service (SMTP, Nodemailer)
│   ├── config/
│   │   ├── firebase.config.ts      # Firebase Admin SDK config
│   │   └── serviceAccountKey.json  # Firebase service account (⚠️ DO NOT COMMIT)
│   ├── modules/
│   │   ├── auth/                   # Authentication (JWT, OAuth, Guards)
│   │   ├── boards/                 # Board module
│   │   ├── cards/                  # Card module
│   │   ├── notifications/          # Notification module
│   │   └── tasks/                  # Task module
│   ├── app.controller.ts           # Root controller
│   ├── app.module.ts               # Root module
│   ├── app.service.ts              # Root service
│   └── main.ts                     # Application entry point
├── .env                            # Environment variables (not committed)
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Environment variables
Copy `.env.example` to `.env` and update your own values.

### 3. Firebase Service Account
Place your **Firebase service account key** at:
```
src/config/serviceAccountKey.json
```

👉 This file must NOT be committed. Ensure `.gitignore` includes:
```
src/config/serviceAccountKey.json
.env
```

### 4. Run development server
```bash
npm run start:dev
```

Backend runs at: **http://localhost:8080**

### 5. Build & Run production
```bash
npm run build
npm run start:prod
```

---

## 📌 Available Scripts

- `npm run start:dev` → Start dev server with hot reload
- `npm run build` → Build project
- `npm run start:prod` → Run production build
- `npm run test` → Run unit tests
- `npm run test:e2e` → Run end-to-end tests

---

## ✅ Features
- JWT authentication
- GitHub OAuth login
- Firebase integration (notifications, cloud features)
- Email service with Nodemailer
- Boards & cards CRUD APIs
- Notifications module
- Modular & scalable NestJS architecture
