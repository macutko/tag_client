import {getValidateStrategyFactory, validateStrategyFactory} from "./ValidateStrategy";

export class CustomFieldValidator {
    constructor(){
    }

    static validate = (field_name, text) => {
        const validateStrategyFactory = getValidateStrategyFactory()
        const strategy = validateStrategyFactory.create(field_name);
        return strategy.validateText(text)
    }
}
