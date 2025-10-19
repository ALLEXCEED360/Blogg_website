# Blog Website - MERN Stack

A full-stack blog application built with MongoDB, Express.js, React, and Node.js. This platform allows users to create, read, update, and delete blog posts with user authentication and social features.

## Features

### User Management
- **User Registration & Login** - Secure authentication with JWT tokens
- **Password Reset** - Email-based password recovery system
- **User Profiles** - Personal profile pages for each user
- **Account Management** - Update user information and delete accounts

### Blog Posts
- **Create Posts** - Write and publish blog posts with titles, descriptions, and images
- **Edit Posts** - Modify your existing posts
- **Delete Posts** - Remove posts you've created
- **View Posts** - Browse all posts with detailed view pages
- **My Blogs** - View all posts created by a specific user
- **Search & Sort** - Search posts by title and sort by newest, oldest, or alphabetically
- **Image Upload** - Add images to your blog posts
- **Categories** - Organize posts with categories

### Social Features
- **Likes & Dislikes** - React to posts with likes or dislikes
- **Ratings** - Rate posts on a 5-star scale
- **Comments** - Add, edit, and delete comments on posts
- **View Counter** - Track post views automatically

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Nodemailer** - Email service for password reset
- **cookie-parser** - Parse cookies
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React** - UI library
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Vite** - Build tool

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Clone the repository
```bash
git clone <repository-url>
cd blog-website
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory
```env
MONGO_URL=your_mongodb_connection_string
PORT=5000
SECRET=your_jwt_secret_key
EMAIL=your_gmail_address
PASS=your_gmail_app_password
```

4. Start the backend server
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Install frontend dependencies
```bash
cd frontend
npm install
```

2. Start the development server
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/refetch` - Refetch user data

### Users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/forgotPassword` - Send password reset email
- `POST /api/users/resetPassword/:id/:token` - Reset password

### Posts
- `GET /api/posts` - Get all posts (with search and sort)
- `GET /api/posts/:id` - Get post by ID (increments views)
- `GET /api/posts/user/:userId` - Get posts by user
- `POST /api/posts/create` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `PUT /api/posts/:id/like` - Like a post
- `PUT /api/posts/:id/dislike` - Dislike a post
- `POST /api/posts/:id/rate` - Rate a post

### Comments
- `GET /api/comments/post/:postId` - Get comments for a post
- `POST /api/comments/create` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### File Upload
- `POST /api/upload` - Upload image

## Database Models

### User Schema
- username (String, required, unique)
- email (String, required, unique)
- password (String, required, hashed)
- timestamps

### Post Schema
- title (String, required, unique)
- desc (String, required, unique)
- photo (String, optional)
- username (String, required)
- userId (String, required)
- categories (Array)
- likes (Number, default: 0)
- dislikes (Number, default: 0)
- likedBy (Array of User IDs)
- dislikedBy (Array of User IDs)
- views (Number, default: 0)
- ratings (Array of objects with userId and rating)
- averageRating (Number, default: 0)
- timestamps

### Comment Schema
- comment (String, required)
- author (String, required)
- postId (String, required)
- userId (String, required)
- timestamps

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Tokens are stored in HTTP-only cookies
- Token expiration: 3 days
- Protected routes require valid token via `verifyToken` middleware

## Features in Detail

### Password Reset Flow
1. User requests password reset via email
2. System generates JWT token valid for 1 day
3. Email sent with reset link
4. User clicks link and enters new password
5. Password is hashed and updated in database

### Like/Dislike System
- Users can like or dislike posts
- Liking removes dislike if present (and vice versa)
- Tracks which users liked/disliked each post
- Prevents duplicate likes/dislikes

### Rating System
- Users can rate posts 1-5 stars
- Each user can rate a post only once
- System calculates and stores average rating
- Average updates automatically when new ratings added
