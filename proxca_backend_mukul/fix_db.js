const { sequelize } = require('./config/config');

async function fixDatabase() {
  try {
    console.log("Checking columns for costSavings table...");
    
    // Add currentPrice
    const [currPriceRes] = await sequelize.query("SHOW COLUMNS FROM costSavings LIKE 'currentPrice'");
    if (currPriceRes.length === 0) {
      console.log("Adding currentPrice column...");
      await sequelize.query("ALTER TABLE costSavings ADD COLUMN currentPrice VARCHAR(255) NULL");
    } else {
      console.log("currentPrice column already exists.");
    }

    // Add proposedPrice
    const [propPriceRes] = await sequelize.query("SHOW COLUMNS FROM costSavings LIKE 'proposedPrice'");
    if (propPriceRes.length === 0) {
      console.log("Adding proposedPrice column...");
      await sequelize.query("ALTER TABLE costSavings ADD COLUMN proposedPrice VARCHAR(255) NULL");
    } else {
      console.log("proposedPrice column already exists.");
    }

    // Add notesDescription
    const [notesRes] = await sequelize.query("SHOW COLUMNS FROM costSavings LIKE 'notesDescription'");
    if (notesRes.length === 0) {
      console.log("Adding notesDescription column...");
      await sequelize.query("ALTER TABLE costSavings ADD COLUMN notesDescription TEXT NULL");
    } else {
      console.log("notesDescription column already exists.");
    }

    console.log("Database schema check completed!");
    process.exit(0);
  } catch (error) {
    console.error("Error updating database:", error);
    process.exit(1);
  }
}

fixDatabase();
