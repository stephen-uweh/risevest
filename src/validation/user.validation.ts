import * as Joi from 'joi';

export function validateCreateUser(user){
    const schema = Joi.object().keys({
        firstName: Joi.string().label("First Name").required(),
        lastName: Joi.string().label("Last Name").required(),
        email: Joi.string().email().label("Email").required(),
        password: Joi.string().label("Password").required()
    })
    return schema.validate(user)
}