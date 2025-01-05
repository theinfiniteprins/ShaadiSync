const express = require("express");
const http = require("http");
const connectDB = require("./config/db");
const userRoutes = require("./routes/User.routes");
const artistRoutes = require("./routes/Artist.routes");
const artistTypeRoutes = require("./routes/AtristType.routes");

const app = express();
const cors = require('cors');
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(express.json());
app.get('/', (req, res) => {
  res.send('Working');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/api/users", userRoutes);
// app.use("/api/artists", artistRoutes);
// app.use("/api/artist-types", artistTypeRoutes);

connectDB();
