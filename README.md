# CampusCart | Campus Marketplace

CampusCart is a secure, campus-focused buy/sell marketplace designed for university students to trade items like textbooks, electronics, clothing, and furniture. This project is a realistic, polished, and fully functional portfolio application built using modern web development practices.

---

## 🛠️ Tech Stack

**Frontend:**
- **Vite + React** with **TypeScript** for a fast and type-safe user interface.
- **Tailwind CSS** for custom color palettes and responsive mobile-first layouts.
- **React Router (v6)** for client-side routing.
- **Axios** with request interceptors to automatically handle JWT auth headers.
- **Lucide React** for high-quality dashboard and interface icons.

**Backend:**
- **Node.js** & **Express** server in **TypeScript**.
- **Prisma ORM** for type-safe database queries.
- **SQLite** for zero-configuration, frictionless local database development (designed to easily switch back to **PostgreSQL** in production).
- **JWT (JSON Web Token)** for user authentication sessions.
- **bcryptjs** for secure password hashing.
- **Multer** for handling local image uploads statically served by the backend.

---

## 🌟 Key Features

1. **JWT Authentication & Protection:**
   - Password hashing with salt generation.
   - Protected endpoints on the backend.
   - Frontend Auth Context persisting login sessions in `localStorage`.
   - Access-control logic preventing non-owners from editing/deleting items.

2. **Marketplace Navigation & Search Filters:**
   - Responsive card grid displaying titles, images, categories, conditions, locations, and posted dates.
   - Real-time search keyword querying against titles and descriptions.
   - Filtering options for **Category**, **Condition**, **Item Status**, and **Budget Max Price**.

3. **Seller Dashboard:**
   - Visual dashboard summarising total listings, active items, sold items, and calculated overall earnings from sold products.
   - Quick inline card control triggers for editing, deleting, or marking an item as sold.

4. **Product Details & In-App Contact:**
   - Deep details display page (full description, condition, location, post date).
   - "Contact Seller" mailto link auto-generating an email template for buyer inquiry.
   - Dynamic safety note reminding students to meet in public campus zones.

5. **Image Uploads:**
   - Integrated Multer processing local image storage in `backend/uploads/`.
   - Supports image attachment on creation and image replacement during edits.

---

## 📂 Folder Structure

```text
CampusCart/
├── backend/
│   ├── prisma/
│   │   ├── migrations/      # Auto-generated database migration files
│   │   ├── schema.prisma    # Prisma SQLite schema definition
│   │   └── seed.ts          # Database seed script
│   ├── src/
│   │   ├── config/          # Instantiated DB Client
│   │   ├── controllers/     # Controller handlers for auth & listings
│   │   ├── middleware/      # Authentication, Multer file upload, & Error Handlers
│   │   ├── routes/          # Express API route endpoints
│   │   ├── types/           # Request/User TypeScript interfaces
│   │   └── index.ts         # Main backend application entry point
│   ├── uploads/             # Server directory storing product images
│   ├── .env.example         # Template for server configuration
│   └── package.json         # Backend node scripts & dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # Common UI parts (Navbar, ProtectedRoute)
│   │   ├── context/         # AuthContext state provider
│   │   ├── pages/           # Marketplace pages (Home, Details, Create, Edit, Dashboard, Login, Signup)
│   │   ├── services/        # Axios API configurations
│   │   ├── App.tsx          # Router layout and wrapper mounting
│   │   ├── index.css        # Stylesheet styling directives
│   │   └── main.tsx         # Document React mount hook
│   ├── .env.example         # Template for frontend environment variables
│   ├── index.html           # Document template with Inter font links
│   ├── tailwind.config.js   # Tailwind style customization configurations
│   └── package.json         # Frontend packages and scripts
├── docker-compose.yml       # Docker compose file for running PostgreSQL in production
└── README.md                # Project documentation
```

---

## 🚦 Getting Started (Local Run)

Follow these simple commands to run the project locally.

### Prerequisites
Make sure you have **Node.js (v18+)** and **npm** installed.

### 1. Database & Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Set up the `.env` file from the template:
   ```bash
   cp .env.example .env
   ```
4. Run migrations to initialize the database:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Seed the database with 2 demo users and 10 sample listings:
   ```bash
   npx prisma db seed
   ```
6. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend will boot up on [http://localhost:5000](http://localhost:5000).*

### 2. Frontend Setup
1. Open a second terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Set up the `.env` file from the template:
   ```bash
   cp .env.example .env
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.*

---

## 🔒 Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET=super_secret_jwt_pass_phrase_123!
PORT=5000
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🔗 Core API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Authenticate user credentials
- `GET /api/auth/me` - Fetch current user profile (Protected)

### Listings
- `GET /api/listings` - Public list of listings (Supports query params: `search`, `category`, `condition`, `status`, `maxPrice`)
- `GET /api/listings/:id` - Fetch details for a specific listing
- `POST /api/listings` - Create a listing (Protected, supports image upload)
- `PUT /api/listings/:id` - Edit listing details (Protected, Owner Only, supports image replacement)
- `DELETE /api/listings/:id` - Delete a listing (Protected, Owner Only)
- `PATCH /api/listings/:id/sold` - Mark a listing as sold (Protected, Owner Only)

### User Metrics
- `GET /api/users/me/listings` - Fetch logged-in user's own listings (Protected)

---

## 🧑‍💻 Demo Credentials
You can log in immediately using these pre-seeded accounts:
- **User 1:** `alice@campus.edu` / `password123`
- **User 2:** `bob@campus.edu` / `password123`

---

## 📈 Future Improvements
- **Live Chat Messaging:** Replace `mailto:` links with socket-based direct messaging between students.
- **Email Verification:** Implement student domain verification (e.g., enforcing `.edu` email domains).
- **Interactive Map:** Integrate campus map pin locations to guide exchange drop-off spots.
- **Favoriting:** Allow students to bookmark listings for later review.

---

## 📝 Resume Bullet
> "Built CampusCart, a full-stack campus marketplace web application using React, TypeScript, Node.js, Express, PostgreSQL, Prisma, and JWT authentication, allowing students to post used items, upload images, search/filter listings, contact sellers, and manage item availability through a seller dashboard."
