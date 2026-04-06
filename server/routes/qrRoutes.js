import { Router } from 'express';
import { getQRDataById, saveQRData } from '../controllers/qrController.js';

const router = Router();

router.post('/save', saveQRData);
router.get('/:id', getQRDataById);

export default router;
