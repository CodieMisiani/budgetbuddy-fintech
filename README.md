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
🛡️ Transaction Validation
All POST and PUT requests to /api/transactions are validated using Joi. If validation fails, the API responds with 400 Bad Request and a helpful error message.

Validation Rules:

amount: number, required, must be >= 0
date
: string, required, ISO date format (e.g. 2025-07-21)
description: string, required, at least 1 character
vendor: string, optional
Example Error Response:

json
{
  "error": "\"amount\" is required"
}
## 🔄 Real-Time API (Socket.IO)

The backend emits real-time events using Socket.IO. Connect your frontend to receive updates instantly when transactions are created, updated, or deleted.

### Events

- **`transaction:new`**
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
