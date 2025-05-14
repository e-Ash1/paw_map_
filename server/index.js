// server/index.js - Integrated Database & Server Initialization
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database"); // ✅ Import database connection
const placesRouter = require("./routes/placesRoutes");
const directionsRouter = require("./routes/directionsRoutes");
const queryRoutes = require("./routes/queryRoutes"); // ✅ Import query routes

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000", 
  methods: ["GET", "POST"],
  credentials: true  
}));
app.use(express.json());

// Function to start the server only after database connection
const startServer = async () => {
  try {
    await sequelize.authenticate(); // ✅ Ensure DB is connected before starting the server
    console.log("Database connected, starting server...");
    
    // Sync models with database (only for development mode)
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true }); // ✅ Keeps DB structure updated without deleting data
      console.log("Database synchronized.");
    }

    // Register Routes
    app.use("/api/places", placesRouter);
    app.use("/api/directions", directionsRouter);
    app.use("/api/queries", queryRoutes); 

    // Start Server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // ❌ Stop server if database fails
  }
};

// ✅ Call function to start the server only after DB is ready
startServer();

// Explanation:
// 1. **Ensures database is connected before Express initializes.**
// 2. **Syncs models dynamically without deleting existing data (`alter: true`).**
// 3. **Registers all routes (`places`, `directions`, `queries`).**
// 4. **Prevents server startup if database connection fails.**