import { Request, Response } from "express";

import { deleteUserById, getUserById, getUsers } from "../actions/user.action";

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await getUsers()

        return res.status(200).json(users)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong!" }); 
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const deleteUser = await deleteUserById(id)    

        return res.json(deleteUser)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong!" }); 
    }
}

export const updateUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.sendStatus(400);
    }

    const user = await getUserById(id);

    user.username = username;
    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};