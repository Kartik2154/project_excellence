# 📘 Project Excellence – Project Management System

## 📖 Introduction

**Project Excellence** is a web-based project management system built with the **MERN stack**.
It streamlines how colleges and universities handle student projects by providing dedicated portals for **Admins, Guides, and Students**.
The system automates project group creation, guide allocation, submissions, evaluations, announcements, and communication.

---

## 🎯 Key Features

### 🔑 Authentication

- Secure login for Admin, Guide, and Student.
- JWT-based authentication and role-based access.

### 👩‍💼 Admin

- Manage student and guide accounts.
- Assign guides to student groups.
- Review project submissions.
- Post announcements and exam schedules.
- Generate project-related reports.

### 🧑‍🏫 Guide

- View assigned student groups.
- Provide feedback, ratings, and evaluations.
- Communicate with students via group chat.

### 🎓 Student

- Register and form groups.
- Submit project details and documents.
- View assigned guide, schedules, and announcements.
- Receive guide feedback and update work accordingly.

### 📊 Reporting & Dashboard

- Role-specific dashboards.
- Charts/graphs with **Chart.js / Recharts**.
- Export reports in **PDF/Excel**.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TailwindCSS
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB (Atlas supported)
- **Auth**: JSON Web Tokens (JWT)
- **Version Control**: Git + GitHub
- **Dev Tools**: VS Code, Draw\.io, UMLet

---

## 📂 Project Structure

```
project/
├── backend/               # Express + MongoDB API
│   ├── config/            # DB connection
│   ├── models/            # Schemas
│   ├── controllers/       # Business logic
│   ├── routes/            # Express routes
│   ├── middlewares/       # JWT & role checks
│   └── index.js           # Entry point
│
├── frontend/              # React (Vite) client
│   ├── src/
│   │   ├── api/           # Axios/fetch API calls
│   │   ├── components/    # UI components
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Pages (Admin, Guide, Student)
│   │   └── routes/        # Route definitions
│   └── index.html
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/sanju2op/project-excellence.git
cd project-excellence
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
PORT=5000
```

Run the backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev
```

---

## � Future Enhancements

- Notifications (Email/SMS).
- File storage for project docs.
- Role-based permission levels.
- Docker support for deployment.

---

## 👥 Contributors

- **Kartik Patel** – Your Name
- **Sanjay Lagariya** – @sanju2op
- **Zeel Rathod** – Contributor TBD
- **Aryan Patel** – Contributor TBD

---

## 📜 License

This project is licensed under the **MIT License**.
