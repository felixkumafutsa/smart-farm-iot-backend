# Smart Farm IoT Backend (MongoDB Version)

Production-ready Node.js/Express IoT backend for a Smart Farm system using **MongoDB/Mongoose**.

## 🚀 Features
- **Device Management**: Register farm nodes with Mongoose models.
- **Sensor Telemetry**: Accept real-time temperature, humidity, and soil moisture.
- **NoSQL Schema**: flexible data storage using Mongoose.
- **Heartbeat & Status**: Real-time device online/offline tracking.
- **Security**: JWT & API Key authentication layers.

---

## 🛠 Tech Stack
- **Node.js** with **Express.js (v5)**
- **MongoDB** with **Mongoose**
- **JWT** (authentication)
- **Joi** (validation)
- **Luxon** (time management)

---

## 🏁 Getting Started

### 1. Prerequisites
- Node.js (v16+)
- **MongoDB** running locally (`mongodb://localhost:27017`) or a **MongoDB Atlas** Cloud account.

### 2. Installation
```bash
npm install
```

### 3. Configuration
Open the `.env` file and set your `MONGODB_URI`:
```bash
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/smart_farm_db
```

### 4. Run the Server
```bash
npm run dev
```

---

## 📡 API Endpoints (Quick Reference)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/login` | Get JWT token | Public |
| POST | `/api/devices/register` | Register a new device | Public |
| POST | `/api/iot/data` | Send sensor telemetry | `x-api-key` |
| GET | `/api/iot/latest` | Latest reading | JWT |
| GET | `/api/iot/device-status` | Online/Offline status | JWT |

---

## 🧪 Testing with Postman
Import the `smart_farm_postman_collection.json` file into Postman.
1. Register a device.
2. Copy the `api_key` and use it in the `x-api-key` header for sending data.
3. Login to get a Bearer Token for AI Agent queries.

---

## ☁️ Deployment (Vercel)

This backend is pre-configured for Vercel deployment.

1. **GitHub**: Push this repository to your GitHub account.
2. **Vercel**: Go to [vercel.com](https://vercel.com), create a new project, and import your GitHub repo.
3. **Settings**: Add your `.env` variables (specifically `MONGODB_URI`) in the **Environment Variables** tab of your Vercel project settings.
4. **Networking**: 
   > [!IMPORTANT]
   > In **MongoDB Atlas**, go to **Network Access** and select **"Allow Access from Anywhere"** (0.0.0.0/0). Vercel uses dynamic IP addresses, so your database will block the connection if you don't do this.

5. **Deploy**: Vercel will automatically deploy the app. Your API will be live at `https://your-project-name.vercel.app/api`.

