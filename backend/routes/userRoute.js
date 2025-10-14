import express from "express";
import { register, login } from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// 🧾 تسجيل المستخدم
router.post("/register", register);

// 🔐 تسجيل الدخول
router.post("/login", login);

// 🔒 مثال لمسار خاص بالأدمن فقط
router.get("/admin-only", protect, authorizeRoles("Admin"), (req, res) => {
  res.json({ success: true, message: "Welcome, Admin!" });
});

export default router;
