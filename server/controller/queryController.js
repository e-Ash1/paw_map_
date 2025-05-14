const Query = require("../models/Query");
const User = require("../models/User");

const queryController = {
  async saveQuery(req, res) {
    try {
      const { userId, searchType, searchURL, location } = req.body;

      if (!userId || !searchType || !searchURL || !location) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      let user = await User.findByPk(userId);
      if (!user) {
        console.warn("⚠️ User not found, creating new user:", userId);
        user = await User.create({ id: userId });
      }

      const query = await Query.create({
        userId,
        searchType,
        searchURL,
        location,
      });

      return res.status(201).json(query);
    } catch (err) {
      console.error("❌ Error saving query:", err);
      res.status(500).json({ error: "Internal server error." });
    }
  },

  async getRecentQueries(req, res) {
    try {
      const { userId } = req.query;
  
      if (!userId) {
        return res.status(400).json({ error: "Missing user ID." });
      };
  
      const allQueries = await Query.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
      });
  
      // Deduplicate by (searchType + from + to)
      const uniqueMap = new Map();
      for (const query of allQueries) {
        const from = query.location?.string?.from || "Unknown";
        const to = query.location?.string?.to || "Unknown";
        const key = `${query.searchType}|${from}|${to}`;
  
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, query);
        }
      };
  
      const deduplicated = Array.from(uniqueMap.values()).slice(0, 5); 
  
      return res.json(deduplicated);
    } catch (err) {
        console.error("❌ Error fetching recent queries:", err);
      res.status(500).json({ error: "Failed to fetch recent queries" });
    };
  },

  async deleteSearchById(req, res) {
    try {
      const { id } = req.params;

      const deleted = await Query.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).json({ error: "Query not found." });
      }

      return res.status(204).send();
    } catch (err) {
      console.error("❌ Error deleting query:", err);
      res.status(500).json({ error: "Internal server error." });
    }
  }
};

module.exports = queryController;
