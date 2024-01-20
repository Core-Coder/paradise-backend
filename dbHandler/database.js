const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("projectbackend", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Berhasil terhubung");

    await sequelize.sync();
    console.log("Database dan tabel berhasil tersinkron");
  } catch (error) {
    console.error("Tidak dapat terhubung ke database:", error);
  }
})();

module.exports = { sequelize };
