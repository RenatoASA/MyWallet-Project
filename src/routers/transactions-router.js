import { Router } from "express";
import { postTransactions, deleteTransactions, getTransactions, putTransactions } from '../controllers/transactions-controller.js';
import { validarToken } from "../middlewares/auth-middleware.js";
import { transactionsSchema } from "../schemas/transactions-schema.js";
import { validarSchema } from "../middlewares/schema-middware.js";

const transactionsRouter = Router();
//transactions
transactionsRouter.use(validarToken);
transactionsRouter.put('/transactions/:id', validarSchema(transactionsSchema), putTransactions);
transactionsRouter.delete('/transactions/:id', deleteTransactions);
transactionsRouter.post('/transactions', validarSchema(transactionsSchema), postTransactions);
transactionsRouter.get("/transactions", getTransactions);

export default transactionsRouter;