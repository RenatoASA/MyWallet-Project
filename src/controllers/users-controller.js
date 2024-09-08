
import bcrypt from 'bcrypt';
import { db } from '../config/database.js';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();


export async function postSignup(req, res) {

    const bodySignup = req.body;

    try {
        const respName = await db.collection('users').findOne({ name: bodySignup.name });
        if (respName) return res.status(409).send("Conflict");

        await db.collection('users').insertOne({
            ...bodySignup,
            password: bcrypt.hashSync(bodySignup.password, 10)

        });
        return res.status(201).send("Registro feito com sucesso");
    } catch (error) {
        return res.status(500).send('caiu aqui');

    }

};


export async function postSignin(req, res) {

    const bodyUser = req.body;

    try {
        const respBodyUser = await db.collection('users').findOne({ email: bodyUser.email });
        if (!respBodyUser) return res.status(404).send("Not Found");

        const respPassword = bcrypt.compareSync(bodyUser.password, respBodyUser.password)
        if (!respPassword) return res.status(401).send("Unauthorized");


        if (respBodyUser && respPassword) {
            console.log("usuario logado", respBodyUser);
            const token = jwt.sign(
                { userId: respBodyUser._id },
                process.env.JWT_SECRET,
                { expiresIn: 86400 }
            );

            return res.status(200).send(token);
        }

        return res.status(401).send("Email e senha incompativeis");
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
};