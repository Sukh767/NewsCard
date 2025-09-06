import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import User from "../models/User.js"


const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token; // 🔹 first from cookie
  // console.log("token : ", token)
  if (!token) {
    return next(new ApiError(401, "Unauthorized"));
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decodedToken)

    const user = await User.findById(decodedToken?.userId).select(
      "-password"
    );

    // console.log(user)

    if (!user) {
      return next(new ApiError(401, "middleware : Unauthorized"));
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return next(new ApiError(401, err?.message || "Invalid access token"));
  }
});


const authRole = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        return next(new ApiError(401, "Permission denied, contact admin"))
    }
})

export {
    verifyJWT,
    authRole,
}