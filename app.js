const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const TeleSignSDK = require('telesignsdk');

const customerId = "customer_id"; // Todo: find in portal.telesign.com
const apiKey = "dGVzdCBhcGkga2V5IGZvciBzZGsgZXhhbXBsZXM="; // Todo: find in portal.telesign.com
const rest_endpoint = "https://rest-api.telesign.com"; // Todo: Enterprise customer, change this!
const timeout = 10 * 1000; // 10 secs

const client = new TeleSignSDK(customerId,
    apiKey,
    rest_endpoint,
    timeout // optional
    // userAgent
);

const messageType = "ARN";

//especificamos el subdirectorio donde se encuentran las páginas estáticas
app.use(express.static(__dirname + '/public'));

//extended: false significa que parsea solo string (no archivos de imagenes por ejemplo)
app.use(bodyParser.urlencoded({
    extended: false
}));
//Función para enviar el mensaje 
app.post('/sms', (req, res) => {
    //Aqui capturamos los valores del formulario
    let phoneNumber = req.body.number;
    let message = req.body.sms;
    phoneNumber = parseInt(phoneNumber);
    console.log("## MessagingClient.message ##");

    function messageCallback(error, responseBody) {
        if (error === null) {
            console.log(`Messaging response for messaging phone number: ${phoneNumber}` +
                ` => code: ${responseBody['status']['code']}` +
                `, description: ${responseBody['status']['description']}`);
        } else {
            console.error("Unable to send message. " + error);
        }

    }
    //Llamamos a la función de Telesign
    client.sms.message(messageCallback, phoneNumber, message, messageType);

    //Damos confirmación de envío
    let pagina = '<!doctype html><html><head></head><body>';
    pagina += `<p>Mensaje enviado: ${phoneNumber} , ${message} </p>`;
    pagina += '</body></html>';
    res.send(pagina);
})

//Corremos el servidor en el puerto 8888
//Para acceder usar localhost:8888
var server = app.listen(8888, () => {
    console.log('Servidor web iniciado');
});










