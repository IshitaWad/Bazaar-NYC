# Google Maps Setup Instructions

## The map view isn't showing because you need to configure your Google Maps API key.

### Step 1: Get a Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API**
4. Go to "Credentials" and create an API Key

### Step 2: Configure Your API Key
1. Open the `.env` file in your project
2. Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyC...your_actual_key_here
   ```

### Step 3: Restart Your App
1. Stop your development server (Ctrl+C)
2. Run `npm start` again
3. The map should now load when you switch to Map view

### Debugging:
- Check the browser console (F12) for error messages
- Look for console logs showing API key status and map initialization
- If you see "API key not configured" - check your .env file
- If you see "Failed to load Google Maps API" - check your API key is valid and APIs are enabled

### Security Note:
- Never commit your actual API key to version control
- The `.env` file is already in `.gitignore` to protect your key
- Consider restricting your API key to specific domains in production