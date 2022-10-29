import { useEffect, useState } from "react";

const useApi = (url) => {
    const [apiResponse, setApiResponse] = useState('');
    const [apiError, setApiError] = useState(false);
    const [initialSecondInput, setInitialSecondInput] = useState(0);

    const fetchApi = () => {
        fetch(url, {
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
                setInitialSecondInput(resp[0]['rateSell']);
            }
        })
        .catch(error => console.log(error))  
    };

    useEffect(() => {
        fetchApi();
    }, [url]);

    return {apiResponse, apiError, initialSecondInput};
}

export default useApi;

