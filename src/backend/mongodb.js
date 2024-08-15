const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/user");
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
    required: true,
    ref: "users",
  },
});
const userSchema3 = mongoose.Schema({
  audit: [
    {
      question: {
        text: { type: String, required: true },

        questionID: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "questions",
        },
      },
      answer: {
        type: String,
        required: true,
      },
      attachment: [
        {
          type: String,
        },
      ],
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
});
const userSchema4 = mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  attachment: [
    {
      type: String,
    },
  ],
});

module.exports = {
  users: mongoose.model("users", userSchema1),
  products: mongoose.model("products", userSchema2),
  useraudit: mongoose.model("useraudit", userSchema3),
  questions: mongoose.model("questions", userSchema4),
};
