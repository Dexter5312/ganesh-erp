import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'worker', 'billing'],
    default: 'worker'
  }
});

const User = mongoose.model('User', userSchema);
export default User;
