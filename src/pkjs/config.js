module.exports = [
  {
    "type": "heading",
    "defaultValue": "Yuru Camp Mount Fuji Watchface",
    "size": "1"
  },
  {
    "type": "section",
    "id": "mainSection",
    "items": [
      {
        "type": "heading",
        "defaultValue": "General",
        "size": "2"
      },
      {
        "type": "select",
        "messageKey": "Camper",
        "label": "Who is your favorite camper?",
        "defaultValue": "rin",
        "description": "Shows a little portrait of your favorite camper.",
        "options": [
          { "label": "None", "value": "none" },
          { "label": "Rin Shima", "value": "rin" },
          { "label": "Nadeshiko Kagamihara", "value": "nadeshiko" },
          { "label": "Chiaki Ohgaki", "value": "chiaki" },
          { "label": "Aoi Inuyama", "value": "aoi" },
          { "label": "Ena Saitou", "value": "ena" }
        ]
      },
      {
        "type": "toggle",
        "messageKey": "TextDark",
        "label": "Dark Text",
        "defaultValue": false,
				"description": "Turning this on will make the text black. Off is white.",
      },
      {
        "type": "toggle",
        "messageKey": "BGDark",
        "label": "Nighttime mount Fuji",
        "defaultValue": true,
				"description": "On is nighttime background, off is daytime background"
      },
      {
        "type": "toggle",
        "messageKey": "BGTimed",
        "label": "Timed background",
        "defaultValue": false,
				"description": "If you want the background to change based on the time, turn this on. You can set the times below."
      }
    ]
  },
  {
    "type": "section",
    "id": "timedBGSection",
    "items": [
      {
        "type": "heading",
        "id": "timedBGHeading",
        "defaultValue": "Timed Background Settings",
        "size": "4"
      },
      {
        "type": "input",
        "id": "startDayInput",
        "messageKey": "StartDay",
        "label": "Start daytime",
        "defaultValue": "06:00",
				"serializeValueAs": "string",
				"description": "This is the time from which on you want to see the daytime background.",
        "attributes": {
          "type": "time",
          "step": 3600,
					"max": "22:00"
        }
      },
      {
        "type": "input",
        "id": "startNightInput",
        "messageKey": "StartNight",
        "label": "Start nighttime",
        "defaultValue": "18:00",
				"serializeValueAs": "string",
				"description": "This is the time from which on you want to see the nighttime background.",
        "attributes": {
          "type": "time",
          "step": 3600,
          "min": "07:00"
        }
      }
    ]
  },
  {
    "type": "submit",
    "defaultValue": "Save Settings"
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "Like my work?",
        "size": "3"
      },
      {
        "type": "text",
        "defaultValue": "Made by <a href='https://chriseilander.nl' target='_blank'>Chris Eilander</a>"
      },
      {
        "type": "text",
        "defaultValue": "<div style='text-align: center; margin: 15px 0;'><a href='https://ko-fi.com/S4Y223NKXL' target='_blank'><img src='https://storage.ko-fi.com/cdn/brandasset/v2/support_me_on_kofi_beige.png' alt='Support Me on Ko-fi' style='max-width: 200px; width: 100%; height: auto; border: none; transition: transform 0.2s;' onmouseover='this.style.transform=\"scale(1.05)\"' onmouseout='this.style.transform=\"scale(1)\"'></a></div>"
      }
    ]
  }
];
