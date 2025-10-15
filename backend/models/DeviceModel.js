import mongoose from 'mongoose'


const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  model: { type: String, required: true },
  price: { type: Number },
  price_p: { type: Number },
  description: { type: String },
  category: { type: String, required: true },
  subcategory: { type: String },
  manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer', required: true },
  distributors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Distributor' }],
  register: { type: Boolean, default: false },
  image: { type: String }
});


const Devices = mongoose.model('Device', deviceSchema);

export default Devices;