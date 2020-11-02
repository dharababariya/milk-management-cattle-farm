const express = require('express');
const router = express.Router();
const knex = require('../../helper/knex');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

const userRegistration = async (req,res)=>{
    const authSchema = Joi.object(
        {
        phone_number : Joi
                        .number()
                        .required()
                        .min(999999999)
                        .max(9999999999),
        password: Joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)),
        first_name : Joi.string().required(),
        last_name: Joi.string().required(),
        address : Joi.string().required(),
        role : Joi.string()

    })
    
    try{
        let receiveData ={
            phone_number : req.body.phone_number,
            password : req.body.password, 
            first_name : req.body.first_name, 
            last_name : req.body.last_name, 
            address : req.body.address, 
            role : req.body.role
        }
        console.log(receiveData)      

        await authSchema.validateAsync(receiveData)

        const isUserExist = await knex('public.user_details')
                                            .select('*')
                                            .where("phone_number",receiveData.phone_number)
        
            if(isUserExist.length==0){
                receiveData.id=uuidv4();
                await knex('user_details').insert(receiveData)

                res.status(200).json({
                    meta: {
                        status: '1',
                        message: `Registration sucsessful `
                    },
                    
                });

                res.end() 
            }
            
            else{
                throw new Error(" registratiion unsucsessfull")               
                
            }
    }
    catch(err) {
        res.status(401).json({
            meta: {
                status: '0',
                message: `${err}`
            },
            
        });
        res.end()        
      }
}

router.post('/Registration',userRegistration)

module.exports =router;