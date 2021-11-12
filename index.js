//import apiConverter from './resources/external_api';
const apiConverter = require('./resources/external_api');

(async () => 
{
    
    try {
        var apiResponse = await apiConverter.requestCurrencyConverter('USD','COP');
        var jsonResult = JSON.parse(apiResponse.body);
        var index = 'USD'+'_'+'COP';
        
        if(!Object.keys(jsonResult).length){
            console.log("no data found");
        }
        else
            console.log(`respuesta de la api:${jsonResult[index]}`);

    } catch (error) {
        console.log(error)
    }
    
})();