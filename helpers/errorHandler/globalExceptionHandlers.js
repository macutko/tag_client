import {setJSExceptionHandler, setNativeExceptionHandler} from "react-native-exception-handler";
import {axiosInstance} from "../connectionInstances";


const JS_EXCEPTION = "JS_EXCEPTION_CLIENT"
const NATIVE_EXCEPTION = "NATIVE_EXCEPTION_CLIENT"

const createErrorObject = (l, errorDesc, isFat) => {
    return {
        label: l,
        description: errorDesc,
        isFatal: isFat
    }
}

export const JSExceptionHandler = (error, componentStack) => {
    const err = createErrorObject(JS_EXCEPTION, error.stack, true)
    handleError(err);
}

setJSExceptionHandler((error, isFatal) => {
    const err = createErrorObject(JS_EXCEPTION, error, isFatal)
    handleError(err);
}, true);

setNativeExceptionHandler(errorString => {
    const err = createErrorObject(NATIVE_EXCEPTION, errorString, true)
    handleError(err);
});

const informDevTeam = (error) => {
    axiosInstance.post('/client-error/', {
        ...error
    }).then(response => {
        console.log('Dev team informed')
    }).catch(error => {
        console.log(error.response.data.message)
    })


}

const handleError = (error) => {
    if (error.description === undefined || error.description === "the componentWillUnmount method")
        return;
    informDevTeam(error)
};
