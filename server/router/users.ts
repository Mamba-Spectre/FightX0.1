import express from "express";
import { getUserDetails, searchUser, userForums } from "../controllers/users";

const router = express.Router();

router.get('/',searchUser);
router.get('/details',getUserDetails);
router.get('/forums',userForums);


export default router;