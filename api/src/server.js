const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./services/db");
const app = require("./app");

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servern lyssnar på ${PORT}`);
});
