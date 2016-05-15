var https = require('https');

exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.c2f5b1ec-4b63-4c01-8285-54508ea2c22c") {
             context.fail("Invalid Application ID");
        }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("MyColorIsIntent" === intentName) {
		getFood(intent, session, callback);
    } else if ("WhatsMyColorIntent" === intentName) {
		getFood(intent, session, callback);
    } else if ("FoodIntent" === intentName) {
		getFood(intent, session, callback);
    } else if ("FoodOnlyIntent" === intentName) {
		getFood(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        getWelcomeResponse(callback);
    } else if ("AMAZON.StopIntent" === intentName || "AMAZON.CancelIntent" === intentName) {
        handleSessionEndRequest(callback);
    } else {
        throw "Invalid intent";
    }
}

function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to nutrition facts. " +
        "Please tell me what food item you would like me to look up.";
    var repromptText = "Please tell me what food item you'd like me to look up.";
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    var cardTitle = "Session Ended";
    var speechOutput = "Happy eating, or not ... depending!";
    var shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}


function getFood(intent, session, callback) {
	console.log("getFood");
	var food = intent.slots.Food.value;
	getJson(food, function (response) {
		
		var sessionAttributes = {};
		var cardTitle = "Food Results";
		var repromptText = "";
		var shouldEndSession = false;
        var speechText = "in "+response[1]+" "+response[2]+" of "+food+" there are "+response[0]+" calories, "+response[3]+" from fat.";
        sessionAttributes.text = speechText;
        session.attributes = sessionAttributes;
        if (response.length == 0) {
            speechText = "There is a problem connecting at this time. Please try again later.";
            cardContent = speechText;
        }         
		
		callback(sessionAttributes,
			buildSpeechletResponse(cardTitle, speechText, repromptText, shouldEndSession));
    });	
}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

function getJson(food, eventCallback) {
    var url = "https://api.nutritionix.com/v1_1/search/";
	url += food;
	url += "?results=0%3A5&cal_min=0&cal_max=50000&fields=item_name%2Cbrand_name%2Citem_id%2Cbrand_id%2Cnf_calories%2Cnf_calories_from_fat&appId=d6955eae&appKey=563ddcbdad8264f7ddb96d77ed44d18b"

    https.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var stringResult = parseJson(body);
            eventCallback(stringResult);
        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
    });
}

function parseJson(result) {
	result = JSON.parse(result);
	var calories = result.hits[0].fields.nf_calories;
	var ssq = result.hits[0].fields.nf_serving_size_qty;
	var ssu = result.hits[0].fields.nf_serving_size_unit;
	var fromfat = result.hits[0].fields.nf_calories_from_fat;
    return [calories, ssq, ssu, fromfat];
}
