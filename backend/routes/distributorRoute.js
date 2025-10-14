import express from 'express'
import { addDistributor, getDistributor, getGetDistributor, removeDistributor, updateDistributor } from '../controller/distributorController.js';
import parser from '../middleware/cloudinary-multer.js'



const distributorRouter = express.Router();

distributorRouter.post('/add', parser('distributors').single('image'), addDistributor);
distributorRouter.put('/update/:id', parser('distributors').single('image'), updateDistributor);
distributorRouter.delete('/remove', removeDistributor);
distributorRouter.get('/', getGetDistributor);
distributorRouter.get('/:id', getDistributor);


export default distributorRouter;