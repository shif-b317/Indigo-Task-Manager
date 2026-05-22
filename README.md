#  IndigoTask - Premium Task Management System

IndigoTask is a high-performance, responsive, and visually stunning full-stack Task Management application. Built with **React 19**, **Vite**, **Node.js**, **Express**, **MongoDB**, and **Socket.io**, it offers real-time state synchronization, drag-ready layouts, interactive charts, and double custom-tailored theme environments (**Midnight Indigo** and **Vanilla Cream**).

---

##  Live Links
* **Frontend App:** [https://indigo-task-manager-y5g2.vercel.app/](https://indigo-task-manager-y5g2.vercel.app/)
* **Backend API Server:** [https://indigo-task-manager.onrender.com](https://indigo-task-manager.onrender.com)

---

##  Features

### 1.  Theme Design & Aesthetics
* **Midnight Indigo (`#212842`):** Primary theme with a dark, immersive background and premium neon accents.
* **Vanilla Cream (`#F0E7D5`):** secondary light theme featuring soft off-white surfaces and rich indigo typography.
* Glassmorphic elements, smooth micro-animations, skeleton loader pages, and fluid layout transitions.

### 2.  Real-Time Synchronization
* **WebSocket Integration:** Powered by `Socket.io`. Updates to tasks (creation, completion status, deletions) reflect instantly across all logged-in devices/browser tabs in real-time.

### 3.  Dashboard Analytics
* Complete breakdown of tasks: **Total**, **Completed**, and **Pending**.
* Circular SVG-based dynamic progress chart displaying real-time productivity levels.
* Today's Deadline Alerts and a live timeline tracking the 5 most recent activities.

### 4.  Task Management & Views
* **Layout Switcher:** Instantly toggle between a classic **List View** and a multi-column **Kanban Board** (Pending, In Progress, Completed).
* **Granular Details:** Dedicated task detail subpages with support for checkable subtasks, comments, priority states, and due-date tracking.
* **Filter & Search:** Live keyword query search combined with status tabs, priority sorting, and creation-date filters.

### 5.  Security & Auth
* Secure **JWT Session Tokens** with auto-injecting interceptors via `Axios`.
* Salted password hashing on backend register using `bcryptjs`.
* Client-side validation banners, password visibility toggles, and stateful authentication checking.

---

## Tech Stack

* **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion, Axios, React Router Dom, Lucide React
* **Backend:** Node.js, Express, Socket.io, Mongoose (MongoDB), JWT, BcryptJS
* **Database fallback:** Built-in `mongodb-memory-server` local fallback (zero-config run if MongoDB Atlas URI is omitted).


