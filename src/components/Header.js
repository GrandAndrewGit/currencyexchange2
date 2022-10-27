import React from 'react';
import { Context } from "../Context";
import { useContext } from "react";

function Header() {

    const context = useContext(Context);

    return(
        <>  
            <div className="col-lg-8 offset-lg-2 col-12">
                <div className="row text-center header-rates">
                    <div className="col">USD/UAH {context.usdRate}</div>
                    <div className="col">EUR/UAH {context.eurRate}</div>
                </div>
            </div>
        </>
    )

}

export default Header;