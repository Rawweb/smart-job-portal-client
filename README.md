# SkillBridge — Smart Job Portal for Graduates

A modern, intelligent job portal built to bridge the gap between graduate skills and employer expectations. SkillBridge goes beyond a traditional job board by analysing the compatibility between a graduate's skill profile and a job's requirements — showing exactly which skills match and which ones are missing, then recommending areas for improvement.

---

## What Makes This Different From A Normal Job Portal

Most job portals let you upload a CV and apply. That's it. SkillBridge adds a layer of intelligence on top of that:

- A graduate's skills are compared against every job they view
- A **compatibility score** (e.g. 78%) is calculated instantly
- **Matched skills** and **missing skills** are shown clearly
- **Improvement recommendations** are generated based on the gap
- Employers see applicant skill match scores alongside their applications

This means graduates apply smarter, and employers screen faster.

---

## Built With

**Frontend**
- [React](https://react.dev/) — UI library
- [Vite](https://vitejs.dev/) — Build tool
- [Tailwind CSS v4](https://tailwindcss.com/) — Utility-first styling
- [React Router DOM](https://reactrouter.com/) — Client-side routing
- [Axios](https://axios-http.com/) — HTTP requests
- [React Hook Form](https://react-hook-form.com/) — Form management
- [Zod](https://zod.dev/) — Schema-based form validation
- [TanStack React Query](https://tanstack.com/query) — Server state and data fetching
- [Framer Motion](https://www.framer.com/motion/) — Animations and transitions
- [React Dropzone](https://react-dropzone.js.org/) — Resume file uploads
- [React Hot Toast](https://react-hot-toast.com/) — Toast notifications
- [Lucide React](https://lucide.dev/) — Icons

**Backend** *(separate repo or `/server` directory)*
- Node.js + Express (ES Modules)
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs, multer, mammoth, pdf-parse

---

## Core Features

### For Graduates
- Register and create a skill-based profile
- Upload resume (PDF or DOCX) with auto skill extraction
- Browse all active job listings
- See a real-time **skill compatibility score** for every job
- View matched and missing skills per job
- Receive structured improvement recommendations
- Apply for jobs and track application status

### For Employers
- Register company profile
- Post job vacancies with required skills
- View all applicants per job
- See each applicant's skill match score
- Shortlist or reject candidates

### For Admins
- Manage users and job posts
- Monitor platform activity
- Manage skill categories

---

## Sector Coverage

The skill gap analysis covers five employment sectors:

- Information Technology
- Banking and Finance
- Education
- Healthcare Administration
- Engineering and Technical Services

---

## Project Structure

```
client/
├── public/
├── src/
│   ├── api/              # Axios instance and interceptors
│   ├── components/       # Reusable UI components
│   │   ├── ui/           # Base elements (buttons, inputs, badges)
│   │   └── layout/       # Navbar, sidebar, page wrappers
│   ├── context/          # Auth context and global state
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # All page components
│   │   ├── auth/         # Register, Login, SelectRole
│   │   ├── onboarding/   # Graduate and Employer onboarding flows
│   │   ├── dashboard/    # Graduate and Employer dashboards
│   │   ├── jobs/         # Job listings, job detail, apply
│   │   └── admin/        # Admin panel pages
│   ├── App.jsx           # Routes and route guards
│   ├── main.jsx          # App entry point
│   └── index.css         # Global styles, design tokens, utility classes
├── .env                  # Environment variables (not committed)
├── vite.config.js
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js v18 or higher
- The backend server running on `http://localhost:5000`

### Installation

```bash
# Clone the repository
git clone the repo

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
# Then open .env and set VITE_API_URL=http://localhost:5000/api

# Start the development server
npm run dev
```

App runs on `http://localhost:5173`

---

## Environment Variables

Create a `.env` file in the `client/` root:

```
VITE_API_URL=http://localhost:5000/api
```

> Never commit your `.env` file. It is already listed in `.gitignore`.

---

## Acknowledgements

This project was developed as a final year dissertation project at Nnamdi Azikiwe University, Awka — Department of Computer Science, Faculty of Physical Sciences.

**Research Title:** Design and Implementation of a Smart Job Portal for Graduates with Skill Gap Analysis

---

## License

This project is for academic and portfolio purposes.