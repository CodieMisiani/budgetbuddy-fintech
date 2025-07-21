# BudgetBuddy

BudgetBuddy is an AI-powered personal finance MVP that helps you track your income and expenses in real-time, categorize transactions, and visualize your spending habits.

## 🛠 Tech Stack
- **Frontend:** Next.js + Tailwind CSS
- **Backend:** Express.js + MongoDB
- **Real-time:** Socket.IO
- **Testing:** Jest (backend)
- **CI/CD:** GitHub Actions
- **Deployment:** Vercel (frontend), Render/Railway (backend)

---

## 🏷️ Branches & Features

- `main`: Stable, production-ready codebase.
- `feature/validation`: Joi validation for transactions.
- `test/backend-api`: Automated Jest/Supertest API tests.
- `feature/admin-ui`: Admin dashboard for user management.
- `feature/live-typing`: Real-time typing indicator with Socket.IO.
- `feature/premium`: Monetization scaffold, `/pricing` page, premium flag.

## ✅ MVP Features
- User can input income and expenses
- Real-time updates of transactions
- Automatic categorization of transactions (basic rules/AI)

---

## 🗃️ Backend Models

### Transaction Model (`/server/models/transaction.js`)

The Transaction model represents a single financial transaction (income or expense) in the system.

| Field       | Type   | Required | Description                                |
|-------------|--------|----------|--------------------------------------------|
| amount      | Number | Yes      | Transaction amount (positive/negative)     |
| date        | Date   | Yes      | Date of the transaction                    |
| description | String | Yes      | Description or note for the transaction    |
| vendor      | String | No       | Vendor/merchant name (optional)            |
| category    | String | No       | Category (auto-assigned, default: 'Uncategorized') |
| createdAt   | Date   | No       | Timestamp when the transaction was created |

See the model definition in `/server/models/transaction.js` for details.

---

## 🚀 New Features & UI Polish (2025-07-21)

### ✨ Modern UI & UX
- **Header:** Gradient, glassmorphism, logo, mobile nav, login/logout/profile/admin buttons
- **Design System:** All colors, gradients, and animations in `client/index.css` for consistent branding
- **Smart Transaction Form:** AI-powered, Kenyan context, spinner, toast, beautiful card
- **Transaction List:** Card layout, badges, relative time, sample/demo data, mobile-friendly
- **Toast Notifications:** For all feedback (success/error)
- **404 Page:** Custom not found experience
- **Mobile Responsive:** All screens tested on mobile

### 🔒 Authentication & Protected Routes
- **Login & Signup:** Beautiful forms, validation, toast feedback
- **JWT Auth:** Secure, persistent login with auto-login
- **Profile Page:** View user info and premium status
- **Admin Dashboard:** List users, see roles, premium status
- **Protected Routes:** `/`, `/profile`, `/admin` require auth (auto-redirect to `/login`)
- **Role-based Access:** Admin-only dashboard and analytics

### 🧠 AI Categorization
- **Kenyan Vendor AI:** Naivas→Groceries, Uber→Transport, KFC→Dining, etc.
- **Income/Expense Detection:** Based on input text
- **Relative Timestamps:** "2 hours ago" display

### 🧪 Testing
- **Backend:** Jest + Supertest for all API endpoints
- **Frontend:** Manual and automated UI/UX checks

---

## 🌍 Deployment Guide (Step-by-Step)

### 1. **Create a Free MongoDB Atlas Cluster**
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
- Create a free cluster, user, and get your connection string

### 2. **Deploy Backend to Render.com**
- Push your code to GitHub (main branch up to date)
- Go to [Render.com](https://render.com/) → New Web Service → Connect your repo
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `node index.js`
- **Environment Variables:**
  - `MONGO_URI` = your Atlas string
  - `JWT_SECRET` = your secret
  - `CLIENT_URL` = your Vercel frontend URL
- Deploy and copy your backend URL (e.g., `https://budgetbuddy-backend.onrender.com`)

### 3. **Deploy Frontend to Vercel**
- Go to [Vercel.com](https://vercel.com/) → Import your repo
- Root Directory: `client`
- **Environment Variable:**
  - `NEXT_PUBLIC_API_URL` = your Render backend URL
- Deploy and copy your frontend URL

### 4. **Test Live Links**
- Visit your frontend URL and test all features (login, signup, dashboard, admin, profile, real-time)

### 5. **Update README with Live Links**
- Add your deployed URLs here:
  - **Frontend:** [your-frontend-url]
  - **Backend:** [your-backend-url]

---

## 📝 Sample Data Structure
```js
const sampleTransactions = [
  {
    id: '1',
    description: 'Received Ksh 50000 salary payment',
    amount: 50000,
    category: 'Salary',
    vendor: 'Employer',
    type: 'income',
    timestamp: '2025-07-21T21:00:00.000Z',
  },
  // ...more Kenyan-context transactions
];
```

---

## 🛡️ Security & Best Practices
- All secrets in `.env` files (never commit to git)
- JWT-based auth, bcrypt password hashing
- CORS configured for production
- Admin-only routes protected
- MongoDB Atlas for production data

---

## 💡 Want to Contribute?
- Fork, branch, and submit a PR!
- See `/client/index.css` for design system
- See `/server/routes` for API endpoints

---

## 👏 Credits
- Built by CodieMisiani & contributors
- UI/UX inspired by the best Kenyan fintech apps
- AI categorization rules by Windsurf AI

---

## 🧩 Backend Controllers

### Transaction Controller (`/server/controllers/transactionController.js`)

Handles business logic for transaction API endpoints:

- **createTransaction(req, res):**
  - Creates a new transaction using request data.
  - Automatically categorizes the transaction using the categorizer utility.
  - Saves to MongoDB and returns the created transaction.

- **getTransactions(req, res):**
  - Retrieves all transactions from MongoDB, sorted by date (newest first).
  - Returns an array of transactions.

These controllers are used by the `/api/transactions` route to process API requests.

---

## 🚦 Backend Routes

### `/api/transactions` (Express Router)

- **GET `/api/transactions`**
  - Returns all transactions as an array (sorted by date, newest first).
  - Response: `[ { amount, date, description, vendor, category, createdAt, ... }, ... ]`

- **POST `/api/transactions`**
  - Creates a new transaction. Expects JSON body:
    ```json
    {
      "amount": Number,
      "date": "YYYY-MM-DD",
      "description": "string",
      "vendor": "string" // optional
    }
    ```
  - Response: The created transaction object with auto-categorized `category` field.

- **PUT `/api/transactions/:id`**
  - Updates an existing transaction by ID. Expects JSON body (fields to update):
    ```json
    {
      "amount": Number,
      "date": "YYYY-MM-DD",
      "description": "string",
      "vendor": "string"
    }
    ```
  - Response: The updated transaction object. Emits a real-time `transaction:updated` event.

- **DELETE `/api/transactions/:id`**
  - Deletes a transaction by ID.
  - Response: `{ success: true, deleted: <transaction object> }`. Emits a real-time `transaction:deleted` event.

---

## 🛡️ Transaction Validation

All POST and PUT requests to `/api/transactions` are validated using Joi. If validation fails, the API responds with `400 Bad Request` and a helpful error message.

**Validation Rules:**
- `amount`: number, required, must be >= 0
- `date`: string, required, ISO date format (e.g. `2025-07-21`)
- `description`: string, required, at least 1 character
- `vendor`: string, optional

**Example Error Response:**
  - Emitted when a new transaction is created via the API.
  - Payload: The created transaction object

- **`transaction:updated`**
  - Emitted when a transaction is updated via the API.
  - Payload: The updated transaction object

- **`transaction:deleted`**
  - Emitted when a transaction is deleted via the API.
  - Payload: The deleted transaction object

#### Example Usage (JavaScript)
```js
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");

socket.on("transaction:new", (tx) => {
  // Handle new transaction
});
socket.on("transaction:updated", (tx) => {
  // Handle updated transaction
});
socket.on("transaction:deleted", (tx) => {
  // Handle deleted transaction
});
```

---

## 🔄 Real-Time API (Socket.IO)

The backend emits real-time events using Socket.IO. Connect your frontend to receive updates instantly when new transactions are created.

### Events

- **`transaction:new`**
  - Emitted when a new transaction is created via the API.
  - Payload: The created transaction object

#### Example Payload
```json
{
  "_id": "...",
  "amount": 100,
  "date": "2025-07-21T19:00:00.000Z",
  "description": "Lunch at Cafe",
  "vendor": "Cafe",
  "category": "Dining",
  "createdAt": "2025-07-21T19:01:00.000Z"
}
```

#### Example Usage (JavaScript)
```js
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");

socket.on("transaction:new", (transaction) => {
  console.log("New transaction received:", transaction);
  // Update your UI here
});
```

---
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
