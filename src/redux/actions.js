import { BASE_RATES } from "./types";

export function setBaseRates(base_rates) {
    return {
        type: BASE_RATES,
        data: base_rates
    }
}