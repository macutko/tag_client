import {getValidateFieldStrategyFactory} from "./ValidateFieldStrategy";

export class CustomFieldValidator {
    constructor(){
    }

    static validate = (field_name, text) => {
        const validateStrategyFactory = getValidateFieldStrategyFactory()
        const strategy = validateStrategyFactory.create(field_name);
        return strategy.validateText(text)
    }
}
