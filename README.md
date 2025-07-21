# BudgetBuddy

BudgetBuddy is an AI-powered personal finance MVP that helps you track your income and expenses in real-time, categorize transactions, and visualize your spending habits.

## 🛠 Tech Stack
- **Frontend:** Next.js + Tailwind CSS
- **Backend:** Express.js + MongoDB
- **Real-time:** Socket.IO
- **Testing:** Jest (backend)
- **CI/CD:** GitHub Actions
- **Deployment:** Vercel (frontend), Render/Railway (backend)

## ✅ MVP Features
- User can input income and expenses
- Real-time updates of transactions
- Automatic categorization of transactions (basic rules/AI)
- Dashboard with balance, category-wise spending, charts
- Simple login/registration or mock session

## 📦 Project Structure
```
/client   # Next.js frontend
/server   # Express backend
```

## 🚀 Quick Start

### 1. Clone & Install
```bash
# Clone repo
 git clone <your-repo-url>
 cd budgetbuddy-fintech

# Install backend
 cd server && npm install
 cp .env.example .env # Edit with your Mongo URI

# Install frontend
 cd ../client && npm install
 cp .env.example .env # Edit if deploying
```

### 2. Run Locally
```bash
# Start backend
cd server && npm run dev
# Starts on http://localhost:5000

# Start frontend
cd ../client && npm run dev
# Starts on http://localhost:3000
```

### 3. Run Backend Tests
```bash
cd server
npm test
```

## 🧪 Testing & Debugging
- Backend: Jest unit/integration tests in `/server/tests`
- Example test: categorizer, summary, API endpoint
- Debug logs: `console.log` and `console.error`

## 🗂 .gitignore
```
node_modules
.env
.next
out
.DS_Store
dist
coverage
logs
*.log
```

## 📦 Deployment
- Backend: Render/Railway (set `MONGO_URI`, `CLIENT_URL` in env)
- Frontend: Vercel (set `NEXT_PUBLIC_API_URL` in env)

## 🤝 Contributing
- Use feature branches: `feature/<name>`
- Conventional Commits
- Pull Requests for review

## License
MIT
