import mongoose from 'mongoose'


const distributorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact_name: { type: String },

  country: { type: String, },
  email: { type: String, },
  phone: { type: String },
  telephone: { type: String },
  address: { type: String },
  position: { type: String },
  website: { type: String },
  has_dest: { type: Boolean, default: false },

  image: { type: String },

  description: { type: String }
});


const Distributors = mongoose.model('Distributor', distributorSchema);

export default Distributors;