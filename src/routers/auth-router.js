import { Router } from "express";
import { postSignin, postSignup } from '../controllers/users-controller.js';
import { validarSchema } from "../middlewares/schema-middware.js";
import { schemaLognin, schemaLognup } from "../schemas/users-schema.js";


const authRouter = Router(); 

//users autentication
authRouter.post("/sign-up", validarSchema(schemaLognup), postSignup );
authRouter.post("/sign-in", validarSchema(schemaLognin), postSignin);

export default authRouter;