const express = require("express");
const http = require("http");
const connectDB = require("./config/db");
const userRoutes = require("./routes/User.routes");
const artistRoutes = require("./routes/Artist.routes");
const artistTypeRoutes = require("./routes/AtristType.routes");
const serviceRoutes = require("./routes/Service.routes");
const artistTransactionRoutes = require("./routes/ArtistTransaction.routes");
const reviewRoutes = require("./routes/Review.routes");
const userTransactionHistoryRoutes = require("./routes/UserTransactionHistory.routes");
const userUnlockArtistRoutes = require("./routes/UserUnlockArtist.routes");
const authRoutes = require("./routes/Auth.routes");

const app = express();
const cors = require('cors');

// Middleware for CORS
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middleware for JSON parsing
app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  res.send('Working');
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/artist-types", artistTypeRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/artist-transactions", artistTransactionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/user-transaction-history", userTransactionHistoryRoutes);
app.use("/api/user-unlock-artist", userUnlockArtistRoutes);
app.use("/api/auth", authRoutes);

// Connect to the database
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
