import React from 'react';
import { useEffect, useState } from 'react';
import { currencyArray, currencyCodes } from "../data/Data";
import useApi from '../hooks/useApi';
import { getRate } from "../utils/Utils";
import { useDispatch } from 'react-redux';
import { setBaseRates  } from '../redux/actions';



function Converter() {
    const dispatch = useDispatch();

    const {apiResponse, apiError, initialSecondInput} = useApi("https://api.monobank.ua/bank/currency");

    // variables for working with the converter
    const [convertRate, setConvertRate] = useState(0);
    const [firstCurrency, setFirstCurrency] = useState('USD');
    const [secondCurrency, setSecondCurrency] = useState('UAH');
    const [inputFirst, setInputFirst] = useState(1);
    const [inputSecond, setInputSecond] = useState(0);
    const [inputNumberChange, setInputNumberChange ] = useState(0);


    // calculation of exchange rate based on api response and selected currencies
    useEffect(() => {
        setConvertRate(getRate(firstCurrency, secondCurrency, currencyCodes, apiResponse));
        console.log('Effect is working again')
    }, [firstCurrency, secondCurrency, apiResponse])

    // set usd/uah and eur/uah rates into redux store
    useEffect(() => {
        let baseRatesObj = {};
        if (apiResponse) {
            baseRatesObj['usdUah'] = apiResponse[0]['rateSell'];
            baseRatesObj['eurUah'] = apiResponse[1]['rateSell'];
            dispatch(setBaseRates(baseRatesObj));
        }
        setInputSecond(initialSecondInput);
    }, [apiResponse])

    
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


    // onChange functions for input and select elements
    const setCurrency = (e) => {
        if (e.target.id === 'first-select') {
            if (e.target.value === secondCurrency) {
                setFirstCurrency(e.target.value);
                setSecondCurrency(firstCurrency)
            } else {
                setFirstCurrency(e.target.value);
            }
            setInputNumberChange(1);
        } else if (e.target.id === 'second-select') {
            if (e.target.value === firstCurrency) {
                setSecondCurrency(e.target.value);
                setFirstCurrency(secondCurrency);
            } else {
                setSecondCurrency(e.target.value);
            }
            setInputNumberChange(2);
        }
    }

    const setInputVal = (e) => {
        if (e.target.id === 'first-input') {
            setInputFirst(e.target.value);
            setInputSecond((e.target.value * convertRate).toFixed(2))
        } else if (e.target.id === 'second-input') {
            setInputSecond(e.target.value);
            setInputFirst((e.target.value / convertRate).toFixed(2))
        }
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
                                <input type="text" className="form-control" id='first-input' value={inputFirst} onChange={setInputVal}/>
                                </div>
                                <div className="col-4">
                                    <select className="form-select" id='first-select' defaultValue={firstCurrency} onChange={setCurrency}>
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
                                <input type="text" className="form-control" id='second-input' value={inputSecond} onChange={setInputVal}/>
                                </div>
                                <div className="col-4">
                                    <select className="form-select" id='second-select' defaultValue={secondCurrency} onChange={setCurrency}>
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