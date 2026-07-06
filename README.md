# 🚀 Interview Dost

**Interview Dost** is an AI-powered full-stack application designed to help job seekers ace their technical and behavioral interviews. By analyzing a candidate's resume against a specific Job Description (JD), the platform generates brutal, honest feedback, custom interview questions, day-by-day preparation plans, and even automatically rewrites and exports a highly ATS-optimized PDF resume.

## ✨ Key Features

* **🧠 AI-Powered Interview Analysis:** Uses Google's Gemini 3 Flash to evaluate resumes against target job descriptions, providing an honest ATS score and identifying critical skill gaps.
* **🎯 Smart Question Generation:** Generates customized technical and behavioral interview questions. Instead of just giving the "correct" answer, the AI provides a detailed coaching guide (e.g., using the STAR method) on *how* to answer each question effectively.
* **📅 Custom Preparation Plans:** Automatically creates a structured, day-by-day study plan focused on bridging the specific skill gaps identified in the analysis.
* **📄 AI Resume Rewriter & PDF Export:** Seamlessly rewrites the user's resume to better align with the JD while maintaining absolute honesty. It converts the AI-generated HTML into a clean, minimalist, ATS-friendly PDF using Puppeteer.
* **🔒 Bulletproof Authentication:** Secure JWT-based authentication system utilizing HttpOnly cookies with a robust Header (Bearer token) fallback to bypass strict browser cross-domain policies.
* **📚 Report History:** Users can securely access and review their past generated interview reports from their personal dashboard.

---

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* SCSS
* Axios (with custom Interceptors)
* React Router
* React Hot Toast

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose
* Google Gen AI SDK (`@google/genai`)
* Puppeteer (Headless browser for PDF rendering)
* `pdf-parse` (For extracting text from uploaded resumes)
* JSON Web Tokens (JWT) & bcrypt

---

## 💻 Local Setup & Installation

Follow these steps to get the project running on your local machine.

### 1. Clone the repository

```bash
git clone https://github.com/SayanIndra83/InterviewDost.git
cd InterviewDost
```

### 2. Setup the Backend

Navigate to the server directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory and add the following variables:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
```

Start the backend server:

```bash
npm run dev
```

### 3. Setup the Frontend

Open a new terminal, navigate to the client directory, and install dependencies:

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_SERVER_URL=http://localhost:3000
```

Start the React development server:

```bash
npm run dev
```

---

## 🚦 API Endpoints Reference

### Authentication

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Authenticate user & set tokens |
| GET | `/api/auth/logout` | Clear tokens/cookies |
| GET | `/api/auth/get-me` | Retrieve current logged-in user |

### Interview & AI Core

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/interview/` | Upload resume (FormData), JD, and Self-Description to generate a full AI report |
| GET | `/api/interview/reports` | Fetch all past reports for the authenticated user |
| GET | `/api/interview/report/:interviewId` | Fetch a specific report |
| POST | `/api/interview/resume/pdf/:interviewId` | Trigger AI resume rewrite and download the generated PDF |

---

## 💡 How the AI PDF Generation Works

1. **Extraction:** `pdf-parse` reads the user's uploaded resume buffer.
2. **Prompting:** Gemini is prompted with strict constraints to rewrite the resume in semantic HTML with inline CSS, tailored specifically to the Job Description.
3. **Rendering:** The backend spins up a headless Puppeteer browser, injects the AI-generated HTML, and prints it directly to an A4 PDF buffer.
4. **Delivery:** The generated PDF is sent back to the client as a downloadable blob.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## Author 
Sayan Indra

## 📝 License

This project is MIT licensed.
