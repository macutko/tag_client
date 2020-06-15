import {axiosInstance} from "../connectionInstances";

export class CustomExistenceValidator {
    constructor(){
    }

    static validate = (field_name, text) => {
        const data = {
            [field_name]: text
        }

        return new Promise((resolve, reject) => {
            axiosInstance.get('/users/exists', {
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
