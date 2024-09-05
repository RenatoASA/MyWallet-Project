import {db} from '../config/database.js'
import { ObjectId } from 'mongodb';
import joi from 'joi';
import { transactionsSchema } from '../schemas/transactions-schema.js';



//app.get("/transactions", async
    
    export async function getTransactions (req, res) {
      
    try {
       const transactions = await db.collection("transactions").find().sort({ _id: -1 }).toArray();
  
      if (transactions.length === 0) {
        return res.send([]);
      }
  
    //   const transactionsList = [];
    //   for (let transaction of transactions) {
    //     // const user = await db.collection("users").findOne({ username: transaction.username });
    //     transactionsList.push({
    //       _id: transaction._id,
    //       value: transaction.value,
    //       description: transaction.description,
    //       type: transaction.type,
    //       balance: transaction.balance 
    //       //COLOCAR O TOKEN DO USUARIO?
    //     });
    //   }
  
      return res.send(transactions);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  };


export async function postTransactions (req, res) {
    const bodyTransaction = req.body;

    //ADD FUNCTION SOMADEPOSIT - SOMAWITHDRAW

    const validation = transactionsSchema.validate(
        bodyTransaction,
        { abortEarly: false })
  
    if (validation.error) {
      return res.status(422).send("Unprocessable Entity");
    }
  
    try {
         if(bodyTransaction.type === "deposit"){
            let totalBalance =0;
            if(bodyTransaction.balance>0){
                totalBalance =bodyTransaction.balance;
            }
            totalBalance = totalBalance + bodyTransaction.value;
            await db.collection('transactions').insertOne({
                ...bodyTransaction, 
                balance: totalBalance
                //ADICIONAR O TOKEN
        })
        }
        if(bodyTransaction.type === "withdraw"){
            let totalBalance =0;
            if(bodyTransaction.balance>0){
                totalBalance =bodyTransaction.balance;
            }
            totalBalance = totalBalance - bodyTransaction.value;
            await db.collection('transactions').insertOne({
                ...bodyTransaction, 
                balance: totalBalance
                //ADICIONAR O TOKEN
        })
        
    }

    //   const resp = await db.collection('users').findOne({ username: username });
    //   if (!resp) return res.status(401).send("Unauthorized");
  
    //   await db.collection("tweets").insertOne({ username, tweet });
  
      return res.sendStatus(201);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }



  export async function putTransactions (req, res) {
    const  id = req.params;
    const transactionBody = req.body;
    const transactionSchema = joi.object({
      value: joi.number().required(),   
      description: joi.string().required()
    });
  
    const validation = transactionSchema.validate(transactionBody, { abortEarly: false });
    console.log("passou com valor: "+transactionBody);
    if (validation.error) {
      const messageError = validation.error.details.map(datail => datail.message);
      return res.status(422).send(messageError);
    }
  
    try {
        console.log("passou depois da validação com valor: " + transactionBody);
        const findBody = await db.collection("transactions").findOne({_id: new ObjectId(id)});
        console.log("passou do find com valor: "+ findBody);
        const result = await db.collection("transactions").updateOne({
        _id: new ObjectId(id)
      }, {
        $set: {
          value: transactionBody.value,
          description: transactionBody.description
        }
      });
      if (result.matchedCount === 0) {
        return res.status(404).send("Not Found");
      }
  
      return res.status(204).send("No content");
    }
    catch (error) {
      return res.status(500).send(error.message);
    }
  };


  export async function deleteTransactions (req, res) {
    const { id } = req.params;

    try {
      const result = await db
        .collection("transactions")
        .deleteOne({ _id: new ObjectId(id) });
  
      if (result.deletedCount === 0) return res.sendStatus(404)
  
      res.status(204).send("Usuário deletado com sucesso")
    } catch (error) {
      res.status(500).send(error);
    }
  };