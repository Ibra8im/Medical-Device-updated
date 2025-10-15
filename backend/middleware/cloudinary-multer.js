import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import cloudinary from '../config/cloudinary.js'

/**
 * 🧠 ميدل وير ديناميكي لرفع الصور إلى Cloudinary
 * 
 * يمكن تحديد المجلد المطلوب عبر:
 * parser('distributors').single('image')
 * parser('devices').single('image')
 */
const parser = (folderName = 'uploads') => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      const ext = file.mimetype.split('/')[1]
      return {
        folder: folderName, // 📁 المجلد المخصص لكل نوع بيانات
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
        format: ext,
        transformation: [{ width: 800, height: 800, crop: 'limit' }], // تصغير حجم الصورة
      }
    },
  })

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 🚫 حد أقصى 5MB
  })
}

export default parser
