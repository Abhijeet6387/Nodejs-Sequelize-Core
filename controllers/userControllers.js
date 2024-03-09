const { response } = require("express");
const { myDBInstance } = require("../dbConfig");
// Model Instances
const User = myDBInstance.user;
const Contact = myDBInstance.contact;
// Sequelize Instance
const sequelize = myDBInstance.sequelize;
// Sequelize Library
const Sequelize = myDBInstance.Sequelize;
const { QueryTypes } = require("sequelize");

// const user = require("../models/user");

/* Functions to query database */
// Using build() and save() to save a user data in database
const addUser = async (request, response) => {
  const user = User.build({
    firstName: "Abhijeet",
    lastName: "Mishra",
    gender: "Male",
  });
  await user.save();
  console.log("User data saved in Database");
  response.status(200).json(user.toJSON());
};
// Using create() to save a user data in database
const createUser = async (request, response) => {
  const user = await User.create({
    firstName: "Riya",
    lastName: "Jain",
    gender: "FEMALE",
  });
  console.log("User data saved in Database");
  console.log(user.toJSON());
  response.status(200).json(user.toJSON());
};
// Update a user using create() and save()
const updateUser = async (request, response) => {
  const user = await User.create({
    firstName: "Riya",
    lastName: "Jain",
    gender: "FEMALE",
  });

  // updating the user instance, can use set()/update() method too
  // user.lastName = "Jayne"
  // user.isVerified = false;

  // user.set({ lastName: "Jayne", isVerified: false });
  await user.update({ lastName: "Jayne", isVerified: true });

  // need to save to see the changes in database
  await user.save();

  // can reload an instance
  // await user.reload();

  console.log("User data updated in Database");
  console.log(user.toJSON());
  response.status(200).json(user.toJSON());

  // deleting an instance
  // await user.destroy();
  // console.log("User Deleted..");
};

/* CRUD using APIs */
// Get all the users from the database
const getUsers = async (request, response) => {
  const userDetails = await User.findAll({});
  response.status(200).json({ data: userDetails });
};
// Get a single user by ID
const getUserByID = async (request, response) => {
  const userDetails = await User.findOne({
    where: {
      id: request.params.id,
    },
  });
  response.status(200).json({ data: userDetails });
};
// Add user to database using post
const postUser = async (request, response) => {
  const formData = request.body;
  // If we get an array of user data
  if (Array.isArray(formData) && formData.length > 1) {
    // We can use the bulkCreate() method
    const userData = await User.bulkCreate(formData);
    response.status(200).json(userData);
  } else {
    const userData = await User.create(formData);
    response.status(200).json(userData.toJSON());
  }
};
// Delete all uses using truncate: true
const deleteAllUsers = async (request, response) => {
  await User.destroy({ truncate: true });
  response.status(200).json({ data: "All users deleted" });
};
// Delete a single user by ID
const deleteUser = async (request, response) => {
  const userid = request.params.id;
  await User.destroy({
    where: {
      id: userid,
    },
  });
  response.status(200).json({ data: `User with id : ${userid} deleted` });
};
// Update user using API
const updateUserByID = async (request, response) => {
  const updatedData = request.body;
  const userID = request.params.id;
  await User.update(updatedData, {
    where: {
      id: userID,
    },
  });
  response.status(200).json({ message: "User data updated" });
};

/* Querying Database */
// Complex queries can be created, read more from documentation
// Insert in Database using create()
const queryUserInsert = async (request, response) => {
  const userData = await User.create(
    {
      firstName: "Amit",
      lastName: "Morgan",
      isVerified: false, // By default is true
    },
    {
      // Although we are setting isVerified to "false", it is "true" in the database
      fields: [
        "firstName",
        "lastName",
        // "isVerified"  if we send this, isVerfied will be false in database for the user
      ],
    }
  );
  response.status(200).json({ data: userData });
};
// Select * From... using findAll()
// Select firstName, lastName From ...
// Select id AS userID, firstName, , lastName, count(id) AS count From
const queryUserSelect = async (request, response) => {
  const userData = await User.findAll({
    // attributes: [["id", "userID"], "firstName", "lastName"] - attributes can be renamed, id -> userID
    /*
      attributes: { 
      exclude: ["id", "gender"], 
      include: ["firstName", "lastName"],},
    */
    // can use aggregate function using sequelize.fn()
    attributes: [
      "id",
      "firstName",
      "lastName",
      [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
    ],
    group: ["id", "firstName", "lastName"], // group by id, firstName, lastName
    order: [["id", "DESC"]], // orders by descending order
    offset: 1, // skips the 1st
  });
  response.status(200).json({ data: userData });
};

/* Finders */
const finderUser = async (request, response) => {
  /* 
  findAll() :
      const userData = await User.findAll({});
  */
  /*
  findAll() with where :
      const userData = await User.findAll({ where: { isVerified: false }});
  */
  /*
  findByPk : finds entry by primary key, here id is pk
      const userData = await User.findByPk(1); 
  */
  /*
  findOne() : results one entry using where condition
      const userData = await User.findOne({ where: { id: 2 } });
  */
  /* findOrCreate() : finds the entry using where condition, if not found creats a new entry
      const [userData, created] = await User.findOrCreate({
        where: { firstName: "Mohit" },
        defaults: {
          lastName: "Yadav",
        },
      });
      console.log(userData)
      console.log(created) // true
 */
  /*
  findAndCountAll() : combines findAll() and count
  */
  const { count, rows } = await User.findAndCountAll({
    where: {
      gender: "MALE",
      isVerified: true,
    },
    // offset: 2,
    // limit: 1,
  });
  console.log(count);
  console.log(rows);
  response.status(200).json({
    data: rows,
    count: count,
  });
};

/* Getter, setter and Virtual */
const getSetVirtualUser = async (request, response) => {
  const userData = await User.findAll({});
  // const user = await User.create({
  //   firstName: "Abhishek",
  //   lastName: "Gupta",
  //   gender: "female",
  // });
  response.status(200).json(userData);
};

/* Validate and Constraint */
const validateUser = async (request, response) => {
  try {
    const userData = await User.create({
      firstName: "Abhijeet", // any numerals in firstName -> Invalid, validation fails
      lastName: "Mishra",
      gender: "Male",
    });
    response.status(200).json(userData);
  } catch (err) {
    console.log("Error in validating", err);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

/* Raw Queries */
const rawQueries = async (request, response) => {
  try {
    const userData = await sequelize.query(
      // Replacements methods  (?, :, IN, %)
      // 1---- "SELECT * FROM  users WHERE id = ?",
      // 2---- "SELECT * FROM  users WHERE id = :id",
      // 3---- "SELECT * FROM  users WHERE id  IN(:id)",
      "SELECT * FROM  users WHERE firstName LIKE :search_name",

      // Bind method ($)
      // "SELECT * FROM users WHERE id=$id",
      {
        type: QueryTypes.SELECT,

        // Passing model and mapToModel will return data from models instances
        // model: User,
        // mapToModel: true,

        // If plain is true, then sequelize will only return the first
        // In case of false it will return all records.
        // plain: false,

        // Replacements
        // 1---- replacements: ["1"],
        // 2---- replacements: { id: "2" },
        // 3---- replacements: { id: ["1", "2"] },
        replacements: { search_name: "Abhi%" },

        // Bind
        // bind: { id: "1" },
      }
    );
    response.status(200).json({ data: userData });
  } catch (error) {
    console.error("Error executing raw query:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

/* Associations */
const oneTooneUser = async (request, response) => {
  /* Insert data

  const userData = await User.create({
    firstName: "Rohit",
    lastName: "Kumar",
    gender: "Male",
  });
  if (userData && userData.id) {
    const contactDetails = await Contact.create({
      mobile: "6246575678",
      address: "XYZ buildings",
      city: "Varanasi",
      user_id: userData.id, // foreign key
      user_name: userData.fullName, // setting user name from virtual attribute
    });

    console.log("contact", contactDetails.toJSON());
  }
  */

  /* Fetch Data from User with Contacts included */
  const fetchData = await User.findAll({
    attributes: ["id", "firstName", "lastName", "gender"],
    include: [
      {
        model: Contact,
        attributes: ["mobile", "address", "user_name"],
      },
    ],
  });
  const userData = fetchData.map((user) => user.toJSON());
  console.log("Fetched Data", userData);

  response.status(200).json({ data: userData });
};

const oneToManyUser = async (request, response) => {
  /* Insert multiple entries for a single user
  const userData = await User.findOne({
    attributes: ["id", "firstName", "lastName", "gender"],
    include: [
      {
        model: Contact,
        attributes: ["mobile", "address", "user_name"],
      },
    ],
    where: {
      id: 1,
    },
  });
  if (userData) {
    const contactDetails = await Contact.create({
      mobile: "9989786756",
      address: "ZZZ building",
      city: "New Delhi",
      user_id: userData.id,
      user_name: userData.fullName,
    });

    console.log("Contact: ", contactDetails);
  }
  */

  /* Fetch Data from User with Contacts included */
  const userData = await User.findAll({
    attributes: ["id", "firstName", "lastName", "gender"],
    include: [
      {
        model: Contact,
        attributes: ["mobile", "address", "user_name"],
      },
    ],
    where: { id: 1 },
  });
  // console.log(JSON.stringify(userData, null, 2));
  response.status(200).json({ data: userData });
};

const manyTomanyUser = async (request, response) => {
  /* Insert Into Database 
    const userData = await User.create({
      firstName: "Anand",
      lastName: "Singh",
      gender: "Male",
    });
    if (userData && userData.id) {
      const contactDetails = await Contact.create({
        mobile: "6677889956",
        address: "IIIsxbhbhcvyvc",
        city: "Meerut",
      });

    }
  */

  /* Fetch contacts with user details included
  // const userData = await Contact.findAll({
  //   attributes: ["mobile", "address"],
  //   include: [
  //     {
  //       model: User,
  //       attributes: ["id", "firstName", "lastName", "gender"],
  //     },
  //   ],
  // });
  */

  /* Fetch users with contact details included */
  const userData = await User.findAll({
    attributes: ["id", "firstName", "lastName", "gender"],
    include: [
      {
        model: Contact,
        attributes: ["mobile", "address"],
      },
    ],
  });
  console.log(JSON.stringify(userData, null, 2));
  response.status(200).json(userData);
};



module.exports = {
  addUser,
  createUser,
  updateUser,
  getUsers,
  getUserByID,
  postUser,
  deleteAllUsers,
  deleteUser,
  updateUserByID,
  queryUserInsert,
  queryUserSelect,
  finderUser,
  getSetVirtualUser,
  validateUser,
  rawQueries,
  oneTooneUser,
  oneToManyUser,
  manyTomanyUser,
};
