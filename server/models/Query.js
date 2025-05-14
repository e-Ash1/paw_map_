const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Query = sequelize.define("Query", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  
  searchType: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  searchURL: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  location: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {
      origin: { lat: null, lng: null },
      destination: { lat: null, lng: null }
    }
  },

}, {
  tableName: "queries",
});

User.hasMany(Query, { foreignKey: "userId", onDelete: "CASCADE" });
Query.belongsTo(User, { foreignKey: "userId" });

module.exports = Query;
