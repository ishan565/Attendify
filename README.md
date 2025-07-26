# 🎓 Attendify – Student Companion & Management Suite

A modern, AI-powered web app designed to help students **track attendance**, **prepare for exams**, and stay on top of academics with ease.
Built with a clean UI, interactive charts, and a chatbot assistant that makes tracking your college life painless.

🟢 Live Demo: [attendify-ishan.vercel.app](https://attendify-ishan.vercel.app)

---

## 🚀 Features

* ✅ **Smart Attendance Tracker**
  Add subjects, mark daily attendance, and monitor your stats in real time.

* 📊 **Visual Analytics Dashboard**
  Get subject-wise breakdowns and total attendance via pie charts, line graphs, and progress bars.

* 🤖 **AI Chatbot Assistant**
  Ask questions like:

  * “How many more classes can I skip?”
  * “What’s my lowest subject attendance?”
  * “Am I safe this week?”

* 🧪 **Quiz Maker for Exam Prep**
  Create, save, and attempt MCQ quizzes for upcoming exams.
  Helps test your understanding and revise quickly.

* 🔔 **Attendance Alerts**
  Receive automated warnings when attendance falls below threshold (e.g., 75%).

* 🔐 **Secure Authentication**
  Login/Signup protected with **JWT**, passwords hashed via **bcrypt**, and data stored in MongoDB.

* 💡 **Responsive UI**
  Built using **React.js + Tailwind CSS**, works across desktops, tablets, and phones.

---

## 💠 Tech Stack

| Layer    | Technology                       |
| -------- | -------------------------------- |
| Frontend | React.js, Tailwind CSS           |
| Backend  | Node.js, Express.js              |
| Database | MongoDB (Mongoose ODM)           |
| Auth     | JWT, bcrypt                      |
| Charts   | Chart.js / Recharts              |
| AI Bot   | OpenAI API                       |
| Quiz     | Custom MCQ builder + local state |

---

## 📁 Project Structure

```
attendify/
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── utils/
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── server.js
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/attendify.git
cd attendify
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
touch .env
```

`.env` example:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/attendify
JWT_SECRET=your_super_secret_key
OPENAI_API_KEY=your_openai_key
```

Start backend:

```bash
node server.js
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 💬 How It Works

1. User signs up and logs in securely
2. Adds subjects and marks attendance
3. Gets reminders & predictions from chatbot
4. Quizzes can be created for quick exam practice
5. Charts show attendance distribution + trends
6. All data is securely stored and easily accessible

---

## ✨ Future Improvements

* 🗓 Calendar-based attendance view
* 🧑‍🏫 Faculty-side dashboard
* 🔊 Voice assistant for reminders
* 📱 Full mobile PWA support

---

## 👨‍💻 Developed By

**Ishan** – Engineering Student (CSE)
💻 Hosted at: [attendify-ishan.vercel.app](https://attendify-ishan.vercel.app)

