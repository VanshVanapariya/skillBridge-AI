# 🚀 SkillBridge AI

**SkillBridge AI** is a complete, AI-powered interview preparation platform designed to bridge the gap between job candidates and their target roles. By leveraging **Google Gemini AI** and **Puppeteer**, the platform parses uploaded resume PDFs, evaluates them against target Job Descriptions (JDs), identifies critical skill gaps, creates personalized preparation roadmaps, and builds recruiter-ready tailored resumes.

---

## ✨ Features

| Feature | Description |
| :--- | :--- |
| **🔐 Robust Authentication** | Secure user registration, login, session cookies with cross-origin security, and password recovery. |
| **📄 AI Resume Parser** | Automatically uploads, parses, and extracts text from resume PDF files (up to `3MB`). |
| **📊 Readiness & Gap Analysis** | Analyzes candidate resume content against a target Job Description (JD) to compute match score, strengths, and deficiencies. |
| **🗺️ Personalized Roadmaps** | Generates tailored step-by-step preparation guidelines with dynamic phases to acquire missing skills. |
| **📝 PDF Resume Builder** | Generates and exports custom-tailored, recruiter-ready resumes based on target JDs. |
| **📈 Health & Security** | Includes secure rate-limiting for endpoint abuse mitigation and a public status check endpoint. |

---

## 🛠️ Tech Stack

| Layer / Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 / Vite | Core application library and fast build bundling |
| **Client Routing** | React Router v7 | Client-side page navigation and route protection |
| **Styling** | Tailwind CSS v4 / Sass | Modern responsive layout styling and design tokens |
| **HTTP Client** | Axios | REST API calls with cross-origin cookie credentials |
| **Backend Framework** | Node.js / Express | Server runtime environment and REST API routes |
| **Database** | MongoDB / Mongoose | Database storage, modeling, and schemas |
| **AI Integration** | Google Gemini AI (`@google/genai`) | Candidate skill evaluation and roadmap generation |
| **File Parsing** | PDF-Parse / Multer | Multipart file uploads and raw PDF text extraction |
| **PDF Compiler** | Puppeteer | Serverless/cloud-compatible PDF resume generation |
| **Structured Logger** | Pino / Pino-Pretty | JSON production logging and development formatting |

---

## 📂 Project Structure

```text
skillBridge-AI/
├── Backend/               # Express API & Server Logic
│   ├── src/
│   │   ├── config/        # Database & Environment config
│   │   ├── controllers/   # Request handlers
│   │   ├── middlewares/   # Auth, rate limiter, & file upload middlewares
│   │   ├── models/        # Mongoose database schemas
│   │   ├── routs/         # Express API routers
│   │   ├── services/      # Gemini AI and business logic
│   │   └── utils/         # Logger and helpers
│   ├── server.js          # Entry point
│   └── render-build.sh    # Custom Render deployment build script
└── Frontend/              # React SPA
    ├── src/
    │   ├── assets/        # Styles and static assets
    │   ├── features/      # Modular components (auth, interview, home)
    │   └── main.jsx       # App initialization
    ├── vercel.json        # Routing fallback rules for Vercel
    └── vite.config.js     # Vite configuration
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Google Gemini API Key

---

### Backend Setup

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Backend` folder and populate the variables:

| Environment Variable | Example / Default Value | Purpose |
| :--- | :--- | :--- |
| `PORT` | `3000` | Port for Express server to listen on |
| `MONGO_URI` | `mongodb+srv://...` | MongoDB connection string |
| `JWT_SECRET` | `your_jwt_secret_key` | Secret key for signing JSON Web Tokens |
| `COOKIE_SECRET` | `your_cookie_parser_secret` | Secret key for validation of cookies |
| `GOOGLE_GEMINI_API_KEY` | `AIzaSy...` | API Key for accessing Gemini services |
| `EMAIL_USER` | `user@gmail.com` | Email account for password reset mailing |
| `EMAIL_PASS` | `app_password` | App-specific password for SMTP auth |
| `FRONTEND_URL` | `http://localhost:5173` | CORS whitelist allowed client origin |

4. Start the development server:
   ```bash
   npm run dev
   ```

---

### Frontend Setup

1. Navigate to the `Frontend` directory:
   ```bash
   cd ../Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Frontend` folder:

| Environment Variable | Example / Default Value | Purpose |
| :--- | :--- | :--- |
| `VITE_API_URL` | `http://localhost:3000` | Backend server base URL |

4. Start the frontend client:
   ```bash
   npm run dev
   ```

---

## 🌐 Deployment Configuration

- **Backend**: Hosted on [Render.com](https://render.com) using a custom build script (`render-build.sh`) to support Puppeteer PDF compilation.
- **Frontend**: Hosted on [Vercel](https://vercel.com) with routing fallbacks (`vercel.json`) to handle client-side routing.

---

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/register` | Public | Register a new account |
| **POST** | `/login` | Public | Log in and set JWT token cookie |
| **GET** | `/logout` | Public | Log out and clear session cookie |
| **GET** | `/get-me` | Private | Retrieve current user profile details |
| **POST** | `/forgot-password` | Public | Request password reset email link |
| **POST** | `/reset-password/:token` | Public | Reset password using email link token |

### Interview & Reports (`/api/interview`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/` | Private | Generate report using self-description, job-description, and resume PDF |
| **GET** | `/` | Private | Fetch all interview reports for logged-in user |
| **GET** | `/report/:interviewId` | Private | Retrieve specific report details by ID |
| **POST** | `/resume/pdf/:interviewId` | Private | Generate and download tailored resume PDF |
| **POST** | `/questions/regenerate/:interviewId` | Private | Regenerate interview practice questions |
| **DELETE** | `/:interviewId` | Private | Delete a report by ID |
