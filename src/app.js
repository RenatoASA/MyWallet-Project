import express, {json} from 'express';
import cors from 'cors';
import authRouter from './routers/auth-router.js';
import transactionsRouter from './routers/transactions-router.js';

  const app = express();
  app.use(json());
  app.use(cors());

  app.use(authRouter);

  app.use(transactionsRouter);

  const porta = process.env.PORTA;
  app.listen(porta, () => {
  console.log(`o servidor roda na porta ${porta}`);
});

   
  
//   app.get('/transactions/:id', async(req,res)=> {
//     const id = req.params.id;
//     const {authorization} = req.headers;
//     const token = authorization?.replace("Bearer","").trim(); // ? = se tiver autorization executa o replace, se não fica undefined e não trava o javascript
//     if(!token) return res.status(401).send("Unaltorized");

// try {
//     const sessao = await db.collection("sessoes").findOne({ token });
//     if(!sessao)return res.sendStatus(401);
//     const transaction = db.collection("transactions").findOne({
//         _id: new ObjectId(id)
//     })
//     if(!transaction)return res.status(404).send("Transação não encontrada")
//     return res.send(transaction);
// } catch (error) {
//     return res.status(404).send(error.message)}
//   });
     



