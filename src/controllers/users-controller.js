
import bcrypt from 'bcrypt';
import {v4 as uuid} from 'uuid';
import { schemaLognin,schemaLognup } from '../schemas/users-schema.js';
import {db} from '../config/database.js'


export async function postSignup (req, res) {

    const bodySignup = req.body;
    
    const validacao = schemaLognup.validate(bodySignup, {abortEarly:false});
    if(validacao.error){
        const messages = validacao.error.details.map(details => details.message);
        return res.status(422).send('Unprocessable Entity  ' + messages)
    }
    
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
    
    
    export async function postSignin (req, res) {
       
    const bodyUser= req.body;
    
    const validacao = schemaLognin.validate(bodyUser, {abortEarly:false});
    if(validacao.error){
        const messages = validacao.error.details.map(details => details.message);
        return res.status(422).send('Unprocessable Entity  ' + messages)
    }
    
    try {
        const respBodyUser = await db.collection('users').findOne({ email: bodyUser.email });
        if (!respBodyUser) return res.status(404).send("Not Found");
    
        const respPassword = bcrypt.compareSync(bodyUser.password, respBodyUser.password)
        if (!respPassword) return res.status(401).send("Unauthorized");
            
        
        if(respBodyUser && respPassword){
            console.log("usuario logado", respBodyUser);
            const token = uuid();
    
            const sessao = {
                token,
                userId: respBodyUser._id
            };
    
            await db.collection("sessoes").insertOne(sessao);
            return res.send(token);
        }
    
           return res.status(401).send("Email e senha incompativeis");
    } 
    catch (error) { 
        return res.status(500).send(error.message);   
    }
    };