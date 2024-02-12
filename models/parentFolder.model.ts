import mongoose, { Model } from 'mongoose'
const Account = require('./account.model')

const ParentFolderSchema = new mongoose.Schema(
  {
    folder_name: {
      type: String,
      required: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
  },
  {
    timestamps: true,
  },
)

let ParentFolder: Model<any>
try {
  ParentFolder = mongoose.model('ParentFolder')
} catch (err) {
  ParentFolder = mongoose.model('ParentFolder', ParentFolderSchema)
}

export default ParentFolder
