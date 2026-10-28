# ITSMS — Innovation and Technology Service Management System

> A comprehensive web-based platform that digitizes, automates, and manages all services of the Amhara National Regional State Innovation and Technology Bureau (ANRS ITB).

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-production--ready-green)
![License](https://img.shields.io/badge/license-MIT-lightgrey)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![React](https://img.shields.io/badge/react-19-blue)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [User Roles](#user-roles)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Testing](#testing)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Contact](#contact)

---

## Overview

The **Innovation and Technology Service Management System (ITSMS)** is a full-stack web application developed for the **Amhara National Regional State Innovation and Technology Bureau (ANRS ITB)**. The Bureau, established under **Proclamation No. 296/2025**, is mandated to lead the region's digital transformation through digital infrastructure management, innovation incubation, technology transfer, cybersecurity monitoring, and digital literacy programs.

Before ITSMS, most of the Bureau's services relied on manual, paper-based processes that were slow, error-prone, and difficult to track. ITSMS digitizes and automates these services, providing a centralized platform for managing applications, service requests, approvals, team workflows, document storage, reporting, analytics, and auditing.

### Project Goals

- **Digitize** all manual paper-based processes
- **Automate** multi-level approval workflows
- **Centralize** document and data management
- **Provide** real-time notifications and analytics
- **Ensure** accountability through complete audit trails
- **Enable** role-based access for 10+ user types

---

## Key Features

### 🔐 Authentication & Authorization
- JWT-based authentication with secure token management
- Email verification for new registrations
- Password reset via email
- Role-Based Access Control (RBAC) for 10+ user roles
- bcrypt password hashing
- Rate limiting and input validation

### 📋 Application Management
- Multi-step application forms for:
  - **Internship** programs
  - **Innovation** programs
  - **Startup** programs
  - **Training** programs
- Document upload via Cloudinary
- Application status tracking
- Admin approval workflows
- Automated routing to directorates

### 🛠️ Service Requests
- Submit technology service requests
- Document upload support
- Priority assignment
- Status tracking from submission to completion
- Task assignment to team members

### 👥 Team & Directorate Management
- Create and manage directorates
- Assign team leads and members
- Task assignment and tracking
- Team performance metrics
- Staff management

### 📊 Reporting & Analytics
- Multi-level report generation (interns, innovators, startups, trainees, team leads, directors)
- Report submission, review, approval, and feedback
- Analytics dashboard with Area, Pie, and Bar charts
- Application trends and program progress visualization
- Team performance insights
- Export capabilities

### 📄 Document Management
- Secure file upload via Cloudinary
- Document storage, retrieval, and download
- Version tracking
- Access control

### 🔔 Notification System
- In-app notifications
- Email notifications via Nodemailer
- Status change alerts
- Task assignment notifications
- Report review notifications

### 📱 QR Code Attendance
- Trainer generates QR codes for sessions
- Trainees scan QR codes to mark attendance
- Real-time attendance validation
- Attendance history tracking

### 📝 Audit Trail
- Complete logging of all system actions
- User activity tracking
- Approval/rejection records
- System access visibility
- Accountability for all actions

### 📱 Responsive Design
- Works on desktop, tablet, and mobile
- Cross-browser compatible (Chrome, Firefox, Edge)
- Modern UI with Framer Motion animations
- Accessible and intuitive interface

---

## System Architecture

ITSMS follows **Clean Architecture** principles with clear separation of concerns:
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND (React 19) │
│ ┌──────────────┬──────────────┬──────────────┬───────────┐ │
│ │ Public Pages │ Auth Pages │ Dashboards │ Forms │ │
│ │ Landing │ Login │ Admin │ Multi- │ │
│ │ Service Cat. │ Register │ Director │ step │ │
│ │ News │ Password │ Team Lead │ Forms │ │
│ │ │ Reset │ Staff │ │ │
│ │ │ Email Verify│ User │ │ │
│ └──────────────┴──────────────┴──────────────┴───────────┘ │
├─────────────────────────────────────────────────────────────┤
│ API LAYER (Express 5) │
│ /api/auth /api/admin /api/dir /api/team /api/service │
├─────────────────────────────────────────────────────────────┤
│ BUSINESS LOGIC (Services) │
│ Auth Service │ Application Service │ Admin Service │ Director│
├─────────────────────────────────────────────────────────────┤
│ DATABASE (MongoDB) │
│ Users │ Requests │ Profiles │ Reports │ Teams │ Logs │
└─────────────────────────────────────────────────────────────┘


### Architectural Patterns
- **Clean Architecture** — Separation of concerns across layers
- **MVC Pattern** — Models, Views (routes), Controllers
- **Repository Pattern** — Abstracted database access via Mongoose
- **Middleware Pattern** — Auth, RBAC, validation, error handling
- **Service Layer** — Business logic isolated from controllers

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.4 | UI framework |
| Vite | 8.0.0 | Build tool |
| Tailwind CSS | 4.2.2 | Utility-first styling |
| Framer Motion | 12.38.0 | Animations |
| Recharts | 3.8.0 | Data visualization |
| Zustand | 5.0.12 | State management |
| Axios | 1.13.6 | HTTP client |
| React Router DOM | 7.13.1 | Client-side routing |
| Lucide React | 0.577.0 | Icon library |
| Fontsource | — | Web fonts (Inter, Calistoga) |
| html5-qrcode | 2.3.8 | QR code scanning |
| qrcode | 1.5.4 | QR code generation |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime environment |
| Express | 5.2.1 | Web framework |
| MongoDB | 9.3.1 | Database |
| Mongoose | 9.3.1 | MongoDB ODM |
| JWT | 9.0.3 | Authentication |
| bcryptjs | 3.0.3 | Password hashing |
| Nodemailer | 8.0.2 | Email sending |
| Cloudinary | 2.9.0 | File storage |
| Helmet | 8.1.0 | Security headers |
| CORS | 2.8.6 | Cross-origin support |
| express-rate-limit | 8.3.1 | Rate limiting |
| express-validator | 7.3.1 | Input validation |
| Multer | 2.1.1 | File upload |
| html-pdf | 1.5.0 | PDF generation |

### Testing & DevOps
| Technology | Purpose |
|---|---|
| Postman | API endpoint testing |
| MongoDB Compass | Database verification |
| Browser DevTools | Debugging and network monitoring |
| Chrome / Firefox / Edge | Cross-browser UI testing |
| Git / GitHub | Version control |

---

## User Roles

ITSMS supports **10+ user roles**, each with specific permissions and dashboard views:

| Role | Access Level | Key Permissions |
|---|---|---|
| **Guest / User** | Unauthenticated | View public portal, service catalog, announcements |
| **Registered User** | Authenticated | Apply for programs, submit service requests, track status |
| **Intern** | Program Participant | Submit weekly reports, view advisor, track progress |
| **Innovator** | Program Participant | Update milestones, view mentor, track innovation |
| **Startup** | Program Participant | Track growth metrics, view mentor, milestone updates |
| **Trainee** | Program Participant | View training schedule, QR attendance |
| **Staff** | Employee | Complete assigned tasks, view reviews, update profile |
| **Team Lead** | Team Manager | Assign tasks, submit team reports, view analytics |
| **Director** | Directorate Manager | Manage teams, review reports, assign staff |
| **Admin** | Full System | Manage all aspects: users, directorates, approvals, audit logs |

### Role Hierarchy & Workflows
User → Admin → Director → Team Lead → Staff
│
├── Intern → Advisor → Director
├── Innovator → Mentor → Director
├── Startup → Mentor → Director
└── Trainee → Trainer → Director


---

## Project Structure
itsms/
├── backend/
│ ├── config/
│ │ ├── db.js # MongoDB connection
│ │ ├── cloudinary.js # Cloudinary configuration
│ │ └── email.js # Nodemailer configuration
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── applicationController.js
│ │ ├── adminController.js
│ │ ├── directorController.js
│ │ ├── teamController.js
│ │ ├── staffController.js
│ │ └── serviceController.js
│ ├── middleware/
│ │ ├── auth.js # JWT verification
│ │ ├── rbac.js # Role-based access control
│ │ ├── validate.js # Input validation
│ │ ├── upload.js # Multer + Cloudinary
│ │ └── errorHandler.js
│ ├── models/
│ │ ├── User.js
│ │ ├── Request.js
│ │ ├── Report.js
│ │ ├── Directorate.js
│ │ ├── Team.js
│ │ ├── ServiceCatalog.js
│ │ ├── Notification.js
│ │ ├── AuditLog.js
│ │ ├── Announcement.js
│ │ ├── InternProfile.js
│ │ ├── InnovatorProfile.js
│ │ ├── StartupProfile.js
│ │ ├── TrainingProfile.js
│ │ ├── RequesterProfile.js
│ │ ├── Milestone.js
│ │ ├── Session.js
│ │ └── Task.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── applicationRoutes.js
│ │ ├── adminRoutes.js
│ │ ├── directorRoutes.js
│ │ ├── teamRoutes.js
│ │ ├── staffRoutes.js
│ │ ├── serviceRoutes.js
│ │ └── notificationRoutes.js
│ ├── services/
│ │ ├── authService.js
│ │ ├── applicationService.js
│ │ ├── adminService.js
│ │ ├── directorService.js
│ │ ├── notificationService.js
│ │ └── analyticsService.js
│ ├── utils/
│ │ ├── generateToken.js
│ │ ├── sendEmail.js
│ │ └── helpers.js
│ ├── .env.example
│ ├── package.json
│ └── server.js
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── api/
│ │ │ ├── axios.js
│ │ │ ├── authApi.js
│ │ │ ├── applicationApi.js
│ │ │ ├── adminApi.js
│ │ │ └── ...
│ │ ├── components/
│ │ │ ├── common/
│ │ │ │ ├── Button.jsx
│ │ │ │ ├── Input.jsx
│ │ │ │ ├── Modal.jsx
│ │ │ │ ├── Table.jsx
│ │ │ │ └── ...
│ │ │ ├── layout/
│ │ │ │ ├── Navbar.jsx
│ │ │ │ ├── Sidebar.jsx
│ │ │ │ └── Footer.jsx
│ │ │ ├── forms/
│ │ │ │ ├── InternshipForm.jsx
│ │ │ │ ├── InnovationForm.jsx
│ │ │ │ ├── StartupForm.jsx
│ │ │ │ ├── TrainingForm.jsx
│ │ │ │ └── ServiceRequestForm.jsx
│ │ │ ├── charts/
│ │ │ │ ├── AreaChart.jsx
│ │ │ │ ├── PieChart.jsx
│ │ │ │ └── BarChart.jsx
│ │ │ └── ...
│ │ ├── pages/
│ │ │ ├── public/
│ │ │ │ ├── Landing.jsx
│ │ │ │ ├── ServiceCatalog.jsx
│ │ │ │ ├── News.jsx
│ │ │ │ └── ...
│ │ │ ├── auth/
│ │ │ │ ├── Login.jsx
│ │ │ │ ├── Register.jsx
│ │ │ │ ├── VerifyEmail.jsx
│ │ │ │ ├── ForgotPassword.jsx
│ │ │ │ └── ResetPassword.jsx
│ │ │ ├── dashboards/
│ │ │ │ ├── AdminDashboard.jsx
│ │ │ │ ├── DirectorDashboard.jsx
│ │ │ │ ├── TeamLeadDashboard.jsx
│ │ │ │ ├── StaffDashboard.jsx
│ │ │ │ └── UserDashboard.jsx
│ │ │ ├── admin/
│ │ │ ├── director/
│ │ │ ├── team/
│ │ │ ├── staff/
│ │ │ └── user/
│ │ ├── store/
│ │ │ ├── authStore.js
│ │ │ ├── notificationStore.js
│ │ │ └── uiStore.js
│ │ ├── utils/
│ │ │ ├── constants.js
│ │ │ ├── formatters.js
│ │ │ └── validators.js
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ └── index.css
│ ├── index.html
│ ├── vite.config.js
│ ├── tailwind.config.js
│ └── package.json
├── .gitignore
├── README.md
└── LICENSE


---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
- **npm** (v9 or higher) or **yarn**
- **MongoDB** (v6 or higher) — [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** — [Download](https://git-scm.com/)
- **Cloudinary Account** — [Sign up](https://cloudinary.com/)
- **Email Account** (Gmail or SMTP) for Nodemailer

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/itsms.git
   cd itsms
   
2. **Install backend dependencies**
   ```bash
   cd backend
   npm install

3. **Install frontend dependencies**

   ```bash
   cd ../frontend
   npm install

**Environment Variables**
**Backend — backend/.env**
## Create a .env file in the backend/ directory:

*env*
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/itsms
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/itsms

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=ITSMS <your-email@gmail.com>

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for email links)
CLIENT_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

**Running the Application**
## Development Mode
## Start the backend:

    ```bash
    cd backend
    npm run dev
## The backend will run on http://localhost:5000

## Start the frontend (in a new terminal):

    ```bash
    cd frontend
    npm run dev
## The frontend will run on http://localhost:5173
