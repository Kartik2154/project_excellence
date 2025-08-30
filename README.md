# Project Excellence – Project Management System

## 📖 Introduction
**Project Excellence** is a web-based project management system designed for colleges and universities to streamline the handling of academic projects.  
It eliminates manual processes and provides dedicated portals for **Admins, Guides, and Students**, making project coordination, evaluation, and communication efficient and structured.

---

## 🎯 Purpose
- Replace inefficient manual project handling with a centralized web platform.
- Enhance collaboration between students, guides, and administrators.
- Provide secure, role-based access for project management.
- Ensure smooth project flow from group creation → guide allocation → submission → evaluation.

---

## 📌 Features

### 🔑 Authentication
- Secure login for Admin, Guide, and Student roles.
- JWT-based authentication and role-based access control.

### 👩‍💼 Admin Portal
- Manage students and guides.
- Assign guides to project groups.
- Review project submissions and documents.
- Post announcements and exam schedules.
- Generate reports:
  - Student Project Report
  - Guide-wise Group Report
  - Feedback & Evaluation Report
  - Group Performance Summary
- Monitor overall project progress.

### 🧑‍🏫 Guide Portal
- View assigned groups and their projects.
- Provide evaluations, feedback, and ratings.
- Communicate with students via group chat.
- Track project updates and resubmissions.

### 🎓 Student Portal
- Register and create project groups.
- Submit project details, documents, and updates.
- View assigned guide, announcements, and schedules.
- Receive feedback and evaluations.
- Group chat with members and guide.

### 📊 Reporting Module
- Role-specific dashboards:
  - Admin: Total projects, pending evaluations, active guides, recent announcements.
  - Guide: Assigned groups and evaluation status.
  - Student: Project status and schedule updates.
- Charts and summaries (using Chart.js / Recharts).
- Export reports to PDF/Excel.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TailwindCSS, Recharts (for charts)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Atlas support)
- **Authentication**: JWT (JSON Web Token)
- **Version Control**: GitHub
- **Development Tools**: VS Code, Draw.io, UMLet

---

## 📂 Project Structure

```

project/
├── backend/               # Node.js + Express + Mongoose API
│   ├── config/            # MongoDB connection
│   ├── models/            # Schemas (Admin, Guide, Student, etc.)
│   ├── controllers/       # Business logic
│   ├── routes/            # Express routes
│   ├── middlewares/       # JWT verification & role checks
│   └── index.js           # App entry
│
├── frontend/              # React (Vite) app
│   ├── src/
│   │   ├── api/           # API calls
│   │   ├── components/    # UI components
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Admin, Guide, Student pages
│   │   └── routes/        # Route definitions
│   └── index.html
│
└── README.md

````

---

## ⚙️ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/project-excellence.git
cd project-excellence
````

### 2. Backend Setup

```bash
cd backend
npm install
```

* Create `.env` inside `backend/`:

```env
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

* Run server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

* Create `.env` inside `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

* Run client:

```bash
npm run dev
```

---

## 📈 Future Enhancements

* Notifications system (email/SMS).
* File storage (project reports & docs).
* Role-based permissions with granular access.
* Docker setup for deployment.

---

## 👥 Contributors

* **Admin Module**: \[Your Name]
* **Guide Module**: —
* **Student Module**: —
* **UI/UX**: —

---

## 📜 License

This project is licensed under the MIT License.

```

---

✅ This `README.md` is **GitHub-ready**.  
It gives an overview, features, tech stack, structure, and setup steps.  

👉 Do you want me to also generate a **shorter `README.md` version** (like a one-pager for your college submission), or keep this detailed one for GitHub?
```
