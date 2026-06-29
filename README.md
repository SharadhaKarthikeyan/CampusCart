# CampusCart: Campus-Focused Buy/Sell Marketplace and Student Trading Platform

![React](https://img.shields.io/badge/React-19.2-blue.svg?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg?style=flat&logo=nodedotjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-123547.svg?style=flat&logo=prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Database-lightgrey.svg?style=flat&logo=sqlite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8.svg?style=flat&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat)

---

**Tech Stack:** React, TypeScript, Node.js, Express, Prisma, SQLite, Tailwind CSS

---

## Project Overview
University students frequently need to sell used textbooks, dorm furniture, electronics, and clothing, or buy affordable items from graduating students. Generic public marketplaces lack trust and expose students to shipping costs or safety concerns when meeting strangers off-campus.

CampusCart is a campus-focused marketplace with authentication, protected seller actions, and safety-focused meetup guidance. It connects students within a trusted university community, enabling them to browse listings, filter products, manage items, and contact sellers. The project utilizes a modern full-stack architecture to deliver a polished, responsive web interface.

## Project Background
CampusCart was developed as a complete portfolio project to demonstrate end-to-end full-stack software development skills. Rather than a basic mock application, it builds a fully functioning marketplace integrating local image hosting, structured database models, and relational queries.

SQLite is used for local development with Prisma ORM, and the project is designed to be easily migrated to PostgreSQL for production. It uses a Vite-React frontend to model a responsive user experience.

## Portfolio Highlights
This project demonstrates proficiency in:
*   **Full-Stack TypeScript Integration**: Shared type definitions, type-safe API requests, and controller routing models.
*   **Database Relational Mapping**: Constructing one-to-many associations (User has many Listings) and querying relational models with Prisma ORM.
*   **Image Processing & Local Storage**: Configuring Multer disk storage on the backend to dynamically save and statically serve uploaded files.
*   **Security & Session Authentication**: Hashing user passwords with bcryptjs before storing them in the database and validating client sessions with bearer JWT authorization middleware.
*   **Responsive Mobile-First UI**: Building collapsible navbar drawers, interactive filters, card lists, and skeleton loading views with Tailwind CSS.
*   **Interactive Analytics Dashboard**: Calculating active inventory levels, sold item counts and estimated cumulative earnings dynamically.

---

## Business Problem
University students suffer from financial constraints and lack a direct, trusted method to exchange goods locally. Using public listings services (like Craigslist or eBay) introduces risks of scams, requires expensive shipping, or forces students to meet off-campus. Campuses also face unnecessary waste when students discard usable furniture, electronics, and supplies during move-out periods.

## Project Objective
To build a multi-layered trading platform that:
1.  **Enables users to create, browse, search, filter, and manage item listings** in a responsive card grid mapping category, condition, price, and campus location.
2.  **Protects User Sessions** using JWT authentication, blocking unauthorized edits, deletes, or status changes.
3.  **Facilitates Safe Meetups** by restricting communication to official campus emails and highlighting physical safety reminders.
4.  **Generates Seller Analytics** to summarize total active posts and calculate cumulative sales earnings.

---

## Dataset Description
The platform operates on a relational database mapped through Prisma, containing two core entities:

*   **User Model**:
    *   *Attributes*: `id` (Auto-increment), `name`, `email` (Unique), `passwordHash`, `createdAt`, `updatedAt`.
    *   *Relations*: Has a one-to-many link to the `Listing` model.
*   **Listing Model**:
    *   *Attributes*: `id` (Auto-increment), `sellerId`, `title`, `description`, `price` (Float), `category`, `condition`, `location`, `imageUrl` (Nullable), `status` (Default: "Available"), `createdAt`, `updatedAt`.
    *   *Relations*: Belongs to a single `User` model.

---

## Tools and Technologies
*   **Frontend**: React (v19), TypeScript, Vite, Tailwind CSS, React Router (v6), Axios, Lucide React.
*   **Backend**: Node.js, Express, TypeScript, Multer, JWT (`jsonwebtoken`), `bcryptjs`.
*   **Database**: SQLite (local dev), PostgreSQL (production-ready via Docker), Prisma ORM.

---

## Folder Structure
```
CampusCart/
├── backend/
│   ├── prisma/
│   │   ├── migrations/                  # Database schema migrations history
│   │   ├── schema.prisma                # Database schema model mapping
│   │   └── seed.ts                      # Seeder creating 2 users and 10 listings
│   ├── src/
│   │   ├── config/                      # Database client instantiations
│   │   ├── controllers/                 # Express route handlers for auth & listings
│   │   ├── middleware/                  # Token authentication, uploads, & errors
│   │   ├── routes/                      # Route definitions
│   │   ├── types/                       # Custom TypeScript request definitions
│   │   └── index.ts                     # Main Express server entry point
│   ├── uploads/                         # Directory storing listing image files
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/                  # Common parts (Navbar, ProtectedRoute)
│   │   ├── context/                     # AuthContext session provider
│   │   ├── pages/                       # Marketplace pages (Home, Details, Forms, Dash)
│   │   ├── services/                    # Axios API client interceptors
│   │   ├── App.tsx                      # Core router layout
│   │   └── main.tsx                     # React mount entry
│   ├── .env.example
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
├── docker-compose.yml                   # Optional PostgreSQL database service for production-style setup
└── README.md                            # Project documentation
```

---

## Methodology
1.  **Relational Modeling**: Constructed the SQLite schema defining matching tables for `User` and `Listing` with automatic delete cascades.
2.  **API Development**: Coded Express routes validating input criteria, hashing password data, and verifying JWT tokens in request headers.
3.  **Local Image Uploads**: Set up Multer disk storage and exposed the `uploads/` folder as a static path on the Express server.
4.  **Integrated Dashboard**: Created state managers on the frontend retrieving listings and calculating totals.
5.  **Build Verification**: Ran automated compile scripts to ensure strict TypeScript checks were resolved without errors.

---

## Key Configuration Categories
The platform enforces strict rules on the allowed values for item fields:

*   **Allowed Categories**: `Furniture`, `Electronics`, `Books`, `Kitchen`, `Clothing`, `Home`, `Other`.
*   **Allowed Conditions**: `New`, `Like New`, `Good`, `Fair`, `Poor`.
*   **Allowed Statuses**: `Available`, `Sold`.

---

## Key KPIs (Seller Dashboard)
*   **Total Listed**: Cumulative count of all items listed by the student.
*   **Active Items**: Count of listed items currently set to "Available".
*   **Items Sold**: Count of listed items currently marked as "Sold".
*   **Total Earnings**: Cumulative earnings generated from all "Sold" items.

---

## Visual Insights
Below are the key user interface screens built into the platform:

1.  **Marketplace Grid**: Displays listings in a responsive card grid showing visual badges, conditions, prices, locations, and posted dates.
2.  **Search & Filters**: Top search bar with side panels filtering by category, condition, status, and maximum price boundaries.
3.  **Product Details Split View**: Large left-column visual layouts paired with right-column product data, safety alert boxes, and action keys.
4.  **Interactive Forms**: Clean input forms supporting file upload inputs, image deletion triggers, and preview thumbnails.

---

## How to Run the Project

### Prerequisites
*   Node.js (v18+)
*   npm

### 1. Database & Backend Setup
1.  **Navigate to the backend folder**:
    ```bash
    cd backend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Set up the environment file**:
    ```bash
    cp .env.example .env
    ```
4.  **Run migrations to initialize SQLite database**:
    ```bash
    npx prisma migrate dev --name init
    ```
5.  **Seed the database with 2 demo users and 10 listings**:
    ```bash
    npx prisma db seed
    ```
6.  **Start the backend development server**:
    ```bash
    npm run dev
    ```
    *The backend server will run on [http://localhost:5000](http://localhost:5000).*

### 2. Frontend Setup
1.  **Open a new terminal window and navigate to the frontend folder**:
    ```bash
    cd ../frontend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Set up the environment file**:
    ```bash
    cp .env.example .env
    ```
4.  **Start the frontend development server**:
    ```bash
    npm run dev
    ```
    *Open [http://localhost:5173](http://localhost:5173) in your browser to view the website.*

---

## Demo Credentials
Log in with either of these accounts to test owner-specific controls (editing, deleting, and marking items as sold):
*   **User 1**: `alice@campus.edu` / `password123`
*   **User 2**: `bob@campus.edu` / `password123`

> [!WARNING]
> These credentials are for local demo/testing only and should not be used in production.

---

## Core API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/signup` | Register a new account |
| POST | `/login` | Login to an existing account |
| GET | `/me` | Retrieve authenticated user profile (Protected) |

### Listings Routes — `/api/listings`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Public listings search (Supports parameters: `search`, `category`, `condition`, `status`, `maxPrice`) |
| GET | `/:id` | Get specific listing information |
| POST | `/` | Post a new listing (Protected, supports image upload) |
| PUT | `/:id` | Edit listing details (Protected, Owner Only, supports image replacement) |
| DELETE | `/:id` | Delete a listing (Protected, Owner Only) |
| PATCH | `/:id/sold` | Mark a listing as sold (Protected, Owner Only) |

### User Routes — `/api/users`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/me/listings` | Get listings posted by the logged-in user (Protected) |

---

## Demo / Screenshots
*   Marketplace grid
*   Listing details page
*   Create listing form
*   Seller dashboard

---

## Production Deployment Notes
For production deployment, image storage should be migrated from local uploads to cloud object storage such as AWS S3, and JWT storage should be moved from localStorage to HTTP-only secure cookies.

---

## Project Limitations
*   **Local Image Storage**: Images are saved in a local folder (`backend/uploads/`). Deploying to cloud instances (like Heroku or render.com) with ephemeral filesystems requires swapping this setup to use cloud bucket hosting (like AWS S3).
*   **Simplified Token Storage**: JWT tokens are kept in `localStorage` for testing convenience. It is recommended to use HTTP-Only cookie tokens in production.

## Future Improvements
*   **Live Chat Messaging**: Integrate socket connection libraries (like Socket.io) to support in-app messages, replacing mailto email buttons.
*   **Verified Edu Domains**: Restrict signups to users with university email addresses (e.g. validating `.edu` domains).
*   **Drop-off Maps**: Add mapping locations for specific campus drop-off zones.

---

## Resume Bullet
> "Built CampusCart, a full-stack campus marketplace using React, TypeScript, Node.js, Express, Prisma, SQLite, and JWT authentication, enabling students to create listings, upload images, search/filter items, contact sellers, and manage item status through a seller dashboard."

---
**Author: Sharadha Karthikeyan**
