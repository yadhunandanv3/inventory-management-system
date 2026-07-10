# Inventory & Order Management System

A production-ready full-stack application built to track products, manage customer databases, process order invoices, and enforce transactional inventory stock limits.

---

## 🏗️ Architecture Diagram

```mermaid
graph TD
    Client[React Client - Vite + MUI] -- HTTP Requests + JWT --> API[Express API Server]
    API -- Read / Write --> DB[(PostgreSQL Database)]
    API -- ORM Mapping --> Sequelize[Sequelize ORM]
    Sequelize --> DB
    subgraph Containerized Services (Docker Compose)
        Client
        API
        DB
    end
```

---

## 🛠️ Tech Stack

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: PostgreSQL
*   **ORM**: Sequelize ORM
*   **Auth**: JWT (JSON Web Tokens) & `bcryptjs`
*   **Validation**: `express-validator`
*   **Security**: CORS & Helmet
*   **Logging**: Morgan
*   **API Docs**: Swagger UI

### Frontend
*   **Build Tool**: Vite
*   **Library**: React (v18)
*   **Routing**: React Router (v6)
*   **CSS Framework**: Material UI (MUI v5)
*   **Forms**: React Hook Form
*   **Notifications**: React Toastify
*   **HTTP Client**: Axios

### Containerization & Deployment
*   **Containerization**: Docker, Docker Compose
*   **Database Host**: Neon PostgreSQL (Free serverless Postgres)
*   **Backend Host**: Render
*   **Frontend Host**: Vercel

---

## 📂 Folder Structure

```text
inventory-management-system/
├── backend/
│   ├── src/
│   │   ├── config/          # Sequelize & Swagger configurations
│   │   ├── controllers/     # MVC controller handlers
│   │   ├── database/        # Sequelize Migrations & Seeders
│   │   ├── middleware/      # Auth security, Validate, & Error middleware
│   │   ├── models/          # Sequelize database model definitions
│   │   ├── routes/          # REST API endpoint definitions
│   │   ├── services/        # Order transactions & stock business logic
│   │   ├── utils/           # Helper scripts (Token generation)
│   │   ├── validators/      # Express Validator schemas
│   │   ├── app.js           # Express App setup
│   │   └── server.js        # Entry server script
│   ├── .sequelizerc         # Sequelize CLI configuration
│   ├── Dockerfile           # Backend image build steps
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Navigation Shell, Protected Routes
│   │   ├── context/         # AuthContext provider
│   │   ├── pages/           # Dashboard, Forms, Tables pages
│   │   ├── services/        # Axios API client setup
│   │   ├── App.jsx          # Router & Theme styling provider
│   │   ├── index.css        # Base typography resets
│   │   └── main.jsx
│   ├── Dockerfile           # Frontend image build steps
│   ├── index.html
│   └── package.json
├── docker-compose.yml       # Production/Local development orchestrator
├── README.md                # Project documentation
└── inventory_management.postman_collection.json
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```ini
PORT=5000
DATABASE_URL=postgresql://postgres:root@localhost:5432/inventory_db
JWT_SECRET=mySuperSecretKey
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```ini
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Quick Start & Installation

### Option A: Run via Docker Compose (Recommended)
Make sure you have Docker Desktop running, then execute the following at the project root:

```bash
docker-compose up --build
```

This starts:
1.  **PostgreSQL DB** at `localhost:5432`
2.  **Express Backend API** at `localhost:5000` (auto-runs migrations and seeds dummy data)
3.  **Vite Frontend App** at `localhost:5173`

Access the React dashboard at: [http://localhost:5173](http://localhost:5173)

---

### Option B: Local Setup (Manual)

#### 1. Database Setup
Create a PostgreSQL database named `inventory_db` on your local instance.

#### 2. Backend Installation
```bash
cd backend
npm install
# Run migrations to build the tables
npx sequelize-cli db:migrate
# Run seeders to load dummy data (Admin account, items, customers)
npx sequelize-cli db:seed:all
# Start developer server
npm run dev
```

#### 3. Frontend Installation
```bash
cd ../frontend
npm install
npm run dev
```

---

## 🔑 Default Login Credentials
Use the pre-seeded admin credentials to log in:
*   **Email**: `admin@example.com`
*   **Password**: `admin123`

---

## 📖 API Documentation (Swagger)
When the backend server is running, navigate to:
[http://localhost:5000/api-docs](http://localhost:5000/api-docs) to interact with the Swagger specifications.

---

## 🧪 Postman Collection
Import the [inventory_management.postman_collection.json](file:///d:/inventory-management-system/inventory_management.postman_collection.json) file located at the project root into Postman. It contains pre-configured requests. Logging in will automatically populate the token variable for subsequent protected requests.
