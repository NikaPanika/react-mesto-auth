import React from "react";
import Entrance from "./Entrance";

function Login({ title, formName, buttonName, onSubmit, isLoading }) {

    return (
        <Entrance
            title={title}
            formName={formName}
            buttonName={buttonName}
            onSubmit={onSubmit}
            isLoading={isLoading} />
    )
}

export default Login;