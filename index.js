const express = require("express");
const bodyParser = require("body-parser");
const { connectToDatabase, syncDatabase } = require("./dbConfig");
const userControllers = require("./controllers/userControllers");

// const { User } = require("./models/user");

const app = express();
const port = 4000;

// Body-Parser - to get data in some specific format
app.use(bodyParser.json());

// Database connection
connectToDatabase()
  // After connecting sync the models with the database
  .then(syncDatabase)
  .then(() => {
    // Home route
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    /* Using function and static data */

    // Add User route (Using build() and save())
    app.get("/add", userControllers.addUser);
    // Create User route  (Using create())
    app.get("/create", userControllers.createUser);
    // Update User route (Using create()/update() and save())
    app.get("/update", userControllers.updateUser);

    /* Using API's in controllers */

    // Get All Users route (Using findAll())
    app.get("/users", userControllers.getUsers);
    // Get a single user by Id (Using findOne())
    app.get("/users/:id", userControllers.getUserByID);
    // Add User using API
    app.post("/users", userControllers.postUser);
    // Delete all users (Using trucate: true)
    app.delete("/users/delete", userControllers.deleteAllUsers);
    // Delete a single user
    app.delete("/users/:id/delete", userControllers.deleteUser);
    // Update user by using update()
    app.patch("/users/:id/update", userControllers.updateUserByID);

    /* Model querying */

    // Insert in database
    app.get("/query/insert", userControllers.queryUserInsert);
    // Select from database
    app.get("/query/select", userControllers.queryUserSelect);

    /* Finders */
    app.get("/finders", userControllers.finderUser);

    /* Getter, setter and Virtual */
    app.get("/gsvUser", userControllers.getSetVirtualUser);

    /* Validate and Constraints */
    app.get("/validate", userControllers.validateUser);

    /* Raw Queries */
    app.get("/raw-query", userControllers.rawQueries);

    /* Association one-to-one */
    app.get("/one-to-one", userControllers.oneTooneUser);

    /* Association one-to-many */
    app.get("/one-to-many", userControllers.oneToManyUser);

    /* Association many-to-many */
    app.get("/many-to-many", userControllers.manyTomanyUser);


    // To sync individual models, Eg: User
    // await User.sync(); - Method 1
    // await User.sync({ force: true }); - Method 2
    // await User.sync({ alter: true })  - Method 3

    // To Drop a table
    // await User.drop();
    // console.log("User table dropped");

    // Listen to server
    app.listen(port, () => {
      console.log(`Server running on port : ${port}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
