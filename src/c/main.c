#include <pebble.h>

// Persistent storage key
#define SETTINGS_KEY 1

// Define our settings struct
typedef struct ClaySettings {
  char Camper[10];
	bool TextDark;
	bool BGTimed;
	bool BGDark;
} ClaySettings;

// An instance of the struct
static ClaySettings settings;

static Window *s_main_window;
static TextLayer *s_time_layer;
static TextLayer *s_date_layer;
static GBitmap *s_bg;
static GBitmap *s_chathead;
static BitmapLayer *s_bg_layer;
static BitmapLayer *s_chathead_layer;
uint8_t chathead_size;
static GFont s_main_font;
static GFont s_seco_font;

// Set default settings
static void prv_default_settings() {
  strncpy(settings.Camper, "rin", 10);
	settings.TextDark = false;
	settings.BGTimed = false;
	settings.BGDark = true;
}

// Save settings to persistent storage
static void prv_save_settings() {
  persist_write_data(SETTINGS_KEY, &settings, sizeof(settings));
}

// Read settings from persistent storage
static void prv_load_settings() {
  // Set defaults first
  prv_default_settings();
  // Then override with any saved values
  persist_read_data(SETTINGS_KEY, &settings, sizeof(settings));
}

// This function sets the Textcolor to either white or black, based on the setting.
static void update_textcolor(){
	if (settings.TextDark == false){
		text_layer_set_text_color(s_time_layer, GColorWhite);
		text_layer_set_text_color(s_date_layer, GColorWhite);
	} else {
		text_layer_set_text_color(s_time_layer, GColorBlack);
		text_layer_set_text_color(s_date_layer, GColorBlack);
	}
}

// This function updates the background image
static void update_bgimage(){
	// If BGTimed is false, the user can select the daytime or nighttime background. Otherwise it should change it based on the time.
	if (settings.BGTimed == false){
		if (settings.BGDark == false){ // False means not a dark background, so it should be BG_FUJI_DAY
			gbitmap_destroy(s_bg); // Always destroy before change
			s_bg = gbitmap_create_with_resource(RESOURCE_ID_BG_FUJI_DAY);
		} else { // True means a dark background, so it should be BG_FUJI (legacy name from when there was just this one background)
			gbitmap_destroy(s_bg); // Always destroy before change
			s_bg = gbitmap_create_with_resource(RESOURCE_ID_BG_FUJI);
		}
	}
	
	// Set compositing mode and bitmap in the layer.
	bitmap_layer_set_compositing_mode(s_bg_layer, GCompOpSet);
  bitmap_layer_set_bitmap(s_bg_layer, s_bg);
}

// This function updates the "chathead" to whatever is set.
static void update_chathead(){
	// Always destroy the image if it has been set
	if (s_chathead != NULL){
    gbitmap_destroy(s_chathead);
    s_chathead = NULL;
  }
	
	// Then set it. Values not set down here means there won't be a bitmap set. In that case it remains destroyed.
	if (strcmp(settings.Camper,"rin") == 0){
		s_chathead = gbitmap_create_with_resource(RESOURCE_ID_HEAD_RIN);
	} else if (strcmp(settings.Camper,"nadeshiko") == 0) {
		s_chathead = gbitmap_create_with_resource(RESOURCE_ID_HEAD_NADESHIKO);
	} else if (strcmp(settings.Camper,"chiaki") == 0) {
		s_chathead = gbitmap_create_with_resource(RESOURCE_ID_HEAD_CHIAKI);
	} else if (strcmp(settings.Camper,"aoi") == 0) {
		s_chathead = gbitmap_create_with_resource(RESOURCE_ID_HEAD_AOI);
	} else if (strcmp(settings.Camper,"ena") == 0) {
		s_chathead = gbitmap_create_with_resource(RESOURCE_ID_HEAD_ENA);
	}
	
	// Set compositing mode and bitmap in the layer.
	bitmap_layer_set_compositing_mode(s_chathead_layer, GCompOpSet);
  bitmap_layer_set_bitmap(s_chathead_layer, s_chathead);
}

// Apply settings to UI elements
static void prv_update_display() {
	update_chathead();
	update_textcolor();
	update_bgimage();
}

static void update_time() {
  // Get a tm structure
  time_t temp = time(NULL);
  struct tm *tick_time = localtime(&temp);

  // Write the current hours and minutes into a buffer
  static char s_time_buffer[16];
  strftime(s_time_buffer, sizeof(s_time_buffer), clock_is_24h_style() ?
                                                    "%H:%M" : "%I:%M %p", tick_time);

  // Display this time on the TextLayer
  text_layer_set_text(s_time_layer, s_time_buffer);

  // Write the current date into a buffer
  static char s_date_buffer[16];
  strftime(s_date_buffer, sizeof(s_date_buffer), "%Y-%m-%d", tick_time);

  // Display the date
  text_layer_set_text(s_date_layer, s_date_buffer);
}

static void tick_handler(struct tm *tick_time, TimeUnits units_changed) {
  update_time();
}

// AppMessage received handler, basically listener for the settings.
static void inbox_received_callback(DictionaryIterator *iterator, void *context) {
  // Check for Clay settings data
  Tuple *camper_t = dict_find(iterator, MESSAGE_KEY_Camper);
  if (camper_t) {
    strncpy(settings.Camper, camper_t->value->cstring, 10);
  }
	Tuple *textdark_t = dict_find(iterator, MESSAGE_KEY_TextDark);
	if (textdark_t) {
		settings.TextDark = textdark_t->value->int32 == 1;
	}
	Tuple *bgdark_t = dict_find(iterator, MESSAGE_KEY_BGDark);
	if (bgdark_t) {
		settings.BGDark = bgdark_t->value->int32 == 1;
	}

  // Save and apply if any settings were changed
  if (camper_t || textdark_t || bgdark_t) {
    prv_save_settings();
    prv_update_display();
  }
}

static void inbox_dropped_callback(AppMessageResult reason, void *context) {
  APP_LOG(APP_LOG_LEVEL_ERROR, "Message dropped!");
}

static void outbox_failed_callback(DictionaryIterator *iterator, AppMessageResult reason, void *context) {
  APP_LOG(APP_LOG_LEVEL_ERROR, "Outbox send failed!");
}

static void outbox_sent_callback(DictionaryIterator *iterator, void *context) {
  APP_LOG(APP_LOG_LEVEL_INFO, "Outbox send success!");
}

static void main_window_load(Window *window) {
  // Get information about the Window
  Layer *window_layer = window_get_root_layer(window);
  GRect bounds = layer_get_bounds(window_layer);
	
	// Load custom fonts
	#if PBL_DISPLAY_WIDTH >= 200
		s_main_font = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_CHELSEA_43));
		s_seco_font = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_CHELSEA_20));
	#else
		s_main_font = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_CHELSEA_31));
		s_seco_font = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_CHELSEA_14));
	#endif

  // Create the time TextLayer
  s_time_layer = text_layer_create(
		#if PBL_RECT
      GRect(10, 10, bounds.size.w, 50));
		#else
			GRect(0, 27, bounds.size.w, 50));
		#endif
  text_layer_set_background_color(s_time_layer, GColorClear);
  text_layer_set_text_color(s_time_layer, GColorWhite);
  text_layer_set_font(s_time_layer, s_main_font);
  text_layer_set_text_alignment(s_time_layer, PBL_IF_ROUND_ELSE(GTextAlignmentCenter, GTextAlignmentLeft));

  // Create the date TextLayer
  s_date_layer = text_layer_create(
		#if PBL_RECT && PBL_DISPLAY_WIDTH == 200
      GRect(10, 53, bounds.size.w, 30));
			chathead_size = 70;
		#elif PBL_RECT && PBL_DISPLAY_WIDTH == 144
			GRect(10, 41, bounds.size.w, 30));
			chathead_size = 50;
		#elif PBL_ROUND && PBL_DISPLAY_WIDTH == 260
			GRect(0, 70, bounds.size.w, 30));
			chathead_size = 70;
		#else
			GRect(0, 58, bounds.size.w, 30));
			chathead_size = 50;
		#endif
  text_layer_set_background_color(s_date_layer, GColorClear);
  text_layer_set_text_color(s_date_layer, GColorWhite);
  text_layer_set_font(s_date_layer, s_seco_font);
  text_layer_set_text_alignment(s_date_layer, PBL_IF_ROUND_ELSE(GTextAlignmentCenter, GTextAlignmentLeft));
	
	s_bg = gbitmap_create_with_resource(RESOURCE_ID_BG_FUJI); 
	s_chathead = gbitmap_create_with_resource(RESOURCE_ID_HEAD_RIN); // Rin is standard, if its not the one that is set, its changed later when calling prv_update_display()
	
	// Create background image bitmaplayer
  s_bg_layer = bitmap_layer_create(
		GRect(0, 0, bounds.size.w, bounds.size.h));
	bitmap_layer_set_compositing_mode(s_bg_layer, GCompOpSet);
  bitmap_layer_set_bitmap(s_bg_layer, s_bg);
	
	// Create Chathead image bitmaplayer
	s_chathead_layer = bitmap_layer_create(
		#if PBL_RECT && PBL_DISPLAY_WIDTH == 200
			GRect((bounds.size.w-(chathead_size + 5)), 58, chathead_size, chathead_size));
		#elif PBL_RECT && PBL_DISPLAY_WIDTH == 144
			GRect((bounds.size.w-(chathead_size + 5)), 46, chathead_size, chathead_size));
		#elif PBL_ROUND && PBL_DISPLAY_WIDTH == 260
			GRect((bounds.size.w-(chathead_size + 5)), 90, chathead_size, chathead_size));
		#else
			GRect((bounds.size.w-(chathead_size + 5)), 72, chathead_size, chathead_size));
		#endif
	bitmap_layer_set_compositing_mode(s_chathead_layer, GCompOpSet);
	bitmap_layer_set_bitmap(s_chathead_layer, s_chathead);

  // Add layers to the Window
	layer_add_child(window_layer, bitmap_layer_get_layer(s_bg_layer));
  layer_add_child(window_layer, text_layer_get_layer(s_time_layer));
  layer_add_child(window_layer, text_layer_get_layer(s_date_layer));
	layer_add_child(window_layer, bitmap_layer_get_layer(s_chathead_layer));
	
	// Apply saved settings, since if the user has used the watchface before they might have set something different.
  prv_update_display();
}

static void main_window_unload(Window *window) {
  // Destroy TextLayers and unload fonts
  text_layer_destroy(s_time_layer);
  text_layer_destroy(s_date_layer);
	fonts_unload_custom_font(s_main_font);
	//Destroy bitmaps and layers
	gbitmap_destroy(s_bg);
	gbitmap_destroy(s_chathead);
  bitmap_layer_destroy(s_bg_layer);
	bitmap_layer_destroy(s_chathead_layer);
}

static void init() {
	// Load settings before creating UI
  prv_load_settings();
	
  // Create main Window element and assign to pointer
  s_main_window = window_create();

  // Set the background color
  window_set_background_color(s_main_window, GColorBlack); //DEV: Is this needed with our background image?

  // Set handlers to manage the elements inside the Window
  window_set_window_handlers(s_main_window, (WindowHandlers) {
    .load = main_window_load,
    .unload = main_window_unload
  });

  // Show the Window on the watch, with animated=true
  window_stack_push(s_main_window, true);

  // Make sure the time is displayed from the start
  update_time();

  // Register with TickTimerService
  tick_timer_service_subscribe(MINUTE_UNIT, tick_handler);
	
	// Register AppMessage callbacks
  app_message_register_inbox_received(inbox_received_callback);
  app_message_register_inbox_dropped(inbox_dropped_callback);
  app_message_register_outbox_failed(outbox_failed_callback);
  app_message_register_outbox_sent(outbox_sent_callback);

  // Open AppMessage
  const int inbox_size = 256;
  const int outbox_size = 256;
  app_message_open(inbox_size, outbox_size);
}

static void deinit() {
  // Destroy Window
  window_destroy(s_main_window);
}

int main(void) {
  init();
  app_event_loop();
  deinit();
}
