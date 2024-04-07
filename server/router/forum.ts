import express from "express";
import { registerForum,getForums } from "../controllers/forum";

const router = express.Router();

router.post('/registerForum',registerForum);
router.get('/getForum',getForums);

export default router;