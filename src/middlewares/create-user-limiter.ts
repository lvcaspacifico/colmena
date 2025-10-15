import rateLimit from "express-rate-limit";

// 3 users x 30 min (TH)
export const createUserLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 3,
  message: "Too many accounts created from this IP, please try again later."
});