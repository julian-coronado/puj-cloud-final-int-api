'use strict';

/**
 * Headers to send back to client
 */
 const apiConverter = require('./resources/external_api');

 const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, HEAD, OPTIONS'
}
/*
 * Function to send response to client
 * @param statusCode {number}
 * @param body {*}
 * @returns {{statusCode: *, headers: string, body: *}}
 */

 const sendResponse = (statusCode, body) => {
  const response = {
    statusCode: statusCode,
    headers: headers,
    body: body
  }
return response
}

module.exports.currencyConverter = async (event, context) => {
  try {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    if (event.queryStringParameters.currencyFrom === undefined || event.queryStringParameters.currencyTo === undefined 
      || event.queryStringParameters.amount === undefined) {
        return sendResponse(400, JSON.stringify({message:'Invalid Input'}));
    }

    var response = {};
    response.currencyFrom = event.queryStringParameters.currencyFrom;
    response.currencyTo = event.queryStringParameters.currencyTo;
    response.amount = Number(event.queryStringParameters.amount);
    const regExpCurrency = /[A-Z]{3}/;

    if(isNaN(event.queryStringParameters.amount)){
      return sendResponse(400, JSON.stringify({message:'Invalid amount'}));
    }

    if(regExpCurrency.test(event.queryStringParameters.currencyFrom)==false){
      return sendResponse(400, JSON.stringify({message:'Invalid CurrencyFrom'}));    
    }

    if(regExpCurrency.test(event.queryStringParameters.currencyTo)==false){
      return sendResponse(400, JSON.stringify({message:'Invalid CurrencyTo'}));
    }

    var apiResponse = await apiConverter.requestCurrencyConverter(response.currencyFrom,response.currencyTo);
    var jsonResult = JSON.parse(apiResponse.body);
    var indexResponse = `${response.currencyFrom}_${response.currencyTo}`;
    
    if(!Object.keys(jsonResult).length){
      return sendResponse(400, JSON.stringify({message:'Invalid currencies'}));
    }
    var convertRate = Number(jsonResult[indexResponse]);

    if(isNaN(jsonResult[indexResponse])){
      return sendResponse(400, JSON.stringify({message:'Invalid External API Response'}));;
    }

    var result = Math.round(convertRate * response.amount,-2);

  } catch (error) {
    console.log(error);
    return sendResponse(400, JSON.stringify({message:`${error}`})); 
  }

  return sendResponse(200,JSON.stringify({message:`Converting ${response.amount} ${response.currencyFrom} to ${response.currencyTo}`,value:`${result}`}));

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
