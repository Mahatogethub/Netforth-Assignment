const jwt = require("jsonwebtoken");
const blogModel = require("../model/blogModel");

const authenticate = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) {
      return res.status(404).send({ status: false, msg: "token must be present" });
    }

    let decodedToken = jwt.verify(token, "functionup-plutonium");
    if (!decodedToken) {
      return res.status(401).send({ status: false, msg: "token is invalid" });
    }
    req.loggedInUser = decodedToken.userId;
    next();
  } catch (err) {
    res.status(500).send({ msg: "server error", error: err });
  }
};

const authorise = async function (req, res, next) {
  try {
    let requestBlogId = req.params.blogId ;
    let BlogData = await blogModel.findById(requestBlogId) ;
    let blogAuthor = BlogData.authorId.toString() ;
    if (blogAuthor != req.loggedInUser) {
      return res.status(403).send({ status: false, msg: " Permission is Denied for this User" })
    }
    next() ;
  } catch (err) {
    return res.status(500).send({ msg: "server error", error: err });
  }

};

const authorize = async function (req, res, next) {
  try {
    if (Object.keys(req.query).length == 0) {
      return res.status(400).send({ status: false, msg: "please enter a query" })
    }
  
    let validAuthor = req.loggedInUser
    let RequestedQueryId = req.query.authorId
    
    if (RequestedQueryId !== validAuthor) {
      return res.status(403).send({ status: false, msg: " Permission is Denied for this User " })
    }
    let savedData = await blogModel.find(req.query)
    if (!savedData[0]) {
      return res.status(400).send({ status: false, msg: "no blog exists with the given query" })
    }

    let arr = []
    for (let i = 0; i < savedData.length; i++) {
      if (savedData[i].authorId == validAuthor) {
        arr.push(savedData[i].authorId)
      }
    }

    if (arr[0] != validAuthor) {
      return res.status(404).send({ status: false, msg: "you are not authorized" })
    } else {
      next()
    }

  } catch (err) {
    return res.status(500).send({ msg: "server error", error: err });
  }

}

module.exports.authenticate = authenticate;
module.exports.authorise = authorise;
module.exports.authorize = authorize;
