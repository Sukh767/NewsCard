# 📰 MERN Blogging Application - Enhanced README

A full-stack **Blogging Platform** built using **MERN Stack** with **Tailwind CSS**, **Context API**, **Custom Hooks**, and an **Admin Dashboard**.  
Users can register, login, write blog posts, upload images, and manage content. Admins have full control via the dashboard.

---

## 🌟 Live Demo

🚀 **Experience the application live:** [NewsCard Live Demo](https://newscard-mylv.onrender.com)

🔗 **Backend API:** [https://newscard-backend-xwhi.onrender.com](https://newscard-backend-xwhi.onrender.com)

---

## ⚡ Tech Stack

### Frontend
- **React.js** - Component-based UI library
- **React Router** - Navigation and routing
- **Context API** - State management
- **Custom Hooks** - Reusable logic
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage and manipulation
- **CORS** - Cross-origin resource sharing

### Deployment
- **Render** - Frontend and backend hosting
- **MongoDB Atlas** - Cloud database
- **Cloudinary** - Cloud image management

---

## 📂 Project Structure

```
NewsCard/
|   |                      # React frontend application
│   ├── public/            # Static assets
│   ├── src/               # Source code
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions and API config
│   │   └── styles/        # CSS and Tailwind files
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind configuration
├── server/                # Express backend application
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── config/           # Database and cloud configuration
│   ├── utils/            # Utility functions
│   ├── package.json      # Backend dependencies
│   └── server.js         # Server entry point
├── .env                  # Environment variables (not in repo)
├── .gitignore           # Git ignore rules
├── package.json         # Root package.json
├── README.md           # Project documentation
└── screenshots/         # Application screenshots
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Cloudinary account for image storage
- Git

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Sukh767/NewsCard.git
cd NewsCard
```

### 2️⃣ Install Dependencies

**Install root dependencies (if any):**
```bash
npm install
```

**Install frontend dependencies:**
```bash
cd .NewsCard
npm install
```

**Install backend dependencies:**
```bash
cd server
npm install
```

### 3️⃣ Environment Configuration

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.lfb4sjk.mongodb.net/newsdb?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# CORS
CLIENT_URL=http://localhost:3000
```

### 4️⃣ Run the Application

**Start the backend server:**
```bash
cd server
npm run dev
```
Server will run on http://localhost:5000

**Start the frontend development server:**
```bash
npm run dev
```
Client will run on http://localhost:5173

---

## 👨‍💻 Demo Credentials

### Admin Account
```
Email: admin@hotmail.com
Password: Admin123@
```

### Regular User
```
Email: Tony@gmail.com
Password: Tony123@
```

---

## 📸 Key Features

### 🔐 Authentication System
- User registration and login
- JWT-based authentication
- Protected routes
- Password hashing with bcrypt
- Persistent sessions

### ✍️ Content Management
- Create, read, update, and delete blog posts
- Rich text editing capabilities
- Image uploads with Cloudinary
- Category-based organization
- Search functionality

### 🎨 User Interface
- Responsive design with TailwindCSS
- Dark/light mode toggle
- Modern card-based layout
- Loading states and animations
- Interactive user experience

### 📊 Admin Dashboard
- User management
- Content moderation
- Analytics and statistics
- System configuration
- Bulk operations

### 🔧 Technical Features
- RESTful API design
- Error handling and validation
- Image optimization
- Pagination and filtering
- Environment-based configuration

---

## 🗂️ API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Articles
- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get single article
- `POST /api/articles` - Create article (protected)
- `PUT /api/articles/:id` - Update article (protected)
- `DELETE /api/articles/:id` - Delete article (protected)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile (protected)
- `DELETE /api/users/:id` - Delete user (admin only)

---

## 📌 Deployment Guide

### Frontend Deployment (Render)
1. Connect your GitHub repository to Render
2. Set build command: `cd client && npm install && npm run build`
3. Set publish directory: `client/build`
4. Add environment variables for production

### Backend Deployment (Render)
1. Create a Web Service on Render
2. Set build command: `cd server && npm install`
3. Set start command: `cd server && npm start`
4. Configure environment variables

### Database Setup (MongoDB Atlas)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get connection string
4. Whitelist IP addresses (0.0.0.0/0 for all access)

### Cloudinary Setup
1. Create a Cloudinary account
2. Get API keys from dashboard
3. Configure upload presets

---

## 🛠️ Troubleshooting

### Common Issues

1. **Environment variables not loading**
   - Ensure `.env` file is in the correct directory
   - Restart the server after adding new variables

2. **MongoDB connection issues**
   - Check your connection string
   - Verify IP whitelisting in MongoDB Atlas

3. **CORS errors**
   - Ensure client URL is correctly set in CORS configuration

4. **Image upload failures**
   - Verify Cloudinary credentials
   - Check file size limits

### Development Tips

- Use React Developer Tools for debugging
- Check browser console for client-side errors
- Monitor server logs for backend issues
- Use Postman to test API endpoints

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

If you have any questions or need help:

1. **Check the documentation** - This README and code comments
2. **Search existing issues** - Someone might have already asked your question
3. **Create a new issue** - For bugs and feature requests
4. **Contact the team** - Email us at support@newscard.com

### Useful Links
- [React Documentation](https://reactjs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

---

## 🙏 Acknowledgments

- Thanks to all contributors who have helped with this project
- Inspired by modern blogging platforms and CMS systems
- Built with amazing open source technologies

---

<div align="center">

**Happy Coding!** 🚀

</div>
