module.exports = function(minified) {
  var clayConfig = this;

  // Need to wait on EVENTS.AFTER_BUILD before manipulating
  clayConfig.on(clayConfig.EVENTS.AFTER_BUILD, function() {
		
		// This function set the min value of StartNight based on whats set in StartDay.
		function setNightInputMin() {
			var startDayInput = clayConfig.getItemByMessageKey('StartDay');
      var startNightInput = clayConfig.getItemByMessageKey('StartNight');
			
			if (startDayInput && startNightInput) {
				var dayValue = startDayInput.get();
				var nightValue = startNightInput.get();
				if (dayValue) {
					var dayMatch = String(dayValue).match(/^(\d+)/);
					if (dayMatch) {
						var dayHour = parseInt(dayMatch[1], 10);
						var minNightHour = (dayHour + 1) % 24;
						
						// We need the right string format, so we need to change it from 7 to 07:00 for example.
						var minNightString = (minNightHour < 10 ? '0' : '') + minNightHour + ':00';
						// Set the min value
						if (startNightInput.$element) {
							startNightInput.$element.select('input').set('min', minNightString);
						}
						
						// Check if the current value is below min
						if (nightValue){
							var nightMatch = String(nightValue).match(/^(\d+)/);
							if (nightMatch) {
								var nightHour = parseInt(nightMatch[1], 10);
								
								// If the night value is below or equal to the day, we set the value to the minimum
								if (nightHour <= dayHour) {
									startNightInput.set(minNightString);
								}
							}
						}
					}
				}
			}
		}
    
		// This function shows and hides several items based on whether the user wants a timed background.
    function toggleTimedSection() {
      var bgTimedToggle = clayConfig.getItemByMessageKey('BGTimed');
      var timedBGHeading = clayConfig.getItemById('timedBGHeading');
      var startDayInput = clayConfig.getItemByMessageKey('StartDay');
      var startNightInput = clayConfig.getItemByMessageKey('StartNight');
			var bgDarkToggle = clayConfig.getItemByMessageKey('BGDark');

      if (bgTimedToggle && timedBGHeading && startDayInput && startNightInput) {
        if (bgTimedToggle.get()) {
          timedBGHeading.show();
          startDayInput.show();
          startNightInput.show();
					// If using the Day/Night input, hide the dark toggle as its now done based on time inputs.
					bgDarkToggle.hide();
					// Fire up setNightInputMin so startNightInput has the right min value
					setNightInputMin();
        } else {
          timedBGHeading.hide();
          startDayInput.hide();
          startNightInput.hide();
					// And when not using the Day/Night input, show the dark background toggle again.
					bgDarkToggle.show();
        }
      }
    }
		
		// This function shows and hides the interval input and camper select based on the value of the UseRandomCamper toggle.
		function toggleRandomCamperIntervalInput() {
			var randomToggle = clayConfig.getItemByMessageKey('UseRandomCamper');
			var camperInput = clayConfig.getItemByMessageKey('Camper');
			var intervalInput = clayConfig.getItemByMessageKey('RandomCamperInterval');
			
			if (randomToggle) {
				if (randomToggle.get()) {
					// Random camper is true, so show the interval and hide the camper selector.
					intervalInput.show();
					camperInput.hide();					
				} else {
					// And the other way around
					intervalInput.hide();
					camperInput.show();
				}
			}
		}
		
		// This function shows and hides the text color options based on the value of the AutoTextColor toggle.
		function toggleTextColorSettings(){
			var autoTextToggle = clayConfig.getItemByMessageKey('AutoTextColor');
			var timeColorInput = clayConfig.getItemByMessageKey('TimeColor');
			var dateColorInput = clayConfig.getItemByMessageKey('DateColor');
			
			if (autoTextToggle){
				if (autoTextToggle.get()) {
					// Auto Text color is true, so hide the TimeColor and DateColor inputs
					timeColorInput.hide();
					dateColorInput.hide();
				} else {
					// The other way around
					timeColorInput.show();
					dateColorInput.show();
				}
			}
		}

    // Execute as soon as possible so the settings are correct.
    toggleTimedSection();
		toggleRandomCamperIntervalInput();
		toggleTextColorSettings();

    // Listen to changes on the toggle switch, and fire the function to show and hide the right settings.
    var bgTimedToggle = clayConfig.getItemByMessageKey('BGTimed');
    if (bgTimedToggle) {
      bgTimedToggle.on('change', toggleTimedSection);
    }
		
		// Listen to changes on the startDayInput to change startNightInput min value.
		var startDayInput = clayConfig.getItemByMessageKey('StartDay');
    if (startDayInput) {
      startDayInput.on('change', setNightInputMin);
    }
		
		// Listen to changes on the Random Camper toggle, and fire the function to show or hide the interval input and Camper select.
		var randomToggle = clayConfig.getItemByMessageKey('UseRandomCamper');
		if (randomToggle) {
			randomToggle.on('change', toggleRandomCamperIntervalInput);
		}
		
		// Listen to changes on the Auto Text Color toggle, and fire the function to show or hide the text color inputs.
		var autoTextToggle = clayConfig.getItemByMessageKey('AutoTextColor');
		if (autoTextToggle) {
			autoTextToggle.on('change', toggleTextColorSettings);
		}
  });
};
