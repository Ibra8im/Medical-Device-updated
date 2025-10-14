import Distributors from '../models/Distributors.js'
import cloudinary from 'cloudinary'

// ✅ إضافة موزع جديد
const addDistributor = async (req, res) => {
  console.log('Payload received:', req.body)
  console.log('File uploaded:', req.file)

  try {
    const distributor = new Distributors({
      name: req.body.name,
      contact_name: req.body.contact_name,
      country: req.body.country,
      email: req.body.email,
      phone: req.body.phone,
      telephone: req.body.telephone,
      address: req.body.address,
      position: req.body.position,
      description: req.body.description,
      website: req.body.website,
      has_dest: req.body.register, // تأكد من الاسم الصحيح في الموديل
      image: req.file ? req.file.path : undefined,
    })

    const newDistributor = await distributor.save()
    res.status(201).json({ success: true, distributor: newDistributor })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// ✅ جلب جميع الموزعين
const getGetDistributor = async (req, res) => {
  try {
    const distributors = await Distributors.find()
    res.json({ success: true, distributors })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ✅ جلب موزع حسب الـ ID
const getDistributor = async (req, res) => {
  try {
    const distributor = await Distributors.findById(req.params.id)
    if (!distributor) {
      return res.status(404).json({ success: false, message: "Distributor not found" })
    }
    res.json({ success: true, distributor })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ✅ تحديث موزع
const updateDistributor = async (req, res) => {
  const { id } = req.params || req.body

  try {
    const existing = await Distributors.findById(id)
    if (!existing) {
      return res.status(404).json({ success: false, message: "Distributor not found" })
    }

    let updatedImagePath = existing.image

    // ✅ إذا تم رفع صورة جديدة، احذف القديمة من Cloudinary
    if (req.file) {
      if (existing.image) {
        const publicId = existing.image.split('/').pop().split('.')[0]
        try {
          await cloudinary.v2.uploader.destroy(publicId)
        } catch (err) {
          console.warn('Cloudinary delete failed:', err.message)
        }
      }
      updatedImagePath = req.file.path
    }

    const updatedDistributor = await Distributors.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        contact_name: req.body.contact_name,
        country: req.body.country,
        email: req.body.email,
        phone: req.body.phone,
        telephone: req.body.telephone,
        address: req.body.address,
        position: req.body.position,
        website: req.body.website,
        description: req.body.description,
        image: updatedImagePath,
      },
      { new: true }
    )

    res.json({ success: true, distributor: updatedDistributor })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ✅ حذف موزع
const removeDistributor = async (req, res) => {
  const { id } = req.body
  try {
    const deletedDistributor = await Distributors.findByIdAndDelete(id)
    if (!deletedDistributor) {
      return res.status(404).json({ success: false, message: "Distributor not found" })
    }

    // احذف الصورة من Cloudinary أيضًا إذا كانت موجودة
    if (deletedDistributor.image) {
      const publicId = deletedDistributor.image.split('/').pop().split('.')[0]
      try {
        await cloudinary.v2.uploader.destroy(publicId)
      } catch (err) {
        console.warn('Cloudinary delete failed:', err.message)
      }
    }

    res.json({ success: true, message: "Distributor deleted successfully" })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export {
  addDistributor,
  getDistributor,
  getGetDistributor,
  updateDistributor,
  removeDistributor,
}
