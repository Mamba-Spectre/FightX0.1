import express from "express";
import { getFightRequests, registerFight,acceptFight, getFights, rejectFight,getFightDetails } from "../controllers/fights";
import { isAuthenticated } from "../middleware";



const router = express.Router();

router.get('/fightRequests',getFightRequests);
router.post('/registerFight',registerFight);
router.get('/acceptFight',acceptFight);
router.get('/rejectFight',rejectFight);
router.get('/getFights',getFights)
router.get('/getFightDetails',getFightDetails)


export default router;