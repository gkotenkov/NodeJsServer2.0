/** source/routes/posts.ts */
import express from 'express';
import {getStoresList, getStoreById, insertStores as insertStore, getStoreByTitle, updateStore, deleteStore} from '../controllers/store.controllers';
const router = express.Router();

router.get('/StoreList', getStoresList);
router.get('/Store/:id', getStoreById);
router.get('/Store/:name_store', getStoreByTitle);
router.put('/Update/:id', updateStore);
router.post('/Insert', insertStore);
router.delete('/Delete/:id', deleteStore);



export default { router };