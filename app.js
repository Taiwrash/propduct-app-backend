const express = require("express");
const Produce = require("./models/product");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const bodyParser = require("body-parser");
const dbRoom = require("./dbRoom");
const { authUser, authAdmin, jwtAuth } = require("./middleware/auth");
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "This is the Home",
  });
});

dbRoom();

//PRODUCT SECTION

app.get("/products", (req, res) => {
  Produce.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json({
        success: true,
        data,
      });
    }
  });
});

// ADD PRODUCTS SECTION

app.post("/products/add", (req, res) => {
  const newItem = {
    product_name: req.body.product_name,
    image: req.body.image,
    description: req.body.description,
    price: req.body.price,
  };

  Produce.create(newItem, (err, itemCreated) => {
    if (err) {
      res.status(401).json({
        success: false,
        status: "401",
        Message: { message: "double check for the Error" },
      });
    } else {
      res.status(201).json({ success: true, itemCreated });
    }
  });
});

// REMOVE PRODUCT SECTION

app.delete("/products/delete/:id", authUser, authAdmin, (req, res) => {
  Produce.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.json({
        success: false,
        status: status,
        Message: { message: "Unable to delete" },
      });
    } else {
      res.json({
        success: true,
        message: "Succesfully Deleted!",
      });
    }
  });
});

// UPDATE AND EDIT PRODUCTS

app.put("/products/edit/:id", authUser, authAdmin(User.role), (req, res) => {
  Produce.findByIdAndUpdate(req.params.id, req.body, (err, editedItem) => {
    if (err) {
      res.json({
        success: false,
        status: status,
        Message: { message: "Unable to Edit the product" },
      });
    } else {
      res.json({
        success: true,
        editedItem,
      });
    }
  });
});

app.post("/user/signup", (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        role: req.body.role,
        password: hash,
      });
      user.save().then(() => {
        const token = jwt.sign(
          {
            id: user._id,
            lastName: user.lastName,
            firstName: user.firstName,
            email: user.email,
            role: user.role,
          },
          "MY_POWER_NOT_YOURS",
          {
            expiresIn: "60s",
          }
        );
        const { role } = user;
        res.status(200).json({
          success: true,
          token,
          user,
        });
      });
    })
    .catch((err) => {
      res.json({ err: "Email has already" });
    });
});

app.post("/user/login", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.json({
          success: false,
          status: status(404),
          err: "User not in the list",
        });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.json({ err: "Incorrect email address or Password" });
          }
          const token = jwt.sign(
            {
              id: user._id,
              lastName: user.lastName,
              firstName: user.firstName,
              role: user.role,
              email: user.email,
              password: user.password,
            },
            "MY_POWER_NOT_YOURS",
            { expiresIn: "60s" }
          );
          const { role } = user;
          res.status(201).json({
            success: true,
            token,
            user,
          });
        })
        .catch((error) => {
          res.status(500).json({
            error: "You must have correct login details or sign up otherwise!",
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        err: "Input Correct Credentials!",
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: "You must have correct login details or sign up otherwise!",
      });
    });
});

app.get("/users/:id", (req, res) => {
  const identifier = req.params.id;
  User.findOne({ _id: { $ne: identifier } }, (err, totalUsers) => {
    if (err) {
      res.status(403).json({ success: false, status: "403" });
    } else {
      res.status(201).json({ success: true, totalUsers });
    }
  });
});

app.get("/users", (req, res) => {
  const identifier = req.params.id;
  User.find({ _id: { $ne: identifier } }, (err, totalUsers) => {
    if (err) {
      res.status(403).json({ success: false, status: "403" });
    } else {
      res.status(201).json({ success: true, totalUsers });
    }
  });
});

app.listen(process.env.PORT || 3200, () => {
  console.log("App Listening on Port 3200");
});
