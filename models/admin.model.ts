import mongoose, { Model } from 'mongoose'

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
})

let Admin: Model<any>
try {
  Admin = mongoose.model('Admin')
} catch (err) {
  Admin = mongoose.model('Admin', AdminSchema)
}

export default Admin
