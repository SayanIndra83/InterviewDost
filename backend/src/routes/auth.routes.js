import express from "express"
import { getUser, loginUser, logoutUser, registerUser } from "../controllers/auth.controllers.js";
import { isAuthinticated } from "../middlewares/auth.middlewares.js";

const router = express.Router()

// public routes
router.post("/signup", registerUser)
router.post("/login", loginUser)

/**
 * @route GET api/auth/logout
 * @description Log out the user and clear the authentication token.
 * @access for only authirized users
 */
// get request for log out
router.get("/logout", isAuthinticated, logoutUser)

/**
 * @route GET api/auth/get-me
 * @description Get the details of the currently logged-in user.
 * @access for only authirized users
 */
router.get("/get-me", getUser)


export default router;