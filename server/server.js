
// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import { clerkMiddleware, getAuth } from "@clerk/express";

// import aiRouter from "./routes/aiRoute.js";
// import userRouter from "./routes/userRoute.js";
// import connectCloudinary from "./configs/cloudinary.js";

// const app = express();

// await connectCloudinary();

// app.use(cors());
// app.use(express.json());

// app.use(
//   clerkMiddleware({
//     secretKey: process.env.CLERK_SECRET_KEY,
//     publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
//   })
// );

// // Test root route
// app.get("/", (req, res) => {
//   res.send("server is running");
// });

// // Authentication middleware
// const protect = (req, res, next) => {
//   const { userId } = getAuth(req);

//   if (!userId) {
//     return res.status(401).json({
//       success: false,
//       message: "Please login first.",
//     });
//   }

//   next();
// };

// // Test AI routing
// app.post("/api/ai/test", protect, (req, res) => {
//   console.log("AI TEST ROUTE HIT");

//   res.json({
//     success: true,
//     message: "AI API routing is working",
//   });
// });

// // Application routes
// app.use("/api/ai", protect, aiRouter);
// app.use("/api/user", protect, userRouter);

// const PORT = process.env.PORT || 4000;

// app.listen(PORT, () => {
//   console.log("The Server is running on port", PORT);
// });



import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";

import aiRouter from "./routes/aiRoute.js";
import userRouter from "./routes/userRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import { auth } from "./middlewares/auth.js";

const app = express();

await connectCloudinary();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

app.use(
  clerkMiddleware({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  })
);

app.get("/", (req, res) => {
  res.send("server is running");
});

// Authentication applied once to each router
app.use("/api/ai", auth, aiRouter);
app.use("/api/user", auth, userRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("The Server is running on port", PORT);
});
