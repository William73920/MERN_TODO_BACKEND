import express from "express";
import { signOut, signin, signup } from "../controllers/auth.js";

const router = express.Router();

//CREATE A USER
router.post("/signup", signup);

//SIGN IN
router.post("/signin", signin);

//SIGN OUT
router.get("/signout", signOut);

export default router;
