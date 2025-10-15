import express from 'express';
import {
  addManufacturer,
  getManufacturer,
  getManufacturerById,
  removeManufacturer,
  updateManufacturer
} from '../controller/manufacturerController.js';
import parser from '../middleware/cloudinary-multer.js'


const manufacturerRouter = express.Router();

manufacturerRouter.post('/add', parser('manufacturers').single('image'), addManufacturer); // ➕ Add
manufacturerRouter.get('/', getManufacturer); // 📋 Get all
manufacturerRouter.get('/:id', getManufacturerById); // 🔍 Get one
manufacturerRouter.put('/:id', parser('manufacturers').single('image'), updateManufacturer); // ✏️ Update
manufacturerRouter.delete('/:id', removeManufacturer); // ❌ Delete

export default manufacturerRouter;
