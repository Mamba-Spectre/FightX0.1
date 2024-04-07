import express from "express";
import { getFightRequests, registerFight,acceptFight, getFights } from "../controllers/fights";
import { isAuthenticated } from "../middleware";



const router = express.Router();

router.get('/fightRequests',getFightRequests);
router.post('/registerFight',registerFight);
router.post('/acceptFight',acceptFight);
router.get('/getFights',getFights)


export default router;