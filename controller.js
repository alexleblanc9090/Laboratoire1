const url = require('url');

const ALL_VALID_OPERATOR = ["+"," ","-","*","/","%","!","p","np"];
const OPERATOR_USING_N_PARAM = ["!","p","np"]

//----------------------------- MÉTHODES EXPORTÉES --------------------------------------------------------

exports.executeRequest = function(req, res){

    var obj = url.parse(req.url, true).query;
    var tab = Object.keys(obj);
    var messageErreur = "";

    var value = null;
    
    if(QueryIsEmpty(tab))
    {
        messageErreur += "Il n'y a aucun paramètres à votre requête. ";
    }
    else{
        if(!QueryContainsOperator(tab))
            messageErreur += "Le paramètre d'opérateur est inexistant. "
        else{
            var respond = ExecuteOperations(obj['op'],obj);
        }    
    }
    if(messageErreur == "")
        res.end(JSON.stringify(respond));
    else{
        res.end(JSON.stringify(messageErreur));
    }
}


exports.invalidUrl = function (req, res) {
    var response = [
        {
            "message": "Endpoint incorrect. Les options possibles sont "
        },
        availableEndpoint
    ]
    res.statusCode = 404;
    res.setHeader('content-Type', 'Application/json');
    res.end(JSON.stringify(response))
}

exports.showFormula() = function()
{
    res.statusCode = 200;
    res.setHeader('content-Type', 'Application/json');

    const formulas = 
    {
        Addition : "api/math?op=+&x=50&y=25",
        Soustraction : "api/math?op=-&x=50&y=25",
        Multiplication : "api/math?op=*&x=50&y=25",
        Divisiom : "api/math?op=/&x=50&y=25",
        Modulo : "api/math?op=%&x=50&y=7",
        Fractionnel : "api/math?op=!&n=5",
        Premier : "api/math?op=p&n=5",
        TrouverPremier : "api/math?op=np&n=5"
    };

    res.end(JSON.stringify(formulas));


}

//------------------------------------- MÉTHODE -------------------------------------------
const availableEndpoint = [
    {
        method: "GET",
        maths: "/api/maths"
    }
]

function ExecuteOperations(op, object)
{
    var error = "";
    var respond = null;
    var arrayOfKeys = Object.keys(object);

    if(ALL_VALID_OPERATOR.includes(op))
    {
        if(Object.keys(object).length == 1){return "Aucune valeurs est passé pour l'opération";}            
        else{
            if(!OPERATOR_USING_N_PARAM.includes(op))
            {

                error = validParamsTwoEntries(object);


                    if(arrayOfKeys.length == 3 && arrayOfKeys.includes("x") && arrayOfKeys.includes("y") && error == "")
                    {
                        switch(op)
                        {
                            case " ": 
                                respond = {op : "+",x : object['x'], y : object['y'], value : parseInt(object['x']) + parseInt(object['y'])};
                                break;
                            case "-":
                                respond = {op : "+",x : object['x'], y : object['y'], value : parseInt(object['x']) - parseInt(object['y'])};;      
                                break;
                            case "*":
                                respond = {op : "+",x : object['x'], y : object['y'], value : parseInt(object['x']) * parseInt(object['y'])};
                                break;
                            case "/":
                                respond = respond = {op : "+",x : object['x'], y : object['y'], value : parseInt(object['x']) / parseInt(object['y'])};
                                break;
                            case "%":
                                respond = respond = {op : "+",x : object['x'], y : object['y'], value : parseInt(object['x']) % parseInt(object['y'])};;
                                break;
                        }
                    }
                    else
                    {
                        object["error"] = error;
                        if(object["op"] == " ")
                            object["op"] = "+";
                        respond = object;
                    }              
            }
            else{
                error = validParamsOneEntries(object);
                if(arrayOfKeys.length == 2 && arrayOfKeys.includes("n")&& error == "")  
                {
                    switch(op)
                    {
                        case "!":
                            respond = {op : "!",n : object['n'], value : parseInt(CalculateFactorial(object['n']))};
                            break;
                        case "p":
                            respond = {op : "p",n : object['n'], value : isPrime(object['n'])};
                            break;
                        case "np":
                            respond = {op : "p",n : object['n'], value : findPrimeValue(object['n'])};
                            break;
                    }
                }
                else{
                    object["error"] = error;
                    respond = object;
                }

            }

            return respond;
        }
    }
    else{
        return  object["op"] +" n'est pas un opérateur valide.";
    }
}

//Inspiré d'internet.
function findPrimeValue(value) {

    //Trouver quelle est le "value" ième nombre prime qui existe.
    let primeValue = 0;

    for ( let i = 0; i < value; i++)
    {
        primeValue++;
        //Si c'est pas un nombre prime continue de compter...
        while (!isPrime(primeValue))
        {
            primeValue++;
        }
    }
    return primeValue;
}

//Trouvé sur stack overflow
function isPrime(num) {
    for(var i = 2; i < num; i++)
      if(num % i === 0) return false;
    return num > 1;
}

// Fonction trouvé sur internet.
function CalculateFactorial(value)
{
    if(value === 0 || value === 1)
        return 1;

    return value * CalculateFactorial(value -1)
}

function validParamsTwoEntries(object)
{
    var error = "";
    var arrayOfKeys = Object.keys(object);

    if(!arrayOfKeys.includes("x"))
        error += "x parameter is missing. ";

    if(!arrayOfKeys.includes("y"))
        error += "y parameter is missing. ";

    if(arrayOfKeys.length > 3)
        error += "Seulement x et y sont acceptés. ";

    if(arrayOfKeys.includes("x") && Number.isNaN(parseInt(object['x'])))
        error += "x n'est pas un nombre. ";

    if(arrayOfKeys.includes("y") && Number.isNaN(parseInt(object['y'])))
        error += "y n'est pas un nombre. ";

    return error;

}

function validParamsOneEntries(object)
{
    var error = "";
    var arrayOfKeys = Object.keys(object);

    if(!arrayOfKeys.includes("n"))
        error += "n parameter is missing. ";

    if(arrayOfKeys.length > 2)
        error += "Seulement le paramètre n est accepté pour cette opérations. ";

    if(arrayOfKeys.includes("n") && Number.isNaN(parseInt(object['n'])))
        error += "n n'est pas un nombre. ";

    return error;
}

function QueryIsEmpty(arrayOfParam)
{
    return arrayOfParam.length == 0 ? true : false;
}

function QueryContainsOperator(arrayOfParam)
{
    var found = false;
    arrayOfParam.forEach(key => {
        if(key == "op")
            found = true;
    });
    return found;
}