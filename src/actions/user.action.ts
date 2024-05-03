import mongoose from "mongoose";

import { UserModel } from "models/user.model";

// get all users
export const getUsers = () => UserModel.find();

// get users by email
export const getUserByEmail = (email: string) => UserModel.findOne({ email });

// get users by session token
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({
    "authentication.sessionToken": sessionToken,
  });

// get user by id  
export const getUserById = (id: string) => UserModel.findById(id);

// create a user
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());

//delete a user   
export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });

//update a user   
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values); 