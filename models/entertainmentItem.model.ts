import mongoose, { Model } from 'mongoose'
const ParentFolder = require('./parentFolder.model')
const Account = require('./account.model')

const EntertainmentItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  // OneDrive fields
  parent_folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParentFolder',
    required: true,
  },
  parent_folder_onedrive_id: {
    type: String,
    required: true,
  },
  onedrive_item_id: {
    type: String,
    required: true,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  webURL: {
    type: String,
    required: true,
  },
  onedrive_id: {
    type: String,
    required: true,
  },
  site_id: {
    type: String,
    required: true,
  },

  // IMDB Fields
  cover_image: {
    type: String,
  },
  imdb_id: {
    type: String,
  },
  plot_summary: {
    type: String,
  },
  rating: {
    type: Number,
  },
  cast: {
    type: [String],
  },
  genre: {
    type: String,
  },
  backdrop_url: {
    type: String,
  },
})

let EntertainmentItem: Model<any>
try {
  EntertainmentItem = mongoose.model('EntertainmentItem')
} catch (err) {
  EntertainmentItem = mongoose.model(
    'EntertainmentItem',
    EntertainmentItemSchema,
  )
}

export default EntertainmentItem
