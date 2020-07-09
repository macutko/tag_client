import * as React from "react";
import {UserObject} from "./UserObject";


export class CurrentUserObject extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <UserObject {...this.props} />
        )
    }
}

