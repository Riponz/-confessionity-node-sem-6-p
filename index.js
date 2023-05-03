const express = require("express");
const bodyParser = require("body-parser");
const User = require("./model/userModel");
const Post = require("./model/postModel");
const Group = require("./model/groupModel");
const mongoose = require("mongoose");
const cors = require("cors");

const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require("unique-names-generator");
// console.log(randomName)

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
const port = 3001;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

//database connection
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/confessionityUsers", {
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", (error) => {
  console.error(error);
});
db.once("open", () => console.log("database connected"));

//route for login page
app.get("/login", async (req, res) => {
  const email = req.query.email;
  const pass = req.query.pass;

  const users = await User.find({ email: email });

  const user = users[0];

  if (users.length != 0) {
    if (pass === user.pass) {
      res.json({
        email: user.email,
        userid: user.userid,
        status: "success",
        message: "success",
      });
    } else {
      res.json({ status: "fail", message: "Password does not match" });
    }
  } else {
    res.json({ status: "fail", message: "Email does not exist" });
  }
});

//route for signup page
app.post("/signup", async (req, res) => {
  // const userid = auto-generated
  const email = req.body.email;
  const pass = req.body.password;
  const randomName = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
  });

  const user = new User({
    userid: randomName,
    email: email,
    pass: pass,
  });

  const users = await User.find({ email: email });
  if (users.length === 0) {
    const ret = await user.save();

    const send = {
      userid: ret.userid,
      email: ret.email,
      status: "success",
      message: "account created successfully",
    };

    res.json(send);
  } else {
    res.json({ status: "failed", message: "email already exist" });
  }
});

//route for posting a new post
app.post("/post", async (req, res) => {
  // const userid = auto-generated
  const content = req.body.postContent;
  const email = req.body.email;
  const userid = req.body.userid;

  const post = new Post({
    email: email,
    userid: userid,
    content: content,
  });

  const ret = await post.save();

  const msg = {
    data: ret,
    message: "success",
  };

  res.json(msg);
});

//route for to read all or inother word others post including yourself
app.get("/", async (req, res) => {
  const data = await Post.find();

  res.json(data);
});

//route for seeing all of your posts
app.get("/my-post", async (req, res) => {
  const email = req.query.email;

  const myPosts = await Post.find({ email: email });

  res.json(myPosts);
});

app.get("/post-details", async (req, res) => {
  const id = req.query.id;
  const post = await Post.findOne({ _id: id });
  res.json(post);
});

app.post("/comments", async (req, res) => {
  const id = req.body.id;
  const comment = req.body.comment;

  console.log(id, comment);

  await Post.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $push: {
        comments: comment,
      },
    }
  );
});

//route for deleting a specific post from the user's post list
app.delete("/delete-post", async (req, res) => {
  const postId = req.body.postId;

  {
    /* delete the specific post and return a success/failure message */
  }
  console.log(postId);
  const data = await Post.deleteOne({ _id: postId });

  res.json(req.body);
});

app.listen(port, () => {
  console.log(`server up and running on ${port}`);
});

//test routes

app.post("/group", (req, res) => {
  const name = req.body.name;
  const user = req.body.user;
  const bio = req.body.bio;

  const group = new Group({
    name,
    admin: user,
    bio,
  });

  group.save();

  res.send(group);
});

app.get("/group", async (req, res) => {
  const data = await Group.find();

  res.json(data);
});

app.post("/grp-post", async (req, res) => {
  const admin = req.body.admin;
  const content = req.body.content;

  const id = "64510d9efe1ff3fd4f5e49f6";
  const resp = await Group.findOneAndUpdate(
    { _id: id },
    {
      $push: {
        comments: {
            comments:content
        }
      },
    }
  );

  res.json(resp);
});
