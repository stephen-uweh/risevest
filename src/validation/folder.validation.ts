import * as Joi from 'joi';

export function validateCreateFolder(folder:any){
    const schema = Joi.object().keys({
        name: Joi.string().label("Folder Name").required()
    });
    return schema.validate(folder);
}