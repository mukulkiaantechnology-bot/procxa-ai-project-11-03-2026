const db = require('./config/config');

async function checkSchema() {
    try {
        const [results] = await db.sequelize.query("DESCRIBE costSavings");
        console.log("Current columns in costSavings:");
        console.log(JSON.stringify(results, null, 2));
    } catch (error) {
        console.error("Error checking schema:", error.message);
    } finally {
        await db.sequelize.close();
    }
}

checkSchema();
