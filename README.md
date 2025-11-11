
# 🧪 Medicine Inventory System

A full-stack **Medicine Inventory Management System** built with **Next.js** (frontend) and **Node.js + Express + Sequelize** (backend).
It allows admins and managers to manage medicines, users, and inventory records with authentication and role-based access control (RBAC).

---

## 🚀 Features

✅ User authentication (Register, Login, Forgot/Reset Password)
✅ Role-based access (Admin, Manager, Staff)
✅ Medicine CRUD (Create, Read, Update, Delete)
✅ User management
✅ Token-based session persistence
✅ Expiry & quantity tracking
✅ Protected routes for authorized users only

---

## 🛠️ Tech Stack

**Frontend:**

* Next.js 14
* React Hook Form
* TailwindCSS
* Axios

**Backend:**

* Node.js + Express
* PostgreSQL + Sequelize ORM
* JWT Authentication
* Bcrypt password hashing
* Nodemailer for password reset

---

## 📁 Folder Structure

### Frontend (`/src`)

```
src/
├── app/
│   ├── dashboard/
│   │   ├── medicines/
│   │   └── users/
│   ├── forget_password/
│   ├── medicines/
│   │   ├── add/
│   │   └── [id]/
│   ├── register/
│   └── reset_password/
├── components/
├── context/
└── utils/
```

### Backend

```
server/
├── app.js
├── config/
│   └── database.js
├── controllers/
│   ├── adminController.js
│   ├── authController.js
│   └── medicineController.js
├── middleware/
│   ├── auth.js
│   └── rbac.js
├── models/
│   ├── index.js
│   ├── medicine.js
│   └── user.js
└── routes/
    ├── adminRoutes.js
    ├── authRoutes.js
    └── medicineRoutes.js
```

---

## ⚙️ Setup Guide

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/medicine-inventory.git
cd medicine-inventory
```

---

### 2. Backend Setup

#### Go to the backend folder

```bash
cd server
```

#### Install dependencies

```bash
npm install
```

#### Create a `.env` file

```env
PORT=5000
DATABASE_URL=postgres://username:password@localhost:5432/medicine_inventory
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

#### Run database migrations (if using Sequelize CLI)

```bash
npx sequelize-cli db:migrate
```

#### Start the backend server

```bash
npm start
```

The backend will run on [http://localhost:5000](http://localhost:5000)

---

### 3. Frontend Setup

#### Go to the frontend folder

```bash
cd src
```

#### Install dependencies

```bash
npm install
```

#### Create a `.env.local` file

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### Run the frontend

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🔑 Default Roles

| Role    | Permissions                    |
| ------- | ------------------------------ |
| Admin   | Full access (Users, Medicines) |
| Manager | Manage medicines only          |
| Staff   | Read-only access               |

---

## 🧩 API Endpoints

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register user       |
| POST   | `/api/auth/login`    | Login user          |
| GET    | `/api/medicines`     | Get all medicines   |
| POST   | `/api/medicines`     | Create new medicine |
| PUT    | `/api/medicines/:id` | Update medicine     |
| DELETE | `/api/medicines/:id` | Delete medicine     |

---

## 🧠 Developer Notes

* Keep your JWT secret and email credentials safe.
* You can adjust roles in `middleware/rbac.js`.
* All routes are protected using `auth.js` middleware.
* The frontend uses `AuthContext` for global authentication state.

---

## 💡 Future Improvements

* Add low-stock and expiry date alerts
* Implement dashboard charts (sales/inventory)
* Enable medicine category filtering and search
* Add dark/light theme toggle

---

## 🧍‍♂️ Author

**Aldrin Carandang Medina**
* 📍 Batangas, Philippines
* 💻 Full-stack Developer
* ✉️ [medina.aldrin02@gmail.com](mailto:medina.aldrin02@gmail.com)

## Team
* Isaih Jordan 
* Shaina Borres
* Loren Sayas
* Roxanne Recio



