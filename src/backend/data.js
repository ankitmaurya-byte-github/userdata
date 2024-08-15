require("./mongodb.js");
const cors = require("cors");
const userModel1 = require("./mongodb.js").users;
const userModel2 = require("./mongodb.js").products;
const userModel3 = require("./mongodb.js").useraudit;
const userModel4 = require("./mongodb.js").questions;
const express = require("express");
const app = express();
app.use(cors());

const fileUpload = require("express-fileupload");
app.use(fileUpload());
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(express.json({ limit: "50mb" }));
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// app.use(express.urlencoded({ limit: "50mb" }));

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "de6w5tjah",
  api_key: "239679937973224",
  api_secret: "5eA4-gxJt775R5_Xdta5j9oOtZo",
});
app.post("/sinup", async (req, res) => {
  console.log(req.body);
  const data = new userModel1(req.body);
  const result = await data.save();
  result.toObject();
  jwt.sign({ result }, "user", { expiresIn: "24h" }, (err, token) => {
    if (err) {
      res.send({ error: "error occured" });
    }
    res.send({ data, auth: token });
  });
});
app.post("/login", async (req, res) => {
  console.log(req.body);
  console.log("body");
  const data = await userModel1.findOne({ Email: req.body.Email });

  console.log(data);

  if (data) {
    if (data.password !== req.body.password) {
      res.send({ error: "Passsword not match" });
    }
    jwt.sign({ data }, "user", { expiresIn: "24h" }, (err, token) => {
      if (err) {
        res.send({ error: "error occured" });
      }
      res.send({ data, auth: token });
    });
  } else {
    res.send({ error: "not found" });
  }
});

app.post("/submituser", verifytoken, async (req, res) => {
  try {
    console.log(req.body);
    const data = new userModel2(req.body);
    await data.save();
    res.send("data");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

app.post("/submitanswer", verifytoken, async (req, res) => {
  if (!req.body.images) {
    req.body.images = [];
  }
  req.body.images = Array.isArray(req.body.images)
    ? req.body.images
    : [req.body.images];
  try {
    const images = req.body.images.map(async (image) => {
      const mycloud = await cloudinary.uploader.upload(image, {
        folder: "photo",
        width: 150,
        crop: "scale",
      });

      if (!mycloud) {
        return res.status(500).json({
          message: "cloudinary upload failed",
        });
      }
      return mycloud.secure_url;
    });
    const uploadResults = await Promise.all(images);
    console.log(req.user);
    const userdata = await userModel3.findOne({ user: req.user });
    if (userdata) {
      // update here
      console.log(userdata);
      const result = await userModel3.updateOne({
        $push: {
          audit: {
            question: {
              text: req.body.question,
              questionID: req.body.questionID,
            },
            answer: req.body.answer,
            attachment: uploadResults,
          },
        },
      });
      if (result.nModified === 0) {
        throw new Error("No document was updated");
      }
      res.send({ message: "Audit updated successfully", result });
    } else {
      const addAudit = new userModel3({
        audit: [
          {
            question: {
              text: req.body.question,
              questionID: req.body.questionID,
            },
            answer: req.body.answer,
            attachment: uploadResults,
          },
        ],
        user: req.user,
      });
      await addAudit.save();
      res.send({ message: "New audit added successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

app.get("/questions", verifytoken, async (req, res) => {
  try {
    const result = await userModel4.find();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

async function verifytoken(req, res, next) {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    jwt.verify(token, "user", async (err, result) => {
      if (err) {
        res.status(500).send("token error");
      } else {
        req.user = result.result._id;
        next();
      }
    });
  } else {
    res.send("please attached token with headers");
  }
}
app.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
