import { Router } from "express";
import { postTransactions, deleteTransactions, getTransactions, putTransactions } from '../controllers/transactions-controller.js';
import { validarToken } from "../middlewares/auth-middleware.js";


const transactionsRouter = Router();
 //transactions
 transactionsRouter.put('/transactions/:id', putTransactions);
 transactionsRouter.delete('/transactions/:id', deleteTransactions);
 transactionsRouter.post('/transactions', postTransactions);
 transactionsRouter.get("/transactions",validarToken, getTransactions);

 export default transactionsRouter;