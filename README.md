# ShaadiSync 💍

**ShaadiSync** is a full-stack wedding planning platform built with the **MERN stack**. It connects users with verified artists (like photographers, decorators, etc.) and streamlines the wedding planning journey with secure payments, wallet systems, and reviews — all wrapped in a modern responsive UI.

---

## ✨ Features

- 🎨 Artist sign-up with verification and profile creation
- 🔐 User authentication and protected routes
- 📸 Image uploads via **Cloudinary**
- 💰 In-app wallet & **Stripe** payment integration
- 💬 Unlock artist contact details using **SyncCoins**
- 📝 Rating & review system for verified artists
- 📅 Shortlist & manage preferred vendors
- 📱 Fully responsive UI using React & Tailwind CSS
- 🧑‍💼 Admin dashboard for managing users, artists, and transactions

---

## ⚙️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT
- **Image Uploads**: Cloudinary
- **Payments**: Stripe


---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/theinfiniteprins/shaadiSync.git
cd shaadiSync
```

---

### 2. Setup Environment Variables

#### 🔐 Root `.env`

```env
STRIPE_SECRET_KEY=your_stripe_secret_key
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongo_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### 🌐 Client (`client/.env`)

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

> Replace `your_*` with actual values from your accounts (MongoDB, Cloudinary, Stripe)

---

### 3. Install dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

---

### 4. Run the App

#### Start Backend
```bash
cd ../backend
npm run dev
```

#### Start Frontend in new terminal
```bash
cd frontend
npm run dev
```

> 💻 App runs at [http://localhost:5173](http://localhost:5173)

---

## 📸 Screenshots

<!-- Add your screenshots in client/public/screenshots or update links -->
![image]()
![image]()
![image]()
![image]()

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Developers

- [@theinfiniteprins](https://github.com/theinfiniteprins)
- [@karangurjar16](https://github.com/karangurjar16)
- [Jaimin-07](https://github.com/Jaimin-07)

---

## 🙌 Contributions

We welcome contributions!  
Fork the repo, create a new branch, and submit a pull request 🚀
