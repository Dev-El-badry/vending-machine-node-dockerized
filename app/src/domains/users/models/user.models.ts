import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

//An interface that describe the properties
//that are required to create new User
interface UserAttrs {
  username: string;
  password: string;
  role: string;
  deposit: number;
  activation: boolean;
}

//An interface that describe the properties
//that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

//An interface what describe properties
//that a User document has
export interface UserDoc extends mongoose.Document {
  username: string;
  password: string;
  role: string;
  activation: boolean;
  deposit: number;
  correctPassword: (password: string, userPassword: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'please enter your username'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [8, 'password must be above or equal 8 characters'],
      select: false,
    },
    deposit: {
      type: Number,
      enum: [0, 5, 10, 20, 50, 100],
      default: 0,
    },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'admin'],
      default: 'buyer',
    },
    activation: {
      type: Boolean,
      default: true,
      select: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre('save', async function (done) {
  if (!this.isModified('password')) return done();
  const hashed = await bcrypt.hash(this.get('password'), 12);
  this.set('password', hashed);

  done();
});

userSchema.pre('/^find/', function (done) {
  this.find({ activation: { $ne: false } });
  done();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);
export { User };
