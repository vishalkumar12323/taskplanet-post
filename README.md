# TaskPlanet Mini Social Post Application

A full-stack social media application built for the 3W Full Stack Internship Assignment. Users can create accounts, post text or images, view posts from others, like, and comment on posts.

## Features

- ✅ User authentication (Signup & Login)
- ✅ Create posts with text, image, or both
- ✅ Public feed displaying all posts
- ✅ Like and comment functionality
- ✅ Real-time engagement metrics (likes & comments count)
- ✅ Responsive UI inspired by TaskPlanet design

## Tech Stack

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT authentication
- Multer for image uploads
- bcryptjs for password hashing

### Frontend
- React.js with Vite
- Material UI (MUI)
- React Router
- Axios for API calls

## Project Structure

```
taskplanet-post/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Post.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── posts.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   └── server.js
│   ├── uploads/
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CreatePost.jsx
│   │   │   ├── PostCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Feed.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/taskplanet-post?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key
CLIENT_ORIGIN=http://localhost:5173
```

5. Create the uploads directory (if it doesn't exist):
```bash
mkdir uploads
```

6. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:4000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new account
- `POST /api/auth/login` - Login to existing account
- `GET /api/auth/me` - Get current user (protected)

### Posts
- `GET /api/posts?page=1&limit=10` - Get paginated feed
- `POST /api/posts` - Create a new post (protected, multipart/form-data)
- `POST /api/posts/:id/like` - Toggle like on a post (protected)
- `POST /api/posts/:id/comments` - Add a comment to a post (protected)

## Database Schema

### Users Collection
```javascript
{
  name: String (required),
  email: String (required, unique),
  passwordHash: String (required),
  avatarUrl: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Posts Collection
```javascript
{
  author: ObjectId (ref: User, required),
  text: String (optional),
  imageUrl: String (optional),
  likes: [ObjectId] (ref: User),
  comments: [{
    author: ObjectId (ref: User),
    text: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Deployment

### Backend (Render)
1. Push your code to GitHub
2. Connect your repository to Render
3. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_ORIGIN` (your frontend URL)
4. Set build command: `npm install`
5. Set start command: `npm start`

### Frontend (Vercel/Netlify)
1. Push your code to GitHub
2. Connect your repository to Vercel/Netlify
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Update backend `CLIENT_ORIGIN` to your frontend URL

### Database (MongoDB Atlas)
1. Create a free cluster on MongoDB Atlas
2. Create a database user
3. Whitelist your IP address (or 0.0.0.0/0 for Render)
4. Get your connection string and add it to backend `.env`

## Notes

- Image uploads are stored in `backend/uploads/` directory
- Make sure to update the image URL in `PostCard.jsx` if your backend URL differs
- The app uses JWT tokens stored in localStorage for authentication
- Posts require either text or image (or both), but at least one is required

## License

This project is created for the 3W Full Stack Internship Assignment.
