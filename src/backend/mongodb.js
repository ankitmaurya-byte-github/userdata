const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/user");
const userSchema1 = mongoose.Schema({
  name: String,
  Email: String,
  password: String,
});

const userSchema2 = mongoose.Schema({
  department: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = {
  users: mongoose.model("users", userSchema1),
  products: mongoose.model("products", userSchema2),
};
