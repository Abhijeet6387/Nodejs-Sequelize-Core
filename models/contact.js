module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define(
    "contacts",
    {
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isNumeric: true,
          isInt: true,
          len: [10],
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // commented for many-to-many association using junction table
      // user_id: { type: DataTypes.INTEGER, allowNull: false },
      // user_name: { type: DataTypes.STRING, allowNull: false },
    },
    {
      // Other model options go here
      tableName: "contact",
      // By default timestamps are added to every model
      timestamps: false,
      
      // Paranoid
      paranoid: true,
      deletedAt: "soft_delete",
    }
  );

  return Contact;
};
