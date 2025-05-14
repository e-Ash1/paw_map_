// server/config/database.js - Database Initialization for Development
const { Sequelize } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
  });
  
  const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Connected to PostgreSQL successfully!");

        // Load models
        const User = require("../models/User");
        const Query = require("../models/Query");

        // Sync database
        if (process.env.NODE_ENV === "development") {
            console.log("🛠 Running database sync in development mode...");
            await sequelize.sync({ force: true }); // Reset tables in development
        } else {
            await sequelize.sync(); // Ensure tables exist
        }

        console.log("✅ Database synchronized.");

        // // ✅ Insert Users
        // const users = await User.bulkCreate([
        //     { id: uuidv4(), userId: "dev-user-1" },
        //     { id: uuidv4(), userId: "dev-user-2" },
        //     { id: uuidv4(), userId: "dev-user-3" },
        // ]);

        // // ✅ Insert Queries & Reference Correct User IDs
        // await Query.bulkCreate([
        //     { id: uuidv4(), userId: users[0].id, search: "Find nearest vet", searchType: "veterinary_care" },
        //     { id: uuidv4(), userId: users[1].id, search: "Locate pet supply store", searchType: "pet_store" },
        //     { id: uuidv4(), userId: users[2].id, search: "Dog-friendly parks nearby", searchType: "dog_park" },
        // ]);

        // console.log("✅ Sample data inserted.");
    } catch (error) {
        console.error("❌ Database initialization error:", error);
    }
};

  
  
  // ✅ Ensure DB initializes before export
  initializeDatabase();
  
  module.exports = sequelize;
  
  // Explanation:
  // 1. **Connects to PostgreSQL for development.**
  // 2. **Syncs database with `force: true` (resets tables on restart).**
  // 3. **Populates `users` and `queries` tables with sample data