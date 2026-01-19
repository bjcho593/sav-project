# 👤 Profiles Microservice

This service manages extended user metadata, including contact details and profile customization.

## 🛠️ Functions
- **Data Retrieval:** Provides enriched user profiles for the UI.
- **Service Decoupling:** Separates identity/auth from personal data.
- **Port:** 3011 (TCP).

## 🧪 Expected Payload
```json
{ "cmd": "get_user_profile" }, { "userId": "12345" }