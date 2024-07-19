const express = require("express");
const app = express();
const path = require('path');
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { MONGO_URI, SECRET_KEY } = require("./config/keys");
require('dotenv').config();


// Middleware
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/auth", require("./routes/authRoute"));
app.use("/", require("./routes/courseRoute"));
app.use("/users", require("./routes/userRoute"));
app.use("/enroll-course", require("./routes/enrollRoute"));
app.use("/cart", require("./routes/cartRoutes"));
app.use("/api", require("./routes/codeRoute"));
app.use('/metadata', require("./routes/metadataRoute"));
app.use("/blockly", require("./routes/BlocklyRoute"));
app.use('/api', require("./routes/BlocklyRoute"));
app.use("/api", require("./routes/paymentRoute"));
app.use("/terms", require("./routes/termsRoute"));
app.use('/api', require("./routes/userActivityRoute"));
app.use('/room',  require("./routes/roomRoute"));
app.use('/',  require("./routes/purchaseRoute"));
app.use('/api/seo',  require("./routes/seoRoute"));
app.use('/',  require("./routes/ReviewRoute"));

app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);

app.post('/api/run', async (req, res) => {
  const { userId, code, language } = req.body;
  const output = await monacoEdit(language, code);
  const codeRecord = new Blockly({ userId, generatedCode: code, output }); // Changed to Blockly model
  await codeRecord.save();
  res.send({ output });
});

const monacoEdit = async (language, code) => {
  try {
    // eslint-disable-next-line no-eval
    const result = eval(code);
    return result.toString();
  } catch (error) {
    return error.toString();
  }
};

// Deploy
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const User =require('./model/UserModel')
const { OAuth2Client } = require('google-auth-library');
const { createAuthToken } = require("./middlewares/requireLogin");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/auth/google-login', async (req, res) => {
  const { token } = req.body;

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { name, email, picture } = ticket.getPayload();

  // Find or create user in your database
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ name, email, picture });
  }

 

  res.status(200).json({ userInfo: user,  token});
});


// Database and server setup
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Database connected...");
  })
  .catch((err) => {
    console.error(err);
    console.log("Error occurred");
  });



app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


