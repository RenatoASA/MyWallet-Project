import { Router } from "express";
import { postSignin, postSignup } from '../controllers/users-controller.js';


const authRouter = Router(); 

//users autentication
authRouter.post("/sign-up", postSignup );
authRouter.post("/sign-in", postSignin);

export default authRouter;