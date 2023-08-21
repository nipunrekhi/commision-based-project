import path from "path";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from "./config/db.js";
import { Server } from "socket.io";
import http from "http";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { bid, displayBid } from "./controllers/bidingController.js";
const __dirname = path.resolve();

// Deployment configuration
//configure env file in dev mode
dotenv.config();

// configure env file in production
if (process.env.NODE_ENV === undefined) {
  dotenv.config({ path: "../backend/utils/.env" });
}

// Connect to database
connectDB();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let highestBid = 0;

io.on("connection", (socket) => {
  console.log("userConnected");
  socket.on("bid", ({ bidId, bidPrice }) => {
    console.log(bidPrice);
    if (bidPrice > highestBid) {
      highestBid = bidPrice;
    }
     io.emit("highestBid", bidPrice);
  });
});

// Body parser
app.use(express.json());


// CORS
app.use(
  cors({
    origin: "*",
  })
);

// API routes
app.use("/api/user", userRoutes);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
}

// Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

server.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}`
      .yellow.bold
  )
);
