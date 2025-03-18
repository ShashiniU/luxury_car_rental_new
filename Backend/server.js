const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")


dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static("uploads"));

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Error connecting to MongoDB:", err))


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err))




// Routes
const authRoutes = require("./routes/auth")
const carRoutes = require("./routes/cars")
const orderRoutes = require('./routes/orders'); 


app.use("/api/auth", authRoutes)
app.use("/api/cars", carRoutes)
app.use("/api/orders", orderRoutes)
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))



