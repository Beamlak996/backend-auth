import express from "express"

import authenticationRoute from "./authentication.route"
import userRoute from "./user.route"

const router = express.Router()

export default (): express.Router => {
    authenticationRoute(router)
    userRoute(router)

    return router
}