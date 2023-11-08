const mongoose = require("mongoose");
const app = require("./app");
//CONNECT TO DATABASE
const DB = process.env.DATABASE_CONNECTION.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected✍️");
  });

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}✅`);
});
