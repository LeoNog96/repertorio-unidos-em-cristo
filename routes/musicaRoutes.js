import { Router } from 'express';
import { salvarMusica, listarMusicas } from '../controllers/musicaController.js';

const router = Router();

router.post('/', salvarMusica);
router.get('/', listarMusicas);

export default router;
