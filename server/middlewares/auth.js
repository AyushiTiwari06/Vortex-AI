// // import { clerkClient } from "@clerk/express";

// // export const auth = async (req, res, next) => {
// //     try {
// //         const {userId, has} = await req.auth();
// //         console.log("1. USER ID:", userId);

// //         const hasPremiumPlan = await has({plan: 'premium'});
// //         console.log("2. PREMIUM CHECK:", hasPremiumPlan);

// //         const user = await clerkClient.users.getUser(userId);
// //         console.log("3. CLERK USER:", user.id);

// //         if (!hasPremiumPlan && user.privateMetadata.free_usage) {
// //             req.free_usage = user.privateMetadata.free_usage
// //         } else {
// //             await clerkClient.users.updateUserMetadata(userId, {
// //                 privateMetadata: {
// //                     free_usage: 0
// //                 }
// //             })
// //             req.free_usage = 0;
// //         }
// //         req.plan = hasPremiumPlan ? 'premium' : 'free';
// //         next();
// //     } catch (error) {
// //         res.json({succes: false, message: error.message})
// //     }
// // }



import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    const { userId, has } = await req.auth();

    // Check authentication
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login first.",
      });
    }

    // Check premium subscription
    const hasPremiumPlan =
      typeof has === "function" && has({ plan: "premium" });

    // Fetch Clerk user
    const user = await clerkClient.users.getUser(userId);

    // Get free usage
    let freeUsage = user.privateMetadata?.free_usage;

    // Initialize free usage if missing
    if (typeof freeUsage !== "number") {
      freeUsage = 0;

      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: 0,
        },
      });
    }

    // Attach user information to request
    req.userId = userId;
    req.plan = hasPremiumPlan ? "premium" : "free";
    req.free_usage = freeUsage;

    next();

  } catch (error) {
    console.error("Authentication Middleware Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Authentication failed.",
    });
  }
};
