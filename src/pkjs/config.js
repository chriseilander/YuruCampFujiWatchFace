module.exports = [
  {
    "type": "heading",
    "defaultValue": "Yuru Camp Mount Fuji Watchface",
		"size": "1"
  },
  {
    "type": "section",
		"defaultValue": "Here you can customize the appearance and preferences.",
    "items": [
			{
				"type": "heading",
    		"defaultValue": "Customize",
				"size": "3"
			},
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
					},
					{
						"label": "Ena Saitou",
						"value": "ena"
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
		"type": "section",
		"defaultValue": "Like my work?",
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
