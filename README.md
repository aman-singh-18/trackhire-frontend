# TrackHire 🚀

TrackHire is a robust, full-stack MERN application designed to consolidate the interview lifecycle for active job seekers. It eliminates context-switching by combining interview pipeline tracking, contextual preparation notes workspaces, automated email reminders, and centralized profile credential management into a unified dashboard workspace.

### 🔗 Active Deployment Links
* **Live Web Application (Frontend):** [https://trackhire-frontend.vercel.app](https://trackhire-frontend.vercel.app/)
* **Live Production API Gateway (Backend):** [https://trackhire-backend.onrender.com](https://trackhire-backend.onrender.com/)

---

## 🛠️ Core Architectural Features

* **Comprehensive Interview Tracker:** Complete CRUD pipeline filtering job applications across custom milestone enums (`Applied`, `OA`, `Interview`, `Offer`, `Rejected`).
* **Automated Task Scheduler & Reminder Subsystem:** Leverages a `node-cron` background daemon routine paired with `nodemailer` to automatically sweep the database cluster and dispatch urgent morning email notifications to users regarding upcoming target task deadlines.
* **Persistent Markdown Workspace:** Embedded rich-text editor supporting structured preparation notes parsed securely via a reactive markdown rendering engine.
* **Centralized Document Repository Locker:** Allows passwordless account profiles to store multiple variation records of technical resumes natively using atomic MongoDB array subdocuments, decoupled from standard heavy joins.
* **Chronological State Auditing Log:** Implements Mongoose internal subdocument models to log state transition snapshots in real-time, displaying a visual activity history feed.

---

## 🧰 Tech Stack Matrix

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React.js (v18+), Vite, Tailwind CSS, Lucide Icons, React Router DOM |
| **Backend** | Node.js, Express.js framework, Multer Middleware |
| **Database** | MongoDB Atlas cluster cloud synchronization layer via Mongoose ODM |
| **Authentication** | Secure custom state sessions with JSON Web Tokens (JWT) & HTTP-Only Cookies |

---

## 🚀 Local Installation & Setup

Follow these steps to spin up the local development environment on your machine:

### 1. Prerequisites
Ensure you have **Node.js (v18+)** and **npm** installed on your operating system.

### 2. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/trackhire.git](https://github.com/YOUR_USERNAME/trackhire.git)
cd trackhire
