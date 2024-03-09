module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          // get method, this would make the firstName in Uppercase
          const rawVal = this.getDataValue("firstName");
          return rawVal ? rawVal.toUpperCase() : null;
        },
        // contraints
        unique: true,
        // Validations
        validate: {
          isAlpha: true,
          len: [2, 10],
          // isLowercase: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          const rawGender = this.getDataValue("gender");
          return rawGender ? rawGender.toLowerCase() : null;
        },
        // setter function to add M/F or null based on gender
        set(val) {
          const genderVal = val.toLowerCase();
          if (genderVal === "male") {
            this.setDataValue("gender", "M");
          } else if (genderVal === "female") {
            this.setDataValue("gender", "F");
          } else {
            this.setDataValue("gender", null);
          }
        },
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      // Virtuals
      fullName: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.firstName.toLowerCase()} ${this.lastName.toLowerCase()}`;
        },
        set(value) {
          throw new Error("Do not try to set the `fullName` value!");
        },
      },
    },
    {
      // Other model options go here
      tableName: "users",
      // By default timestamps are added to every model
      timestamps: false,
      
    }
  );

  return User;
};
