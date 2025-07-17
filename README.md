# 🐝 WageBee – A MERN Stack Payroll Management System

**WageBee** is a comprehensive, full-stack **Payroll Management System** built using the **MERN stack** (MongoDB, Express.js, React, Node.js). It’s designed to streamline and automate payroll operations for businesses, offering intuitive UI, seamless backend integrations, and essential features like salary processing, employee management, tax deductions, and payslip generation.

---

## 🚀 Features

- 🔐 **JWT Authentication & Authorization**
- 👥 **Employee Management** – Add, edit, view, delete employees
- 💸 **Payroll Processing** – Auto salary computation with tax/benefit deductions
- 🧾 **Payslip Generation** – Downloadable monthly payslips (PDF)
- 📊 **Analytics Dashboard** – Payroll trends, graphs, and summaries
- 🧑‍💼 **Role-Based Access Control** – Admin, HR, and Employee views
- 🔍 **Smart Search & Filter** – Locate employee or payroll data instantly

---

## 🧱 Tech Stack

| Layer           | Technologies               |
|-----------------|----------------------------|
| **Frontend**    | React, React Router, Axios |
| **Backend**     | Node.js, Express.js        |
| **Database**    | MongoDB, Mongoose          |
| **Auth**        | JWT (JSON Web Tokens)      |
| **Versioning**  | Git & GitHub               |

---

## 📁 Project Structure

```
WageBee/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── App.js
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── .env
├── package.json
└── README.md
````

---

## 🛠️ Getting Started

### ✅ Prerequisites

- Node.js v16+
- MongoDB (Local or Atlas)
- npm or yarn

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/AravindAS-FSD/WageBee---A-Payroll-Management-System-using-MERN-Stack.git
cd WageBee---A-Payroll-Management-System-using-MERN-Stack
````

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=<Your MongoDB URI>
JWT_SECRET=<Your Secret Key>
```

Run the server:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

---

## 🌐 Environment Variables (Backend)

```env
PORT=5000
MONGO_URI=<Your MongoDB URI>
JWT_SECRET=<A secure JWT secret>
```

---

## 📸 Screenshots

> **Welcome Page**
> ![Welcome Page](https://github.com/user-attachments/assets/f2b81a5f-e7d7-4e59-8649-a43cebe101cd)

> **Login Page**
> ![Login Page](https://github.com/user-attachments/assets/1f39315e-811c-4dc4-98e7-611da7090d37)

> **Admin Dashboard**
> ![Admin Dashboard](https://github.com/user-attachments/assets/b943b5c2-ebcf-4e0e-9569-28125c90259c)

> **Employee Panel**
> ![Employee Panel](https://github.com/user-attachments/assets/904b4f17-42a8-4f40-9edd-bff078ef17b0)

---

## 📝 To-Do List

* [ ] Add unit & integration tests
* [ ] Email notifications for payslips
* [ ] Export payroll data as CSV/PDF
* [ ] Cloud deployment (Render / Railway / Vercel)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss your ideas.

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 💬 Connect with Me

* 🔗 [GitHub – @AravindAS-FSD](https://github.com/AravindAS-FSD)

---

### 👉 WageBee – Making payroll processing **fast**, **secure**, and **effortless** for businesses.

---

## ✅ How to Use This File

1. Save as `README.md` in the root of your repo.
2. Replace placeholders like MongoDB URI and screenshots if needed.
3. Push to GitHub:

```bash
git add README.md
git commit -m "Add detailed project README"
git push origin main
```

---
