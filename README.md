# 🚀 CampusCore

CampusCore is a LAN-based, automated grading platform for first-year CS students. It features a custom-built Go-based C micro-compiler for millisecond execution and beginner-friendly feedback.

## 🌟 Key Features
- **Custom C Compiler**: Lexer + Parser + Evaluator built in Go.
- **X-Ray Mode**: Live visualization of Token Streams and ASTs.
- **Auto-Grading**: Instant scores with hidden/visible test cases.
- **Zero Overhead**: No Docker/Container startup latency for student code.

## 🛠️ Tech Stack
- **Backend**: Go, Fiber, GORM, PostgreSQL.
- **Frontend**: Next.js 14, TailwindCSS, Monaco Editor.
- **Infrastructure**: Docker for local DB development.

## 🚀 Getting Started

### 1. Start the Database
```bash
docker-compose up -d
```

### 2. Start the Backend
```bash
cd backend
go run cmd/server/main.go
```
*The database will automatically migrate and seed with demo problems.*

### 3. Start the Frontend
```bash
cd frontend
npm run dev
```

## 🧪 Testing the Compiler
Open `http://localhost:3001` and try solving the "Hello World" or "Factorial" problems!
Toggle **X-RAY MODE** to see how the compiler parses your code.
