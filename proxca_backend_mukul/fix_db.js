const { sequelize } = require('./config/config');

async function fixDatabase() {
  try {
    const [results] = await sequelize.query("SHOW COLUMNS FROM intake_request_comments LIKE 'departmentId'");
    if (results.length === 0) {
      console.log("Adding departmentId column to intake_request_comments table...");
      await sequelize.query("ALTER TABLE intake_request_comments ADD COLUMN departmentId BIGINT NULL");
      console.log("Column added successfully!");
    } else {
      console.log("departmentId column already exists.");
    }
    process.exit(0);
  } catch (error) {
    console.error("Error adding column:", error);
    process.exit(1);
  }
}

fixDatabase();
