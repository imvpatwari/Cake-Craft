🍰 CakeCraft – Full Stack Cake Ordering Platform

CakeCraft is a full-stack web application for managing cake listings, baker dashboards, and customer wishlist features. It includes secure login and role-based authorization using JWT.

🚀 Live Features
👤 Authentication
User Login
Register
Authentication using JWT
Secure password hashing (ASP.NET Identity)
Role based access (Baker / Customer)

🎂 Baker Dashboard
Bakers can:
Add new cakes
Edit cakes
Delete cakes
Manage inventory

🛍 Customer Dashboard
Customers can:
View all cakes
Add items to wishlist
Remove items
Clear wishlist

🧠 Tech Stack
🔹 Frontend
React J
Vite
Axios
React Router
CSS

🔹 Backend
ASP.NET Core Web API
Entity Framework Core
ASP.NET Identity
JWT Authentication
SQLite Database

📦 Database (SQLite)

Database file is generated automatically as:
dotnetapp/app.db

Tables created:
AspNetUsers
Users
Cakes
Wishlist
ErrorLogs

No external server required 👍

🔐 Security
JWT authentication
Password hashing
Role-based authorization
Authentication middleware
Secure token storage

🧾 API Documentation
Swagger available at:
http://localhost:8080/swagger

🛠 How to Run the Project
🔹 Backend
cd dotnetapp
dotnet restore
dotnet run


Backend runs on:
http://localhost:8080

🔹 Frontend
cd reactapp
npm install
npm run dev


Frontend runs on:
http://localhost:5173

📘 How it Works

Users register with role (Customer/Baker)
Identity stores password using hashing
On login → generates JWT
Frontend stores JWT and passes it in headers
Role-based access controls API endpoints

📁 Folder Structure
cakecraft_fullstack
│
├── reactapp/
│   └── src/
│
└── dotnetapp/
    ├── Controllers
    ├── Models
    ├── Services
    ├── Data
    └── app.db

✨ What Makes This Project Interesting

Full-stack application
JWT + Identity integration
Completely role-based system
Clean ASP.NET architecture
SQLite for smooth local development
React + .NET communication

🤝 Future Enhancements

Payment integration
Order history
Admin panel
Email verification
Images upload to cloud storage

👨‍💻 Author

Venkatesh Patwari
GitHub: https://github.com/imvpatwari
LinkedIn: https://www.linkedin.com/in/venkatesh-patwari-1b94b62a5/
