import GLOBAL_VAR from '../../constants/Global'

class ValidateFieldStrategyFactory {
    constructor() {
    }

    create = (field_name) => {
        if (field_name === GLOBAL_VAR.FIELD_NAME.EMAIL) {
            return new ValidateEmail();
        } else if (field_name === GLOBAL_VAR.FIELD_NAME.PASSWORD) {
            return new ValidatePassword();
        } else if (field_name === GLOBAL_VAR.FIELD_NAME.USERNAME || field_name === GLOBAL_VAR.FIELD_NAME.FIRSTNAME
        || field_name === GLOBAL_VAR.FIELD_NAME.LASTNAME) {
            return new ValidateGeneralTextInput(field_name);
        }
        return new ValidateWhatever();
    }
}

//abstract class
class ValidateFieldStrategy {
    validateText = (text) => {};
}

class ValidateEmail  extends ValidateFieldStrategy {
    validateText = (text) => {
        let emailError = ""
        let isValid = true
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text) === false) {
            emailError = "Email is not correct"
            isValid = false
        }
        return {emailError, isValid}
    }
}

class ValidatePassword extends ValidateFieldStrategy {
    validateText = (text) => {
        let passwordError = ""
        let isValid = true
        let reg= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (reg.test(text) === false) {
            passwordError = "Password must contain minimum eight characters, at least one uppercase letter, " +
                "one lowercase letter and one number"
            isValid = false
        }
        return {passwordError, isValid}
    }
}

class ValidateGeneralTextInput extends ValidateFieldStrategy {
    constructor (field_name) {
        super();
        this.field_name = field_name
    }
    validateText = (text) => {
        const errorAttribute = this.field_name + "Error"
        let textInputError = ""
        let isValid = true
        if (text.length <= 0) {
            textInputError = "Field must have at least 1 character"
            isValid = false
        }
        return {[errorAttribute]: textInputError, isValid}
    }
}

class ValidateWhatever extends ValidateFieldStrategy {
    validateText = (text) => {
        return {}
    }
}

const validateStrategyFactory = new ValidateFieldStrategyFactory();
export const getValidateFieldStrategyFactory = () => validateStrategyFactory;
