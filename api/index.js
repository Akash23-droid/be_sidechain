const express = require("express");
const cors = require("cors");
const resumeRoutes = require("../routes/resumeRoutes");

const app = express();

// Enable CORS for all routes
// app.use(cors());

// // cors origin setup
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });

// Enable CORS for all routes with a wildcard, or define specific origins for production
const corsOptions = {
  origin: "*", // In production, it's better to whitelist specific domains for security
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Use resume routes
app.use("/", resumeRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Resume Parser API" });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the server only if not in a serverless environment
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
