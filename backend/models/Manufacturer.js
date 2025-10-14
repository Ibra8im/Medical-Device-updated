import mongoose from 'mongoose';

const manufacturerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  contact_name: { type: String, required: true },
  email: { type: String },
  position: { type: String },
  mobile: { type: String },
  telephone: { type: String },
  website: { type: String },
  address: { type: String },
  distributors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Distributor' }],
  has_agent: { type: Boolean, default: false },
  description: { type: String },
  image: { type: String },
}, { timestamps: true });

const Manufacturers = mongoose.model('Manufacturer', manufacturerSchema);
export default Manufacturers;
