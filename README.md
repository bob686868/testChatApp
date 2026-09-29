# ⚡ PulseChat - Simple Real-time Messaging App

A clean, easy-to-understand real-time messaging application built with **Socket.IO**, **Prisma ORM**, and **Neon PostgreSQL**.

---

## 📁 Project Structure

```text
messagingApp/
├── prisma/
│   └── schema.prisma       # Database schema definition (Message model)
├── public/
│   ├── index.html          # Chat interface structure
│   ├── style.css           # Clean, modern dark-mode styling
│   └── app.js              # Client-side Socket.IO & UI state management
├── src/
│   ├── prisma.js           # Shared PrismaClient singleton instance
│   └── server.js           # Express + Socket.IO server & DB integration
├── .env                    # Neon DB connection string & server port
├── .env.example            # Environment template
└── package.json            # Scripts & dependencies
```

---

## 🚀 Getting Started

### 1. Configure Neon DB Connection String
Open [`.env`](file:///c:/Users/OMEN/OneDrive/Desktop/messagingApp/.env) and replace the `DATABASE_URL` with your actual Neon PostgreSQL connection string:

```env
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require"
PORT=3000
```

### 2. Push Schema to Neon DB
Run Prisma to automatically create the `Message` table in your Neon database:

```bash
npx prisma db push
```

### 3. Start the Application
Run in development mode (with auto-reload):

```bash
npm run dev
```

Or in standard mode:

```bash
npm start
```

### 4. Open in Browser
Visit **[http://localhost:3000](http://localhost:3000)** in two different tabs or browser windows to test real-time messaging across rooms!
