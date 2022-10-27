import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { Context } from "../Context";

function Converter() {

    // utility objects for actions. there are here because of small size, but actually must be in separate files
    const currencyArray = ['UAH', 'USD', 'EUR'];
    const currencyCodes = {
        'USD': 840,
        'EUR': 978,
        'UAH': 980
    }

    // using context for passing exchange rates to header component
    const context = useContext(Context);

    // variables for working with the api
    const [apiResponse, setApiResponse] = useState('');
    const [apiError, setApiError] = useState(false);

    // variables for working with the converter
    const [convertRate, setConvertRate] = useState(0);
    const [firstCurrency, setFirstCurrency] = useState('USD');
    const [secondCurrency, setSecondCurrency] = useState('UAH');
    const [inputFirst, setInputFirst] = useState(1);
    const [inputSecond, setInputSecond] = useState(1);
    const [inputNumberChange, setInputNumberChange ] = useState(0);

    // making request to api when first start an app
    useEffect(() => {
        fetch('https://api.monobank.ua/bank/currency', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(resp => resp.json())
        .then(resp => {
            if (resp.errorDescription) {
                setApiError(true); 
            } else {
                setApiError(false); 
                setApiResponse(resp); 
                context.setusdRate(resp[0]['rateSell']);
                context.seteurRate(resp[1]['rateSell']);
                setInputSecond(resp[0]['rateSell']);
            }
        })
        .catch(error => console.log(error))  
    }, [])

    // calculation of exchange rate based on api response and selected currencies in 'select' elements
    useEffect(() => {
        getRate(firstCurrency, secondCurrency)
        setConvertRate(getRate(firstCurrency, secondCurrency));
    }, [firstCurrency, secondCurrency])

    // recalculation of input values when one of currency is changed by user
    useEffect(() => {
        if (inputNumberChange === 1) {
            setInputFirst(inputFirst)
            setInputSecond((inputFirst * convertRate).toFixed(2))
        } else if (inputNumberChange === 2) {
            setInputSecond(inputSecond)
            setInputFirst((inputSecond / convertRate).toFixed(2))
        }
    }, [convertRate])

    // function of exchange rate calculation
    function getRate(curA, curB) {
        const codeA = currencyCodes[curA];
        const codeB = currencyCodes[curB];
        let rate = 0;
        let currencyPairObj = {}
        for (let item of apiResponse) {
            if ((item.currencyCodeA === codeA || item.currencyCodeB === codeA) && (item.currencyCodeA === codeB || item.currencyCodeB === codeB)) {
                if (Object.keys(item).includes('rateSell')) {
                    rate = item.rateSell;
                } else if (Object.keys(item).includes('rateCross')) {
                    rate = item.rateCross;
                }
                currencyPairObj = item;
            }
        }
        if (codeA === currencyPairObj.currencyCodeB) {
            rate = 1 / rate;
        }
        return rate
    }


    // onChange functions for input and select elements

    const setFCurrency = (e) => {
        if (e.target.value === secondCurrency) {
            setFirstCurrency(e.target.value);
            setSecondCurrency(firstCurrency)
        } else {
            setFirstCurrency(e.target.value);
        }
        setInputNumberChange(1);
    }

    const setSCurrency = (e) => {
        if (e.target.value === firstCurrency) {
            setSecondCurrency(e.target.value);
            setFirstCurrency(secondCurrency);
        } else {
            setSecondCurrency(e.target.value);
        }
        setInputNumberChange(2);
    }

    const setFirstInpVal = (e) => {
        setInputFirst(e.target.value);
        setInputSecond((e.target.value * convertRate).toFixed(2))
    }

    const setSecondInpVal = (e) => {
        setInputSecond(e.target.value);
        setInputFirst((e.target.value / convertRate).toFixed(2))
    }


    if (apiError) {
        return(
            <>
                <div className="col-lg-6 offset-lg-3 col-12">
                    <div className="row text-center header-rates">
                        <h1>429 Error. Too many requests to api. Try later.</h1>
                    </div>
                </div>
            </>
        )
    } else {
        return(
            <>
                <div className="col-lg-6 offset-lg-3 col-12">
                    <div className="row text-center header-rates">
                        <h1>Currency Converter</h1>
                        
                        <div className="col-12">
                            <div className="row input-group-row">
                                <div className="col-8">
                                <input type="text" className="form-control" value={inputFirst} onChange={setFirstInpVal}/>
                                </div>
                                <div className="col-4">
                                    <select className="form-select" defaultValue={firstCurrency} onChange={setFCurrency}>
                                        <option value={firstCurrency}>{firstCurrency}</option>
                                        {currencyArray && currencyArray.map((currency, i) => {
                                            return (
                                                <React.Fragment key={i}>
                                                { currency !== firstCurrency ?
                                                    <option value={currency}>{currency}</option>
                                                :
                                                null
                                                }
                                                </React.Fragment> 
                                            )
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
    
                        <div className="col-12">
                            <div className="row input-group-row">
                                <div className="col-8">
                                <input type="text" className="form-control" value={inputSecond} onChange={setSecondInpVal}/>
                                </div>
                                <div className="col-4">
                                    <select className="form-select" defaultValue={secondCurrency} onChange={setSCurrency}>
                                        <option value={secondCurrency}>{secondCurrency}</option>
                                        {currencyArray && currencyArray.map((currency, i) => {
                                            return (
                                                <React.Fragment key={i}>
                                                { currency !== secondCurrency ?
                                                    <option value={currency}>{currency}</option>
                                                :
                                                null
                                                }
                                                </React.Fragment> 
                                            )
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
    
                    </div>
                </div>
            </>
        )
    } 


}

export default Converter;