import express, {json} from 'express';
import cors from 'cors';
import authRouter from './routers/auth-router.js';
import transactionsRouter from './routers/transactions-router.js';

  const app = express();
  app.use(json());
  app.use(cors());

  app.use(authRouter);

  app.use(transactionsRouter);

  const port = process.env.PORT;
  app.listen(port, () => {
  console.log(`o servidor roda na porta ${port}`);
});



