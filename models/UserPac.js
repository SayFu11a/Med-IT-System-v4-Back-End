import mongoose from 'mongoose';

const UserPacSchema = new mongoose.Schema(
   {
      fullName: {
         type: String,
         required: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
      },
      passwordHash: {
         type: String,
         required: true,
      },
      avatarUrl: String,
      patient: {
         type: Boolean,
         default: true,
      },
   },
   {
      timestamps: true,
   },
);

export default mongoose.model('User', UserSchema);
