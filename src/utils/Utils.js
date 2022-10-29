    
// function of exchange rate calculation
export function getRate(curA, curB, currencyCodesObj, apiResponseObj) {
    const codeA = currencyCodesObj[curA];
    const codeB = currencyCodesObj[curB];
    let rate = 0;
    let currencyPairObj = {}
    for (let item of apiResponseObj) {
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