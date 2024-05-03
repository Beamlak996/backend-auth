import express, { Request, Response, NextFunction } from "express"
import { get, merge } from "lodash"

import { getUserByEmail, getUserBySessionToken } from "../actions/user.action"

export const isOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const currentUserId = get(req, 'identity._id') as string

        if(!currentUserId) {
            return res.status(403).json({ message: "Current user not found." })
        }

        if(currentUserId.toString() !== id) {
            return res.status(403).json({ message: 'You can not perform this action.' })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong." });
    }
}

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
