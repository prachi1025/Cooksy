# Cooksy · AI‑Powered Recipe Generator 🍳

Cooksy is a full‑stack MERN app that turns **whatever’s in your kitchen** into complete, cookable recipes using **AI**.

You log in, tell Cooksy what ingredients you have, and it generates a full recipe with **steps, nutrition, cooking time, difficulty**, and lets you **bookmark** your favorites. The whole app is built as a **single service** that can be deployed directly to **Render**.

Deployed at: https://cooksy-pyx7.onrender.com/

---

## ✨ Features

### 🔐 Authentication
- Email + password registration/login using **JWT**
- Protected routes for:
  - Recipe generation
  - Bookmarks

### 🤖 AI Recipe Generation
- Backend calls a large‑language model (via Grok/xAI or similar) with a structured prompt.
- Generates recipes based on:
  - Ingredients
  - Cuisine preference
  - Diet preference
- Returns a **structured JSON recipe** with:
  - Title
  - Ingredients (with quantities)
  - Step‑by‑step instructions
  - Nutrition (calories, protein, carbs, fat)
  - Cooking time
  - Difficulty

### 📚 Recipe Management
- Every AI‑generated recipe is saved for the logged‑in user.
- Users can:
  - Bookmark/unbookmark recipes.
  - View all bookmarked recipes in the **Bookmarks** tab.

### 📧 Password Reset (Forgot Password Flow)
- “Forgot password?” link on the login page:
  - User enters email → receives a **secure reset link**.
- Reset link:
  - Contains a **random token** (stored **hashed** in DB, not in plain text).
  - Valid for **1 hour**.
- Reset page:
  - Allows user to set a **new password**, then log in again.

### 💅 UI / UX
- **React + Vite** + **Tailwind CSS**
- Dark, minimal, modern aesthetic
- Mobile‑first, fully responsive
- Centered auth pages (login/register/forgot/reset) with no unnecessary scroll
- Smooth, loading states:
  - “Cooking up your recipe...” spinner during AI calls
- Clear error messages and success toasts/messages

### 🏗️ Architecture
- **Frontend:** React (Vite), React Router, Axios, Context API
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB (Atlas or local)
- **Auth:** JWT + password hash via bcrypt
- **AI Integration:** Grok/xAI (or similar OpenAI‑compatible API)
- **Email:** Nodemailer + SMTP (e.g. Gmail, SendGrid, Mailgun)
- **Deployment:** Single Node service on **Render**:
  - Backend serves API under `/api/*`
  - In production, backend also serves built React app from `frontend/dist`

---

## 🧱 Project Structure

```bash
Cooksy/
  backend/
    src/
      config/
        db.js               # MongoDB connection
      controllers/
        authController.js   # register, login, forgot/reset password
        recipeController.js # AI recipe generation, bookmarks, etc.
      middleware/
        authMiddleware.js   # JWT protect middleware
      models/
        User.js             # User schema (includes reset token/expiry)
        Recipe.js           # Recipe schema
      routes/
        authRoutes.js       # /api/auth/*
        recipeRoutes.js     # /api/recipes/*
      services/
        huggingfaceService.js  # Now wired to xAI/Grok; AI recipe generation
      utils/
        generateToken.js    # JWT generator
        sendEmail.js        # Nodemailer wrapper + env handling
      server.js             # Express entry: APIs + static React in prod
    package.json

  frontend/
    src/
      components/
        Navbar.jsx
        Loader.jsx
        ProtectedRoute.jsx
        RecipeCard.jsx
      context/
        AuthContext.jsx     # login/register/logout, auth state
      pages/
        LoginPage.jsx
        RegisterPage.jsx
        ForgotPasswordPage.jsx
        ResetPasswordPage.jsx
        GeneratePage.jsx
        BookmarksPage.jsx
      App.jsx
      main.jsx
      index.css
    index.html
    vite.config.js
    package.json

  package.json              # Root package for Render (build + start)
  render.yaml               # Render blueprint (optional)
  .gitignore
```

---

## 🔧 Setup – Local Development

### 1. Clone the repo

```bash
git clone https://github.com/your-username/cooksy.git
cd cooksy
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/cooksy

# JWT
JWT_SECRET=your_jwt_secret_here

# Frontend origin (for CORS) – dev
CLIENT_ORIGIN=http://localhost:5173

# Base URL used in emails (reset link)
CLIENT_URL=http://localhost:5173

# AI (Grok/xAI or similar)
XAI_API_KEY=your_xai_api_key_here
GROK_MODEL=grok-3-mini  # or any supported model id

# Email (for forgot password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password   # App Password, not normal password
EMAIL_FROM="Cooksy <yourgmail@gmail.com>"
```

> For `EMAIL_PASS` with Gmail, enable 2FA and create an **App Password**  
> (Account → Security → 2‑Step Verification → App passwords).

Run backend:

```bash
npm run dev
```

### 3. Frontend setup

In another terminal:

```bash
cd frontend
npm install
```

`frontend/.env` (optional, only if you want to override API base):

```bash
# For dev, API is at http://localhost:5000/api by default
# VITE_API_BASE_URL=http://localhost:5000/api
```

Run frontend dev server:

```bash
npm run dev
# App at http://localhost:5173
```

---

## 🚀 Single-Service Deploy on Render

Cooksy is configured to run as **one Render web service** that serves both:

- API: `/api/*`
- React app: `/*` (from built `frontend/dist`)

### 1. Root `package.json` (already present)

```json
{
  "name": "cooksy",
  "private": true,
  "scripts": {
    "build": "cd frontend && npm install && npm run build && cd ../backend && npm install",
    "start": "node backend/src/server.js"
  }
}
```

### 2. Backend serves frontend in production (`backend/src/server.js`)

- If `NODE_ENV === "production"`:
  - Serves static files from `frontend/dist`
  - SPA fallback: any non‑API route returns `index.html`
- API stays under `/api/auth/*` and `/api/recipes/*`

### 3. Render web service configuration

On Render:

- **Root Directory:** repo root (where top‑level `package.json` is)
- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Runtime:** Node
- **Environment Variables** (example):

```bash
NODE_ENV=production

MONGO_URI=your_atlas_connection_string
JWT_SECRET=some_long_random_secret

# Single origin for both frontend + backend
CLIENT_ORIGIN=https://your-service.onrender.com
CLIENT_URL=https://your-service.onrender.com

# AI
XAI_API_KEY=your_xai_api_key_here
GROK_MODEL=grok-3-mini

# Email (forgot password)
EMAIL_HOST=smtp.sendgrid.net  # or smtp.gmail.com / your provider
EMAIL_PORT=587
EMAIL_USER=your_smtp_user
EMAIL_PASS=your_smtp_password
EMAIL_FROM="Cooksy <no-reply@yourdomain.com>"
```

After deploy, your app will be live on:

```text
https://your-service.onrender.com
```

---

## 🧪 Key Flows to Test

1. **Auth**
   - Register new user
   - Incorrect password → see error
   - Login success → redirected to `/generate`

2. **AI Recipe Generation**
   - Fill ingredients (e.g. `chicken, garlic, onions, masala`)
   - Choose cuisine/diet
   - Click **Generate recipe**
   - Check:
     - Title
     - Ingredients (non‑empty, relevant)
     - Steps list (clean numbering)
     - Stats + macros

3. **Bookmarks**
   - From generated recipe card, click **Bookmark**
   - Go to **Bookmarks** tab → recipe should appear
   - Toggle bookmark off → disappears from Bookmarks

4. **Forgot/Reset Password**
   - On login, click **Forgot password?**
   - Enter email (existing user)
   - Confirm that:
     - On dev, mail arrives with link like `/reset-password?token=...`
     - Reset works and you can log in with new password

---

## 🧠 Design & Security Notes

- **Tokens & Security**
  - Reset tokens are **cryptographically random** and **only stored hashed** in MongoDB using `sha256`.
  - Links are **time‑limited** (1‑hour expiry).
  - Passwords are hashed with `bcrypt` (10 rounds).

- **CORS & Single Origin**
  - In dev: frontend `http://localhost:5173`, backend `http://localhost:5000`
  - In prod on Render: both served from the **same origin**, simplifying CORS & cookies.

- **Error Handling**
  - Backend routes consistently return JSON `{ message: string }` for errors.
  - Frontend shows inline error boxes on auth and forgot/reset pages.

---

## 🛠️ Future Enhancements

- Add **filters** (prep time, difficulty, calories range) to recipe generation.
- Let users **edit & save** generated recipes (like a personal cookbook).
- Add image support (e.g. AI‑generated dish photo).
- Add social features (share recipes, likes, comments).

---

Cooksy is designed to feel like a **friendly AI sous‑chef**: you bring the ingredients, it brings the creativity, and together you get from “what can I make?” to “that was delicious” — in one clean, modern, full‑stack app.
