const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.js");
const chatRoutes = require("./routes/chat.js");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/Cura", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅🚀 MongoDB connected!"))
  .catch((err) => console.error(err));

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

app.listen(8000, () => console.log("💡🟢 Backend running on port 8000"));
