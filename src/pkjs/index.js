var Clay = require('@rebble/clay');
var clayConfig = require('./config');
var customClayLogic = require('./custom-clay'); // Custom Clay function, mostly manipulation of the view
var messageKeys = require('message_keys'); // Needed to address message keys

// Initialize Clay with the custom logic
var clay = new Clay(clayConfig, customClayLogic, { autoHandleEvents: false }); // Because we need to manipulate a few values before saving, we need our own webviewclosed event.

// As a side effect of using autoHandleEvents: false, we need our own showConfiguration listener to generate the url
Pebble.addEventListener('showConfiguration', function(e) {
  Pebble.openURL(clay.generateUrl());
});

// Execute the manipulation of settings when the webview is closed.
Pebble.addEventListener('webviewclosed', function(e) {
  if (e && e.response) {
    var settings = clay.getSettings(e.response); // The settings we need to save after manipulation
    
    // Grab the time-strings
    var dayData = settings[messageKeys.StartDay];
    var nightData = settings[messageKeys.StartNight];
    
    var dayHour = 6;
    var nightHour = 18;
    
    // Grab the hours from the strings and turn them into integers.
    if (dayData !== undefined && dayData !== null) {
      var dayMatch = String(dayData).match(/^(\d+)/);
      if (dayMatch) { dayHour = parseInt(dayMatch[1], 10); }
    }
    
    if (nightData !== undefined && nightData !== null) {
      var nightMatch = String(nightData).match(/^(\d+)/);
      if (nightMatch) { nightHour = parseInt(nightMatch[1], 10); }
    }
    
    // Incase nightHour lies below or is equal to dayHour, set nightHour to dayHour+1. The modulo is a failsafe so we don't get invalid values.
    if (nightHour <= dayHour) {
      nightHour = (dayHour + 1) % 24;
    }
    
    // Overwrite the strings with our integers.
    settings[messageKeys.StartDay] = dayHour;
    settings[messageKeys.StartNight] = nightHour;
    
    // Send the settings to the Pebble, to be handled by inbox_received_callback().
    Pebble.sendAppMessage(settings, function() {
      console.log('Sent config data to the Pebble!');
    }, function(error) {
			console.log('Failed to send config data!');
      console.log(JSON.stringify(error));
    });
  }
});

Pebble.addEventListener('ready', function(e) {
  console.log('PebbleKit JS ready!');
});

Pebble.addEventListener('appmessage', function(e) {
  console.log('AppMessage received!');
});
