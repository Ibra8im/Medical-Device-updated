import Manufacturers from '../models/Manufacturer.js';
import cloudinary from 'cloudinary'




// ✅ Add Manufacturer
const addManufacturer = async (req, res) => {
  try {
    const manufacturer = new Manufacturers({
      name: req.body.name,
      contact_name: req.body.contact_name,
      country: req.body.country,
      email: req.body.email,
      mobile: req.body.mobile,
      phone: req.body.phone,
      telephone: req.body.telephone,
      address: req.body.address,
      position: req.body.position,
      description: req.body.description,
      website: req.body.website,
      distributors: req.body.distributors ? JSON.parse(req.body.distributors) : [],
      has_agent: req.body.has_agent, // تأكد من الاسم الصحيح في الموديل
      image: req.file ? req.file.path : undefined,
    });
    const newManufacturer = await manufacturer.save();
    res.status(201).json({ success: true, newManufacturer });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All Manufacturers
const getManufacturer = async (req, res) => {
  try {
    const manufacturers = await Manufacturers.find().populate('distributors');
    res.status(200).json({ success: true, manufacturers });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Error fetching manufacturers' });
  }
};

// ✅ Get Manufacturer by ID
const getManufacturerById = async (req, res) => {
  try {
    const manufacturer = await Manufacturers.findById(req.params.id).populate('distributors');
    if (!manufacturer)
      return res.status(404).json({ success: false, message: 'Manufacturer not found' });

    res.status(200).json({ success: true, manufacturer });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Manufacturer
const updateManufacturer = async (req, res) => {
  const { id } = req.params || req.body

  try {

    const existing = await Manufacturers.findById(id)
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

    const manufacturer = await Manufacturers.findByIdAndUpdate(
      id,
      {
        $set: {
          name: req.body.name,
          country: req.body.country,
          contact_name: req.body.contact_name,
          email: req.body.email,
          mobile: req.body.mobile,
          telephone: req.body.telephone,
          website: req.body.website,
          address: req.body.address,
          has_agent: req.body.has_agent,
          distributors: JSON.parse(req.body.distributors),
          agent: req.body.agent,
          description: req.body.description,
          image: updatedImagePath,

        },
      },
      { new: true }
    );

    if (!manufacturer)
      return res.status(404).json({ success: false, message: 'Manufacturer not found' });

    res.status(200).json({ success: true, message: 'Manufacturer updated successfully', manufacturer });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Remove Manufacturer
const removeManufacturer = async (req, res) => {
  try {
    const manufacturer = await Manufacturers.findByIdAndDelete(req.params.id);
    if (!manufacturer)
      return res.status(404).json({ success: false, message: 'Manufacturer not found' });

    res.status(200).json({ success: true, message: 'Manufacturer deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  addManufacturer,
  getManufacturer,
  getManufacturerById,
  updateManufacturer,
  removeManufacturer,
};
