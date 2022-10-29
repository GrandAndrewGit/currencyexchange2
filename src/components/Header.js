import React from 'react';
import { useSelector } from 'react-redux';

function Header() {

    const BasePairsRates = useSelector(state => {
        return state.baseRatesReducer.ratesObj
    })  

    return(
        <>  
            <div className="col-lg-8 offset-lg-2 col-12">
                <div className="row text-center header-rates">
                    <div className="col">USD/UAH {BasePairsRates['usdUah']}</div>
                    <div className="col">EUR/UAH {BasePairsRates['eurUah']}</div>
                </div>
            </div>
        </>
    )

}

export default Header;