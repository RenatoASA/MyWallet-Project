import { db } from '../config/database.js';
import { ObjectId } from 'mongodb';


export async function getTransactions(req, res) {
  const user = res.locals.user;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;


  if (page < 1 || isNaN(page)) {
    return res.status(400).send("O parâmetro 'page' deve ser um número positivo.");
  }

  try {

    const transactions = await db.collection("transactions")
      .find({ userId: user._id })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    if (transactions.length === 0) {
      return res.send([]);
    }

    return res.send(transactions);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

function isPositiveFloat(value) {
  return typeof value === 'number' && value > 0;
}

function isValidTransactionType(type) {
  return type === 'deposit' || type === 'withdraw';
}

export async function postTransactions(req, res) {
  const { value, description, type } = req.body;

  if (!isPositiveFloat(value)) {
    return res.status(422).send("O valor deve ser um número positivo.");
  }

  if (!isValidTransactionType(type)) {
    return res.status(422).send("O tipo de transação deve ser 'deposit' ou 'withdraw'.");
  }

  try {
   
    const lastTransaction = await db.collection("transactions")
      .find({ userId: res.locals.user._id })  
      .sort({ _id: -1 })
      .limit(1)
      .toArray();


    let currentBalance = 0;
    if (lastTransaction.length > 0) {
      currentBalance = lastTransaction[0].balance;
    }

    let newBalance = currentBalance;

    if (type === "deposit") {
      newBalance += value;
    } else if (type === "withdraw") {
      if (value > currentBalance) {
        return res.status(400).send("Saldo insuficiente para a retirada.");
      }
      newBalance -= value;
    }

    await db.collection('transactions').insertOne({
      value,
      description,
      type,
      balance: newBalance,
      createdAt: new Date(),
      userId: res.locals.user._id
    });

    return res.sendStatus(201);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}



export async function putTransactions(req, res) {
  const id = req.params;
  const transactionBody = req.body;
  const user = res.locals.user;

  try {
    const transaction = await db.collection("transactions").findOne({ _id: new ObjectId(id) });

    if (!transaction) {
      return res.status(404).send("Transação não encontrada.");
    }

    if (transaction.userId.toString() !== user._id.toString()) {
      return res.status(403).send("Você não tem permissão para modificar esta transação.");
    }
    if (!isPositiveFloat(transactionBody.value)) {
      return res.status(422).send("O valor deve ser um número positivo.");
    }
    if (!isValidTransactionType(transactionBody.type)) {
      return res.status(422).send("O tipo de transação deve ser 'deposit' ou 'withdraw'.");
    }

    const result = await db.collection("transactions").updateOne({
      _id: new ObjectId(id)
    }, {
      $set: {
        value: transactionBody.value,
        description: transactionBody.description,
        type: transactionBody.type
      }
    });
    if (result.matchedCount === 0) {
      return res.status(404).send("Not Found");
    }

    const transactions = await db.collection("transactions")
      .find({ userId: user._id })
      .sort({ _id: 1 }) 
      .toArray();

      let currentBalance = 0;
      for (let trans of transactions) {
        if (trans.type === 'deposit') {
          currentBalance += trans.value;
        } else if (trans.type === 'withdraw') {
          currentBalance -= trans.value;
        }

        await db.collection("transactions").updateOne(
          { _id: trans._id },
          { $set: { balance: currentBalance } }
        );
      }

    return res.status(204).send("No content");
  }
  catch (error) {
    return res.status(500).send(error.message);
  }
};


export async function deleteTransactions(req, res) {
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