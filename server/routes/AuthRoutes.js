import { Router } from "express";
import {
  checkUser,
  getAllUser,
  onBoardUser,
  generateToken,
} from "../controllers/AuthController.js";

const router = Router();

router.post("/check-user", checkUser);
router.post("/onboard-user", onBoardUser);
router.get("/get-contacts/:id", getAllUser);
router.get("/generate-token/:userId", generateToken);
export default router;
