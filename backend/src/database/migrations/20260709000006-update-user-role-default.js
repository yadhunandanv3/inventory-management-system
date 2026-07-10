module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("users", "role", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "STAFF",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("users", "role", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "ADMIN",
    });
  },
};
