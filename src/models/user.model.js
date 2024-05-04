import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name field is required'],
      minLength: [6, 'Name must be equal or larger than 6 characters']
      // maxLength: [12, 'Name must be equal or less than 12 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide you email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
      type: String
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minLength: 8
    },
    age: String,
    confirmPassword: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords does not match'
      }
    },
    passwordChangedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  // THIS WILL RUN ONLY IF PASSWORD ACTUALLY UPDATED
  if (!this.isModified('password')) return next();

  // ENCRYPT THE PASSWORD WITH COST OF 12;
  this.password = await bcrypt.hash(this.password, 12);
  // DELETE CONFIRM PASSWORD
  this.confirmPassword = undefined;
});

userSchema.methods.isPasswordCorrect = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.checkForPasswordChangeAfterTokenIssue = function (
  JWTTimestamp
) {
  if (this.passwordChangedAt) {
    const updatedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < updatedTimestamp;
  }
  return false;
};

export const User = mongoose.model('User', userSchema);
