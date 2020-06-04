import GLOBAL_VAR from '../../constants/Global'

class ValidateStrategyFactory {
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
class ValidateStrategy {
    validateText = (text) => {};
}

class ValidateEmail  extends ValidateStrategy {
    validateText = (text) => {
        let emailError = ""
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text) === false) {
            emailError = "Email is not correct"
        }
        return {emailError}
    }
}

class ValidatePassword extends ValidateStrategy {
    validateText = (text) => {
        let passwordError = ""
        let reg= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (reg.test(text) === false) {
            passwordError = "Password must contain minimum eight characters, at least one uppercase letter, " +
                "one lowercase letter and one number"
        }
        return {passwordError}
    }
}

class ValidateGeneralTextInput extends ValidateStrategy {
    constructor (field_name) {
        super();
        this.field_name = field_name
    }
    validateText = (text) => {
        const errorAttribute = this.field_name + "Error"
        let textInputError = ""
        if (text.length <= 0) {
            textInputError = "Field must have at least 1 character"
        }
        return {[errorAttribute]: textInputError}
    }
}

class ValidateWhatever extends ValidateStrategy {
    validateText = (text) => {
        return {}
    }
}

const validateStrategyFactory = new ValidateStrategyFactory();
export const getValidateStrategyFactory = () => validateStrategyFactory;
