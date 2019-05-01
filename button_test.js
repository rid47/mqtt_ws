// Global variables
var client       = null;

var online_device_counter=0;
var online_idle_device_counter=0;
var offline_device_counter=0;
var total_device_counter = 0;


// var last_online_device_counter=0;
// var last_online_idle_device_counter=0;
// var last_offline_device_counter=0;



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
	
	console.log(message.payloadString);
	if (message.destinationName == get_data){ 
		
		var text = message.payloadString;
		var obj = JSON.parse(text, function (key, value) {
  		if (key == "status" && value =="online") {
  		console.log(online_device_counter);
  		online_device_counter++;
  		console.log(online_device_counter);
  		}

  		//console.log("I've received online message");
  		

  		else if (key == "status" && value =="online_idle") {
  		console.log(online_idle_device_counter);
  		online_idle_device_counter++;
  		console.log(online_idle_device_counter);
  		
		}

  		});}
	

var online_device = document.getElementById("Online");
online_device.innerHTML = "Online: " + online_device_counter;

var online_idle_device = document.getElementById("Online_idle");
online_idle_device.innerHTML = "Online Idle: " + online_idle_device_counter;



if ((online_device_counter+online_idle_device_counter)>total_device_counter){

total_device_counter = online_device_counter + online_idle_device_counter;

}



//Counting total devices and offline devices

total_device_counter = online_device_counter + online_idle_device_counter + offline_device_counter;



offline_device_counter = total_device_counter - (online_device_counter + online_idle_device_counter );

var offline_device = document.getElementById("Offline");
offline_device.innerHTML = "Offline: " + offline_device_counter;



var total_device = document.getElementById("Total");
total_device.innerHTML = "Total: " + total_device_counter;


} 







// Provides the button logic that toggles our display LED on and off
// Triggered by pressing the HTML button "status_button"

function data(){
	
online_device_counter=0;
online_idle_device_counter=0;
offline_device_counter=0;
	
var message = new Paho.MQTT.Message("1");
message.destinationName = req_data;
message.qos = 2;
message.retained = false;

client.send(message);
console.info('sending: ', message);





}



