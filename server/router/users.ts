import express from "express";
import { searchUser, userForums } from "../controllers/users";

const router = express.Router();

router.get('/',searchUser);
router.get('/forums',userForums);


export default router;