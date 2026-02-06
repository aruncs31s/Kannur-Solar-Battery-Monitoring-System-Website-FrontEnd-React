/**
 * ESP32 OTA Update Server Example
 * 
 * This code enables your ESP32 to receive firmware updates
 * over WiFi from the web frontend's OTA upload feature.
 * 
 * Compatible with: ESP32, ESP8266
 * Libraries Required: ArduinoOTA or AsyncElegantOTA
 */

#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <AsyncElegantOTA.h>
#include <Update.h>

// WiFi Credentials (will be replaced during build)
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Device Configuration
const char* deviceName = "ESP32-Device";
const char* otaPassword = "admin"; // Optional: password protect OTA

// Create Web Server on port 80
AsyncWebServer server(80);

void setup() {
  Serial.begin(115200);
  Serial.println("\n\nESP32 OTA Update Server");
  Serial.println("=======================");

  // Connect to WiFi
  WiFi.mode(WIFI_STA);
  WiFi.setHostname(deviceName);
  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.print("Hostname: ");
  Serial.println(deviceName);

  // Setup OTA Update Endpoint
  setupOTAServer();

  // Start Web Server
  server.begin();
  Serial.println("HTTP server started");
  Serial.println("Ready for OTA updates!");
  Serial.println("\nAccess OTA at: http://" + WiFi.localIP().toString() + "/update");
}

void setupOTAServer() {
  // Method 1: Using AsyncElegantOTA (Recommended - Easy to use)
  AsyncElegantOTA.begin(&server);    // Start ElegantOTA
  
  /*
  // Method 2: Custom OTA Handler (More control)
  server.on("/update", HTTP_POST, [](AsyncWebServerRequest *request) {
    bool shouldReboot = !Update.hasError();
    AsyncWebServerResponse *response = request->beginResponse(200, "text/plain", 
      shouldReboot ? "OK" : "FAIL");
    response->addHeader("Connection", "close");
    request->send(response);
    
    if (shouldReboot) {
      Serial.println("Update Success! Rebooting...");
      delay(100);
      ESP.restart();
    } else {
      Serial.println("Update Failed!");
    }
  }, [](AsyncWebServerRequest *request, String filename, size_t index, 
        uint8_t *data, size_t len, bool final) {
    
    if (!index) {
      Serial.printf("Update Start: %s\n", filename.c_str());
      if (!Update.begin((ESP.getFreeSketchSpace() - 0x1000) & 0xFFFFF000)) {
        Update.printError(Serial);
      }
    }
    
    if (!Update.hasError()) {
      if (Update.write(data, len) != len) {
        Update.printError(Serial);
      } else {
        Serial.printf("Progress: %d%%\r", (Update.progress()*100)/Update.size());
      }
    }
    
    if (final) {
      if (Update.end(true)) {
        Serial.printf("\nUpdate Success: %uB\n", index+len);
      } else {
        Update.printError(Serial);
      }
    }
  });
  */

  // Ping endpoint for connection testing
  server.on("/ping", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send(200, "text/plain", "pong");
  });

  // Status endpoint
  server.on("/status", HTTP_GET, [](AsyncWebServerRequest *request) {
    String json = "{";
    json += "\"device\":\"" + String(deviceName) + "\",";
    json += "\"ip\":\"" + WiFi.localIP().toString() + "\",";
    json += "\"uptime\":" + String(millis() / 1000) + ",";
    json += "\"freeHeap\":" + String(ESP.getFreeHeap()) + ",";
    json += "\"rssi\":" + String(WiFi.RSSI());
    json += "}";
    request->send(200, "application/json", json);
  });
}

void loop() {
  // Your main code here
  delay(10);
}

/*
 * PLATFORMIO CONFIGURATION (platformio.ini)
 * ==========================================
 * 
 * [env:esp32]
 * platform = espressif32
 * board = esp32dev
 * framework = arduino
 * 
 * lib_deps = 
 *     ESP Async WebServer
 *     AsyncElegantOTA
 * 
 * monitor_speed = 115200
 * upload_speed = 921600
 * 
 * ; Build flags
 * build_flags = 
 *     -DWIFI_SSID=\"${sysenv.WIFI_SSID}\"
 *     -DWIFI_PASSWORD=\"${sysenv.WIFI_PASSWORD}\"
 *     -DDEVICE_NAME=\"${sysenv.DEVICE_NAME}\"
 * 
 * 
 * ARDUINO IDE SETUP
 * =================
 * 
 * 1. Install Libraries:
 *    - Tools -> Manage Libraries
 *    - Search and install:
 *      * ESPAsyncWebServer (by me-no-dev)
 *      * AsyncElegantOTA (by Ayush Sharma)
 *      * AsyncTCP (for ESP32)
 * 
 * 2. Select Board:
 *    - Tools -> Board -> ESP32 Arduino -> ESP32 Dev Module
 * 
 * 3. Upload this sketch
 * 
 * 
 * TESTING OTA UPDATE
 * ==================
 * 
 * 1. Upload this sketch to ESP32 first time via USB
 * 2. Note the IP address from Serial Monitor
 * 3. In frontend OTA Upload modal:
 *    - Enter device IP address
 *    - Select .bin file
 *    - Click "Upload to Device"
 * 4. Device will reboot automatically
 * 
 * 
 * SECURITY CONSIDERATIONS
 * =======================
 * 
 * For production, add authentication:
 * 
 * AsyncElegantOTA.begin(&server, "username", "password");
 * 
 * Or implement custom authentication:
 * 
 * server.on("/update", HTTP_GET, [](AsyncWebServerRequest *request) {
 *   if (!request->authenticate("admin", "password")) {
 *     return request->requestAuthentication();
 *   }
 *   // ... handle update
 * });
 * 
 * 
 * TROUBLESHOOTING
 * ===============
 * 
 * Issue: "Connection failed"
 * - Check device is on same network as computer
 * - Verify IP address is correct
 * - Check firewall settings
 * 
 * Issue: "Upload timeout"
 * - Increase timeout in frontend (currently 2 minutes)
 * - Check WiFi signal strength
 * - Reduce .bin file size
 * 
 * Issue: "Update failed"
 * - Ensure .bin file is compiled for correct board
 * - Check partition table has enough space
 * - Verify .bin file is not corrupted
 * 
 * Issue: "Device not rebooting"
 * - Add manual reboot in code: ESP.restart()
 * - Check Update.end(true) returns success
 * 
 * 
 * ADDITIONAL FEATURES
 * ===================
 * 
 * Add Web UI for OTA (optional):
 * 
 * server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
 *   request->send(200, "text/html", R"(
 *     <!DOCTYPE html>
 *     <html>
 *     <head><title>ESP32 OTA</title></head>
 *     <body>
 *       <h1>ESP32 OTA Update</h1>
 *       <form method='POST' action='/update' enctype='multipart/form-data'>
 *         <input type='file' name='update'>
 *         <input type='submit' value='Update'>
 *       </form>
 *     </body>
 *     </html>
 *   )");
 * });
 * 
 * 
 * NOTES
 * =====
 * 
 * - First upload must be via USB cable
 * - Subsequent updates can be OTA
 * - Device must be powered on and connected to WiFi
 * - Update process takes 10-30 seconds
 * - Device will reboot automatically after update
 * - Keep backup of working firmware
 * 
 */
