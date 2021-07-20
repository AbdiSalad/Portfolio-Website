const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const nodemailer = require("nodemailer");
const nodemailMailgun = require("nodemailer-mailgun-transport");
const path = require("path");
const app = express();

// Global Variables
const port = process.env.PORT || 3000;

// Step 1
const auth = {
  auth: {
    api_key: "fac8486ae85717c98033d643c92f0a58-e31dc3cc-c724174c",
    domain: "sandboxf096977be34a4890a5fd3d9bf16b2928.mailgun.org",
  },
};

// Step 2
let transporter = nodemailer.createTransport(nodemailMailgun(auth));

// View engine setup
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  // res.send("hello");
  res.render("contact", { layout: false });
});

app.post("/send", (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${req.body.username}</li>
      <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.description}</p>


  `;

  // Step 3
  const mailOptions = {
    from: "Excited User <me@samples.mailgun.org>",
    to: "abdurahman.salad@Hotmail.com, abdiwaryasalad@gmail.com",
    subject: "Welcome to my App",
    text: output,
  };

  // Step 4
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log("Error: ", err);
    } else {
      console.log("Message sent");
      res.render("contact", { msg: "Email has been sent", layout: false });
    }
  });
});

app.listen(port, () => {
  console.log("Server started...");
});
