import "dotenv/config";
import server from "./App.js";

const { PORT } = process.env;
server.listen(PORT, () => {
    console.log("Server running:", PORT);
});

// pm2 to run a production server
// https://github.com/Unitech/pm2
// https://pm2.keymetrics.io/
