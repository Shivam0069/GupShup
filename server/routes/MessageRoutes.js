import { Router } from "express";
import {
  addAudioMessage,
  addImageMessage,
  addMessage,
  getMessage,
} from "../controllers/MessageController.js";
import multer from "multer";

const router = Router();

const uploadImage = multer({ dest: "uploads/images" });
const uploadAudio = multer({ dest: "uploads/recordings" });

router.post("/add-message", addMessage);
router.post("/get-messages/:from/:to", getMessage);
router.post("/add-image-message", uploadImage.single("image"), addImageMessage);

router.post("/add-audio-message", uploadAudio.single("audio"), addAudioMessage);
export default router;
