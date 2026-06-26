# LuminosBook — Photography Studio Portfolio & Booking Website

A full-stack web application for **Luminos Studio** — featuring a premium photography portfolio, online booking system, and a secure admin dashboard.

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- (Optional) Cloudinary account for image uploads

### 1. Install Dependencies
**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 2. Configure Environment Variables
**Backend (`server/.env`):**
Copy `server/.env.example` to `server/.env` and update the values:
```env
PORT=5002
MONGODB_URI=mongodb://127.0.0.1:27017/luminosbook
JWT_SECRET=your_secret_here
ADMIN_EMAIL=admin@luminosstudio.com
ADMIN_PASSWORD=Admin@123
CLIENT_URL=http://localhost:5173
```

**Frontend (`client/.env`):**
Copy `client/.env.example` to `client/.env` and update the value:
```env
VITE_API_URL=http://localhost:5002/api
```

### 3. Seed the database (first time only)
```bash
cd server
npm run seed
```
To reset the database entirely:
```bash
npm run seed:reset
```

### 4. Start Local Development Servers
**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm run dev
```

---

## 🌍 Production Deployment

### 1. MongoDB Atlas Setup
1. Create a free cluster on MongoDB Atlas.
2. Under "Network Access", allow IP access from anywhere (`0.0.0.0/0`).
3. Under "Database Access", create a database user and password.
4. Copy your connection string (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/luminosbook`).

### 2. Cloudinary Setup (Image Hosting)
1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. Get your `Cloud Name`, `API Key`, and `API Secret` from the Dashboard.

### 3. Backend Deployment (Render)
1. Create a new Web Service on Render and connect your GitHub repository.
2. **Root Directory**: `server`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. **Environment Variables**:
   - `PORT`: `5002` (or let Render assign)
   - `MONGODB_URI`: Your Atlas connection string
   - `JWT_SECRET`: A strong random string
   - `ADMIN_EMAIL`: `admin@luminosstudio.com`
   - `ADMIN_PASSWORD`: `Admin@123`
   - `CLIENT_URL`: `https://your-frontend-url.netlify.app` (Add later once frontend is deployed)
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary Cloud Name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API Key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API Secret

### 4. Frontend Deployment (Netlify/Vercel)
1. Create a new site on Netlify or Vercel and connect your repository.
2. **Base Directory**: `client`
3. **Build Command**: `npm run build`
4. **Publish Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_URL`: `https://your-backend-url.onrender.com/api`

### 5. Post-Deployment Testing Checklist
- ✅ Go to your deployed frontend URL.
- ✅ Check if Portfolio images load.
- ✅ Verify you can add a service to cart and complete a booking.
- ✅ Go to `/admin/login` and log in with your production Admin credentials.
- ✅ Upload a new portfolio image and ensure it persists (Cloudinary).

### 6. Troubleshooting
- **CORS Errors**: Ensure your `CLIENT_URL` in the backend exactly matches your frontend domain (without a trailing slash). If using multiple frontend domains, separate them by commas.
- **Image Upload Fails**: Verify your Cloudinary credentials are correct. If using local uploads without Cloudinary on a platform like Render, images will be lost on restart. Cloudinary is required for persistent production image storage.
- **MongoDB Errors**: Ensure your Atlas cluster's Network Access allows IP `0.0.0.0/0`.

---

## 🛠️ Admin Credentials
The default credentials created via the seed script are:
- **Email**: `admin@luminosstudio.com`
- **Password**: `Admin@123`
