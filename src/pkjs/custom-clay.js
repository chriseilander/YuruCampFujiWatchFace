module.exports = function(minified) {
  var clayConfig = this;

  // Need to wait on EVENTS.AFTER_BUILD before manipulating
  clayConfig.on(clayConfig.EVENTS.AFTER_BUILD, function() {
		
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
						
						// Zorg voor geldige stringnotatie met voorloopnul (bijv. 7 -> "07:00")
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

    // Execute as soon as possible so the settings are correct.
    toggleTimedSection();

    // Listen to changes on the toggle switch, and fire the function.
    var bgTimedToggle = clayConfig.getItemByMessageKey('BGTimed');
    if (bgTimedToggle) {
      bgTimedToggle.on('change', toggleTimedSection);
    }
		
		// Listen to changes on the startDayInput to change startNightInput min value.
		var startDayInput = clayConfig.getItemByMessageKey('StartDay');
    if (startDayInput) {
      startDayInput.on('change', setNightInputMin);
    }
  });
};
