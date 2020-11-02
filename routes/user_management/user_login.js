const express = require('express');
const router = express.Router();
const knex = require('../../helper/knex');
const Joi = require('joi');



//user login validation fuction
const userAuthentication = async (req,res)=>{

    //joi validation schema for login data
    const authSchema = Joi.object({
        phone_number : Joi
                        .number()
                        .required()
                        .min(999999999)
                        .max(9999999999),

        password: Joi.string().required()
    
    })
    try{

        const result = await authSchema.validateAsync(req.body)

        const isUserExist = await knex('user_details')
                                            .select('*')
                                            .where("phone_number",result.phone_number)
                                            .andWhere('password', result.password)
                                            .limit(1)
            console.log(isUserExist)
            if(isUserExist.length<1){
                throw new Error('invalid username or Password'); 
            }
            
            else{

                res.status(200).json({
                    meta: {
                        status: '1',
                        message: `Hello ${isUserExist[0].first_name}.`
                    },
                    
                });

                res.end()
                
            }
    }
    catch(err) {
        res.status(401).json({
            meta: {
                status: '0',
                message: `${err}`
            },
            
        });        
      }
      res.end()
    

}
router.get('/Login',userAuthentication);

module.exports =router;