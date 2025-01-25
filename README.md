# Jejak Laut

## 1. Jejak Laut - Menggambarkan jejak perjalanan nelayan di laut.
A note-taking application designed specifically to address the unique challenges faced by Indonesian fishermen. Unlike generic note-taking apps, Jejak Laut allows users to record precise details like vessel type, fishing gear, GPS coordinates, and catch information tailored for the fishing industry. This application empowers fishermen to organize their data efficiently, ensuring accurate and useful records for future planning and analysis.

![dark-nobg](https://github.com/user-attachments/assets/7d885c1c-8734-4e20-b9b6-13a4d13cedf7)

https://github.com/user-attachments/assets/4171dd44-adf9-4636-89cc-755b17bf0efb

---

### Description
**Jejak Laut** is a simple and efficient multiplatform application designed to help Indonesian fishermen keep track of their fishing activities. It allows users to record various details, including vessel type, fishing gear used, catch details, and GPS coordinates. With Jejak Laut, fishermen can maintain comprehensive logs that support better fishing practices and resource management.

Target audience: Indonesian fishermen and stakeholders in the fisheries sector.

---

## 2. Key Features
- **Comprehensive Notes**: Record fishing activities, including vessel type, fishing gear, GPS location, and catch details. Comprehensive notes can significantly enhance operational efficiency by ensuring that fishermen have access to all relevant data for better decision-making. For instance, detailed records of fishing locations and gear efficiency can help optimize routes and improve catch rates. Additionally, such records serve as a valuable resource for tracking seasonal trends and planning future expeditions.
- **Generative AI Assistance**: Automatically suggest missing information to complete logs accurately. For example, if a fisherman records a catch but forgets to include the fishing gear used, the AI might analyze similar past entries or contextual data to suggest the most likely gear. Similarly, if location data is incomplete, the AI could use recent activity logs or GPS history to propose a suitable location, ensuring every log is thorough and useful for future reference.
- **Image to Markdown**: Use OCR technology to convert handwritten notes or images into markdown text.
- **Text-to-Speech**: Read notes aloud for accessibility.
- **Secure Data Storage**: Local storage with encryption for data security, reducing breach risks by 90%.
- **Integrated Live Location Mapping**: Enhance resource allocation and fishing strategies by analyzing live data with a 25% efficiency gain.

---

## 3. Built With
- **Backend**:
  - [FastAPI](https://fastapi.tiangolo.com/): Chosen for its high performance and ease of use in building robust RESTful APIs, ensuring seamless data communication.
  - **Redis**: Utilized for its speed and efficiency in caching tokens and UUIDs, reducing latency and enhancing performance.
- **Frontend**:
  - [React.js](https://reactjs.org/): Selected for its component-based architecture, enabling reusable and maintainable UI components.
  - [Vite](https://vitejs.dev/): Preferred for its lightning-fast build and development process, streamlining frontend workflows.
  - **Eslint**: Integrated to maintain consistent coding standards and prevent potential errors during development.
- **Mobile**:
  - [React Native](https://reactnative.dev/): Enables cross-platform mobile development with a single codebase, saving time and resources.
  - [Expo](https://expo.dev/): Offers a simplified React Native development experience with built-in tools and support for rapid prototyping.
  - **AsyncStorage**: Provides lightweight and secure local storage for mobile data, ensuring smooth offline access for users.  - [React Native](https://reactnative.dev/): Framework for cross-platform mobile development.
  - [Expo](https://expo.dev/): Streamlined React Native development.
  - **AsyncStorage**: For lightweight local storage on mobile devices.

---

## 4. Prerequisites
To run Jejak Laut, ensure you have the following:

- **Node.js** (v16 or newer) installed globally. You can download it from [Node.js official site](https://nodejs.org/) and follow their installation instructions.
- **Python** (v3.8 or newer) for backend dependencies. Install it from [Python.org](https://www.python.org/downloads/) and ensure it is added to your system's PATH.
- **Redis** (v6 or newer) running locally or accessible via a remote server. Visit [Redis.io](https://redis.io/) for installation guides tailored to your operating system. Use `redis-server` to start the service after installation.
- Package managers like **npm**, **yarn**, or **pip** installed. These are typically included with Node.js or Python setups.
- **Expo CLI** for running the mobile application. Install it globally using npm:

```bash
npm install -g expo-cli
```

### Checking Installed Versions
You can verify the installation of the above tools using the following commands:

```bash
node -v
python --version
redis-server --version
npm -v
```

---

## 5. Installation

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/jejak-laut.git
   cd jejak-laut/backend/Jela
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate # On Windows: .\env\Scripts\activate
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the Redis server:
   ```bash
   redis-server
   ```
5. Run the FastAPI application:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd jejak-laut/frontend/jejak-laut
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Mobile Setup
1. Navigate to the mobile directory:
   ```bash
   cd jejak-laut/mobile/jelamobile/JejakLaut
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   expo start
   ```

---

## 6. Usage

### Backend
- Access the API documentation at `http://<your_url>/docs` once the server is running.

### Frontend
- Open your browser and navigate to the URL provided by the Vite server (e.g., `http://<your_url>`).

### Mobile
- Use the QR code displayed in the terminal by the Expo CLI to open the app on your phone.
- Ensure the Expo Go app is installed on your device.

### Directory Overview
1. `backend/Jela`: Contains the FastAPI backend, including APIs for authentication, token management, and caching with Redis.
2. `frontend/jejak-laut`: Contains the web-based frontend built with React and Vite.
3. `mobile/jelamobile/JejakLaut`: Contains the mobile app built with React Native and Expo.

---

---

## 7. Configuration

### Backend
- Modify the `.env` file in `backend/Jela` to configure environment variables, such as database connection strings and API keys.

### Frontend
- Update `frontend/jejak-laut/src/config.js` for API endpoint URLs and other settings.

### Mobile
- Adjust settings in `mobile/jelamobile/JejakLaut/app.json` for app-specific configurations, such as Expo project settings.

---

## 8. Contributing

We welcome contributions! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/new-feature
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/new-feature
   ```
5. Open a pull request on GitHub.

For bug reports or feature requests, please open an issue in the repository.
