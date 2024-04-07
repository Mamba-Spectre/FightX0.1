import express from 'express';

import { registerBid, getBids, getFightBiddingOdds } from '../controllers/biding';
import { isAuthenticated } from '../middleware';

const router = express.Router();

router.post('/registerBid',isAuthenticated ,registerBid);
router.get('/getBids', getBids);
router.get('/getFightBiddingOdds', getFightBiddingOdds);

export default router;