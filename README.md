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

Create `.env` like:


```
PORT=8080
NODE_ENV=

JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_OAUTH_CALLBACK=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_OAUTH_CALLBACK=
```


### 3. Run development server
```bash
npm run dev
```

Backend runs at: **http://localhost:8080**

### 44. Build & Run production
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
- Google OAuth login
- Firebase integration (notifications, cloud features)
- Boards, cards and tasks CRUD APIs (realtime with Socket.io)
- Notifications module (realtime with Socket.io)
- Modular & scalable NestJS architecture
