import { BASE_RATES } from "./types"

const initialState = {
    ratesObj: {
        'usdUah': 0,
        'eurUah': 0
    },
}

export const baseRatesReducer = (state = initialState, action) => {
    switch(action.type){
        case BASE_RATES:
            return {
                ...state,
                ratesObj: action.data
            }

        default:
            return state;
    }
}