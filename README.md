# 📰 MERN Blogging Application

A full-stack **Blogging Platform** built using **MERN Stack** with **Tailwind CSS**, **Context API**, **Custom Hooks**, and an **Admin Dashboard**.  
Users can register, login, write blog posts, upload images, and manage content. Admins have full control via the dashboard.

---

## ⚡ Tech Stack

- **Frontend**: React, Context API, Custom Hooks, TailwindCSS
- **Backend**: Node.js, Express.js, MongoDB, JWT Authentication
- **Image Uploads**: Cloudinary
- **Database**: MongoDB Atlas
- **State Management**: React Context + Custom Hooks

---

## 📂 Project Structure

```
NewsCard/                  # React frontend
├── server/                # Express backend
├── .env                   # Environment variables
├── package.json           # Root config
└── screenshots/           # Application screenshots
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Sukh767/NewsCard.git
cd NewsCard
```

### 2️⃣ Install Dependencies

At the **root folder**:

```bash
npm install
```

Install dependencies for the **backend**:

```bash
cd server
npm install
```

Install dependencies for the **frontend**:

```bash
cd ../client
npm install
```

---

### 3️⃣ Setup Environment Variables

Create a `.env` file inside the **server/** folder and add the following keys:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.lfb4sjk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_jwt_secret_here

# Cloudinary Configuration
CLOUDINARY_URL=cloudinary://<API_KEY>:<API_SECRET>@<CLOUD_NAME>
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

### 4️⃣ Run the Application

Start the **backend**:

```bash
cd server
npm run dev
```

Start the **frontend**:

```bash
cd client
npm start
```

---

## 👨‍💻 Demo Credentials

You can log in as an **Admin** using the following credentials:

```
Email: admin@gmail.com
Password: Admin123@
```

---

## 📸 Features

- 🔐 JWT Authentication (Login, Register, Logout)
- ✍️ Create, Update, Delete Blogs
- 📷 Image Uploads via Cloudinary
- 📊 Admin Dashboard for Managing Users & Posts
- 🎨 Styled with TailwindCSS
- ⚡ Global State Management using Context API & Custom Hooks

---

## 📌 Git Commands

Clone project:

```bash
git clone https://github.com/Sukh767/NewsCard.git
```

Create a new branch:

```bash
git checkout -b feature-branch
```

Commit changes:

```bash
git add .
git commit -m "Added new feature"
```

Push branch:

```bash
git push origin feature-branch
```

---

## 📜 License

This project is for **learning purposes** and free to use.

---

## 📸 Screenshots

### 🔑 Authentication Pages

![Login Page](screenshots/login.png)
![Register Page](screenshots/register.png)

### 📰 Blog Pages

![Homepage](screenshots/homepage.png)
![Single Blog](screenshots/blog.png)

### 📊 Admin Dashboard

![Admin Dashboard](screenshots/dashboard.png)

---

## 🛠️ Troubleshooting

If you encounter issues with image previews in the README:

1. Ensure all images are placed in the `screenshots/` folder
2. Use relative paths like `screenshots/filename.png`
3. Make sure image files are committed to GitHub
4. For GitHub README rendering, use absolute paths to raw GitHub content

Example for GitHub:
```
![Login Page](https://raw.githubusercontent.com/Sukh767/NewsCard/main/screenshots/login.png)
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

If you have any questions or issues, please open an issue on GitHub or contact the development team.
