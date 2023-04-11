import mongoose, { type Document } from 'mongoose'

interface IAddress {
  cep: string
  street: string
  number: string
  complement: string
  city: string
  state: string
}

export interface IUserProfile extends Document {
  email: string
  name: string
  password: string
  confirmpassword: string
  profilePhoto: string
  createdAt: Date
  cpf: string
  address: IAddress
}

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  confirmpassword: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  profilePhoto: {
    type: String,
    default: 'https://static.vecteezy.com/ti/vetor-gratis/p1/9734564-default-avatar-profile-icon-of-social-media-user-vetor.jpg'
  },
  address: {
    cep: {
      type: String,
      default: ''
    },
    street: {
      type: String,
      default: ''
    },
    number: {
      type: String,
      default: ''
    },
    complement: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    }
  }
})

const User = mongoose.model<IUserProfile>('UserProfiles', UserSchema, 'UserProfiles')

export default User
