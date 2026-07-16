module.exports = [
  {
    "type": "heading",
    "defaultValue": "Yuru Camp Mount Fuji Watchface"
  },
  {
    "type": "text",
    "defaultValue": "Here you can customize the appearance and preferences."
  },
  {
    "type": "section",
    "items": [
      {
        "type": "select",
        "messageKey": "Camper",
        "label": "Who is your favorite camper?",
        "defaultValue": "rin",
        "description": "",
        "options": [
          {
						"label": "None",
            "value": "none"
          },
          {
            "label": "Rin Shima",
            "value": "rin"
          },
          {
            "label": "Nadeshiko Kagamihara",
            "value": "nadeshiko"
          },
          {
            "label": "Chiaki Ohgaki",
            "value": "chiaki"
          },
					{
						"label": "Aoi Inuyama",
						"value": "aoi"
					}
        ]
      }
    ]
  },
  {
    "type": "submit",
    "defaultValue": "Save Settings"
  },
  {
    "type": "text",
    "defaultValue": "Made by <a href='https://chriseilander.nl' target='_blank'>Chris Eilander</a>"
  }
];
