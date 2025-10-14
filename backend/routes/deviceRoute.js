import express from 'express'
import {
  addDevice,
  getDeviceByID,
  getDevices,
  removeDevice,
  updateDevice
} from '../controller/deviceController.js'
import parser from '../middleware/cloudinary-multer.js'

const deviceRouter = express.Router()

// ✅ إضافة جهاز جديد
deviceRouter.post('/add', parser('devices').single('image'), addDevice)

// ✅ جلب جميع الأجهزة (مع فلاتر: category, subcategory, search)
deviceRouter.get('/', getDevices)

// ✅ جلب جهاز واحد حسب ID
deviceRouter.get('/:id', getDeviceByID)

// ✅ تحديث جهاز (PUT وليس POST)
deviceRouter.put('/update/:id', parser('devices').single('image'), updateDevice)

// ✅ حذف جهاز (DELETE وليس POST)
deviceRouter.delete('/remove/:id', removeDevice)

export default deviceRouter
