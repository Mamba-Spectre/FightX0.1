import mongoose from "mongoose";

interface IUser {
  email: string;
  username: string;
  fullname: string;
  totalWinning: number;
  isBlackListed: boolean;
  profilePicture: string;
  authentication: {
    password: string;
    salt: string;
    sessionToken: string;
  };
}
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String, required: true, unique: true},
  fullname: { type: String, required: true },
  totalWinning: { type: Number, required: true, default: 0 },
  isBlackListed: { type: Boolean, required: true, default: false },
  walletBalance: { type: Number, required: true, default: 0 },
  profilePicture: { type: String, required: true, default: ""},
  authentication: {
    password: { type: String, required: false, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
});

export const UserModel = mongoose.model("User", UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);
  export const updateUserByUsername = (username: string, values: Record<string, any>) => UserModel.findOne({ username }).then((user) => { user.set(values); return user.save(); } );
  export const getUserTotalBalance = (username: string) => UserModel.findOne({ username }).then((user) => user.walletBalance);