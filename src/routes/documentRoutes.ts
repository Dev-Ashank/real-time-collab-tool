
import express from 'express';
import * as DocumentController from '../controllers/documentController';

const router = express.Router();

router.post('/', DocumentController.createDocument);
router.get('/:id', DocumentController.getDocumentById);
router.put('/:id', DocumentController.updateDocument);
router.delete('/:id', DocumentController.deleteDocument);

export default router;
