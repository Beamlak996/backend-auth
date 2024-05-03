import { createUser, getUserByEmail } from "../actions/user.action";
import express, { Request, Response } from "express";
import { authentication, random } from "../helpers";

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        if(!email || !password) {
           return res.status(400).json({ message: "Complete all the fileds." }); 
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password')

        if(!user) {
            return res.status(404).json({ message: "User not found!" })
        }

        const expectedHash = authentication(user.authentication.salt, password)

        if(user.authentication.password !== expectedHash) {
            return res.status(403).json({ message: "Incorrect email or password." })
        }

        const salt = random()
        user.authentication.sessionToken = authentication(salt, user._id.toString())

        await user.save()

        res.cookie("Role_Auth", user.authentication.sessionToken, { domain: "localhost", path: '/' })

        return res.status(200).json(user).end()
    } catch (error) {
       console.log(error);
       return res.status(500).json({ message: "Something went wrong!" }); 
    }
}

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