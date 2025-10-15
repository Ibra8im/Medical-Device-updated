import Devices from '../models/DeviceModel.js'
import cloudinary from 'cloudinary'

// ✅ إضافة جهاز جديد
const addDevice = async (req, res) => {
  try {
    console.log('Payload received:', req.body)
    console.log('File uploaded:', req.file)

    const device = new Devices({
      name: req.body.name,
      model: req.body.model,
      price: req.body.price,
      price_p: req.body.price_p,
      description: req.body.description,
      category: req.body.category,
      subcategory: req.body.subcategory,
      manufacturer: req.body.manufacturer,
      distributors: JSON.parse(req.body.distributors),
      register: req.body.register,
      image: req.file ? req.file.path : undefined, // رابط الصورة على Cloudinary
    })

    const newDevice = await device.save()
    res.status(201).json({ success: true, newDevice })
  } catch (err) {
    console.error(err)
    res.status(400).json({ success: false, message: err.message })
  }
}

// ✅ جلب جميع الأجهزة مع الفلاتر (category, subcategory, search)
const getDevices = async (req, res) => {
  try {
    const { category, subcategory, search } = req.query
    let query = {}

    if (category) query.category = category
    if (subcategory) query.subcategory = subcategory
    if (search) query.name = { $regex: search, $options: 'i' }

    const devices = await Devices.find(query)
      .populate('manufacturer')
      .populate('distributors')

    res.json({ success: true, devices })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ✅ جلب جهاز واحد بالـ ID
const getDeviceByID = async (req, res) => {
  try {
    const device = await Devices.findById(req.params.id)
      .populate('manufacturer')
      .populate('distributors')

    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' })
    }

    res.json({ success: true, device })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ✅ تحديث جهاز موجود
const updateDevice = async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body
    let updatedImagePath = null

    // إذا تم رفع صورة جديدة على Cloudinary
    if (req.file) {
      updatedImagePath = req.file.path

      // حذف الصورة القديمة من Cloudinary إذا كانت موجودة
      const existing = await Devices.findById(id)
      if (existing && existing.image) {
        const publicId = existing.image.split('/').pop().split('.')[0]
        try {
          await cloudinary.v2.uploader.destroy(publicId)
        } catch (err) {
          console.warn('Cloudinary delete failed:', err.message)
        }
      }
    }

    // تحديث البيانات
    const updatedDevice = await Devices.findByIdAndUpdate(
      id,
      {
        ...updates,
        distributors: updates.distributors ? JSON.parse(updates.distributors) : undefined,
        image: updatedImagePath || updates.image,
        price: updates.price,        // تأكد من إرسال الحقل
        price_p: updates.price_p,    // تأكد من إرسال الحقل بشكل منفصل
      },
      { new: true }
    )

    if (!updatedDevice) {
      return res.status(404).json({ success: false, message: 'Device not found' })
    }

    res.json({ success: true, updatedDevice })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: err.message })
  }
}

// ✅ حذف جهاز
const removeDevice = async (req, res) => {
  try {
    const { id } = req.params
    const device = await Devices.findById(id)

    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' })
    }

    // حذف الصورة من Cloudinary
    if (device.image) {
      const publicId = device.image.split('/').pop().split('.')[0]
      try {
        await cloudinary.v2.uploader.destroy(publicId)
      } catch (err) {
        console.warn('Cloudinary delete failed:', err.message)
      }
    }

    await Devices.findByIdAndDelete(id)

    res.json({ success: true, message: 'Device deleted successfully' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export {
  addDevice,
  getDevices,
  getDeviceByID,
  updateDevice,
  removeDevice,
}
