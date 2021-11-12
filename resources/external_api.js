'use strict'

const got = require("got");

async function requestCurrencyConverter(currencyFrom,currencyTo)
{
    const  apiKey = "27236e571a4eab261bc1";
    currencyFrom = encodeURIComponent(currencyFrom);
    currencyTo = encodeURIComponent(currencyTo);
    var query = currencyFrom + '_' + currencyTo;
 
    const CURRENCY_API_URL = 'https://free.currconv.com/api/v7/convert?q=&compact=ultra&apiKey=';

    /*var options = {
        method: "GET",
        url: CURRENCY_API_URL
    };*/
    const apiResponse = await got(CURRENCY_API_URL,{searchParams:{q:`${query}`,compact:"ultra",apiKey:`${apiKey}`}});

    return apiResponse;
};

module.exports = { requestCurrencyConverter };
