// Global variables
var client       = null;
var led_is_on    = null;
// These are configs	
var hostname       = "broker.hivemq.com";
var port           = "8000";
var clientId       = "mqtt_js_" + parseInt(Math.random() * 100000, 10);
// var temp_topic     = "home/outdoors/temperature";
// var humidity_topic = "home/outdoors/humidity";
// var status_topic   = "home/outdoors/status";

var req_data = "srdl/req_info";
var get_data = "srdl/info";


// This is called after the webpage is completely loaded
// It is the main entry point into the JS code
function connect(){
	// Set up the client
	client = new Paho.MQTT.Client(hostname, Number(port), "40559506950");
	console.info('Connecting to Server: Hostname: ', hostname, 
			'. Port: ', port, '. Client ID: ', clientId);

	// set callback handlers
	client.onConnectionLost = onConnectionLost;
	client.onMessageArrived = onMessageArrived;

	// see client class docs for all the options
	var options = {
		onSuccess: onConnect, // after connected, subscribes
		onFailure: onFail     // useful for logging / debugging
	};
	// connect the client
	client.connect(options);
	console.info('Connecting...');
}


function onConnect(context) {
	console.log("Client Connected");
    // And subscribe to our topics	-- both with the same callback function
	options = {qos:2, onSuccess:function(context){ console.log("subscribed"); } }
	// client.subscribe(temp_topic, options);
	// client.subscribe(humidity_topic, options);
	// client.subscribe(status_topic, options);
	client.subscribe(get_data,options);
}

function onFail(context) {
	console.log("Failed to connect");
}

function onConnectionLost(responseObject) {
	if (responseObject.errorCode !== 0) {
		console.log("Connection Lost: " + responseObject.errorMessage);
		window.alert("Someone else took my websocket!\nRefresh to take it back.");
	}
}

// Here are the two main actions that drive the webpage:
//  handling incoming messages and the toggle button.

// Updates the webpage elements with new data, and 
//  tracks the display LED status as well, 
//  in case multiple clients are toggling it.
function onMessageArrived(message) {
	console.log(message.destinationName, message.payloadString);

	// Update element depending on which topic's data came in
	if (message.destinationName == get_data){ 
		var msg = document.getElementById("json_display");
		msg.innerHTML = "Data: " + message.payloadString;
	} 
}

// Provides the button logic that toggles our display LED on and off
// Triggered by pressing the HTML button "status_button"
function data(){
	
	
var message = new Paho.MQTT.Message("1");
message.destinationName = req_data;
message.qos = 2;
message.retained = false;

client.send(message);
console.info('sending: ', message);

}



