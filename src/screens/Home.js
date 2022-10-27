import React from 'react';
import { Context } from "../Context.js";
import { useState } from 'react';
import Header from '../components/Header';
import Converter from '../components/Converter';

function Home() {

    const [usdRate, setUsdRate] = useState(0);
    const setusdRate = (rate) => setUsdRate(rate);

    const [eurRate, setEurRate] = useState(0);
    const seteurRate = (rate) => setEurRate(rate);

    return (
        <>
            <Context.Provider value={{ usdRate: usdRate, setusdRate: setusdRate, eurRate: eurRate, seteurRate: seteurRate}}>
                <Header />
                <Converter />
            </Context.Provider>
        </>
    )
}

export default Home;
