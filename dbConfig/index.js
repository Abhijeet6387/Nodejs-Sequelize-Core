const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.Database,
  "root",
  process.env.Password,
  {
    host: "localhost",
    logging: false, // log all queries in console set to false
    dialect: "mysql",
  }
);

// Initialize an object to store Sequelize instances and models
const myDBInstance = {};

// Add Sequelize and sequelize instances to the object
myDBInstance.Sequelize = Sequelize;
myDBInstance.sequelize = sequelize;

// Define and add models to the object
myDBInstance.user = require("../models/user")(sequelize, DataTypes);
myDBInstance.contact = require("../models/contact")(sequelize, DataTypes);
myDBInstance.userContacts = require("../models/userContacts")(
  sequelize,
  DataTypes,
  myDBInstance.user,
  myDBInstance.contact
);

/* Association one-to one

myDBInstance.user.hasOne(myDBInstance.contact, {
  foreignKey: "user_id",
});
myDBInstance.contact.belongsTo(myDBInstance.user, {
  foreignKey: "user_id",
});
*/

/* Association one-to-many 

myDBInstance.user.hasMany(myDBInstance.contact, {
  foreignKey: "user_id",
});
myDBInstance.contact.belongsTo(myDBInstance.user, {
  foreignKey: "user_id",
});
*/

/* Association many-to-many */

// It creates a "user_contacts" table if it not exists to keep a track of association
// A separate Model can also be passed to keep track of associations
myDBInstance.user.belongsToMany(myDBInstance.contact, {
  through:
    // "user_contacts",
    myDBInstance.userContacts,
});
myDBInstance.contact.belongsToMany(myDBInstance.user, {
  through:
    // "user_contacts",
    myDBInstance.userContacts,
});

// Sync all models with the database
// Note: The force option is set to true to drop existing tables and re-create them
// This is useful for development, but not recommended for production

// Function to synchronize models with the database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false }); // Use with caution, consider migrations for production
    console.log("All models synchronized with the database");
  } catch (error) {
    console.error("Error synchronizing models:", error);
    throw error;
  }
};

// Function to connect to the database
const connectToDatabase = async () => {
  try {
    // Authenticate Sequelize instance to establish a connection to the database
    await sequelize.authenticate();
    console.log("Connected to database");
  } catch (error) {
    console.log("Unable to connect:", err);
    throw error;
  }
};

module.exports = { connectToDatabase, syncDatabase, myDBInstance };
