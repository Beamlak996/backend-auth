import { createUser, getUserByEmail } from "actions/user.action";
import express, { Request, Response } from "express";
import { authentication, random } from "helpers";

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body
        if(!email || !username || !password) {
            return res.status(400).json({ message: "Complete all the fileds." })
        }

        const existingUser = await getUserByEmail(email)

        if(existingUser) {
            return res.status(400).json({ message: "User already exists." })
        }

        const salt = random()
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        })

        return res.status(200).json(user).end()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Something went wrong!" })
    }
}