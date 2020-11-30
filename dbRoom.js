const mongoose = require("mongoose");

const dbRoom = () => {
  mongoose
    .connect(
      // "mongodb://localhost:27017/team-044-procdduct",
      `mongodb+srv://rasheed:APFwdlKB5DC8sqBB@cluster0-kdnyz.mongodb.net/test?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    )
    .then(() => {
      console.log("DB connection successful!");
    })
    .catch((err) => {
      console.log("an error occurred:  ", err);
    });
};

module.exports = dbRoom;
