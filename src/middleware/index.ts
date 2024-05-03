import express, { Request, Response, NextFunction } from "express"
import { get, merge } from "lodash"

import { getUserByEmail, getUserBySessionToken } from "../actions/user.action"

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionToken = req.cookies["Role_Auth"];

        if(!sessionToken) {
            return res.status(403).json({ message: "No session token." })
        }

        const existingUser = await getUserBySessionToken(sessionToken)
        if(!existingUser) {
            return res.status(404).json({ message: "User not found." })
        }

        merge(req, { identity: existingUser })
        
        return next()
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong." })
    }
}
