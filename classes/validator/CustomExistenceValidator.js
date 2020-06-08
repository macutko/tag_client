import axiosConfig from "../../constants/axiosConfig";

export class CustomExistenceValidator {
    constructor(){
    }

    static validate = (field_name, text) => {
        const data = {
            [field_name]: text
        }

        return new Promise((resolve, reject) => {
            axiosConfig.get('/users/exists', {
                params: {
                    ...data
                }
            }).then(response => {
                resolve(response.data)
            }).catch(error => {
                console.log(error)
            })
        })

    }
}
