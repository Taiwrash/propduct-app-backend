const jwt = require("jsonwebtoken");
// const User = require("../models/user");

const authUser = (req, res, next) => {
  if (req.body.user !== null) {
    res.status(403).json({ message: "Log in" });
  }
  next();
};

const authAdmin = (role) => {
  return (req, res, next) => {
    if (req.body.role !== role) {
      res.status(403).json({
        message: "You are not an Admin",
      });
    }
    next();
  };
};

const authDelete = (user, product) => {
  return (req, res, next) => {
    if (user.role !== "admin") {
      res.status(401).json({ message: "You can not delete product" });
    }
    next();
  };
};

const jwtAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split("")[1];
    const decodeToken = jwt.verify(
      token,
      "MY_POWER_NOT_YOURS",
      (err, authData) => {
        if (err) {
          res.status(403);
        } else {
          res.json({ message: "Successfully done!", authData, decodeToken });
        }
      }
    );

    const id = decodeToken.id;
    if (req.body.id !== id) {
      throw "Invalid user Id";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid Request!"),
    });
  }
};

module.exports = { authUser, authAdmin, jwtAuth, authDelete };
