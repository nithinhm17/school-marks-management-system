**# School Marks Management System**

A comprehensive, full-stack solution for managing academic performance across multiple schools. This project features a robust MERN backend, a modern Web Dashboard, and a feature-rich Mobile Application.

**## 🚀 Overview**

The ****School Marks Management System**** is designed to streamline the process of academic record-keeping. It allows administrators to configure academic boards and schools, teachers to manage classes, subjects, and exams, and students' performance to be tracked and analyzed through calculated reports and visualizations.

**## 🏗️ Project Structure**

The repository is organized into three main components:

- ***`/backend`***: Node.js & Express API with MongoDB.
- ***`/frontend`***: React-based web dashboard (Vite).
- ***`/mobile-app`***: React Native application (Expo).

**## 🛠️ Tech Stack**

**### Backend**

- ***Runtime****: Node.js
- ***Framework****: Express.js
- ***Database****: MongoDB (Mongoose ODM)
- ***Validation****: Express-Validator
- ***Security/Utils****: CORS, Dotenv

**### Web Frontend**

- ***Framework****: React 19 (Vite)
- ***Styling****: TailwindCSS
- ***Routing****: React Router 7
- ***Charts****: Recharts
- ***Notifications****: React Hot Toast

**### Mobile App**

- ***Framework****: React Native (Expo)
- ***Styling****: NativeWind (TailwindCSS for Mobile)
- ***Navigation****: React Navigation
- ***Networking****: Axios

**## 📖 Documentation**

Detailed technical documentation is available in the root directory:

- 📑 ***[API Documentation](**./API_DOCUMENTATION.md**)****: Detailed endpoint guides and request/response formats.
- 📊 ***[ER Diagram](**./ER_DIAGRAM.md**)****: Visual representation of the data architecture and relationships.

**## ⚙️ Installation & Setup**

**### 1. Backend Setup**

1. Navigate to `/backend`.

2. Install dependencies: `npm install`.

3. Create a `.env` file and configure your `MONGO_URI` and `PORT`.

4. Start the server: `npm start`.

**### 2. Frontend Setup**

1. Navigate to `/frontend`.

2. Install dependencies: `npm install`.

3. Start the development server: `npm run dev`.

**### 3. Mobile App Setup**

1. Navigate to `/mobile-app`.

2. Install dependencies: `npm install`.

3. Start the Expo server: `npm start`.

4. Scan the QR code with the ****Expo Go**** app on your mobile device.

**## 🗝️ Key Features**

- ***Multi-School Management****: Support for multiple schools under different academic boards.
- ***Academic Hierarchy****: Manage Classes -> Subjects -> Students -> Exams.
- ***Bulk Marks Entry****: Efficient interface for entering marks for entire classes.
- ***Smart Reports****: Automatic calculation of grades, percentages, class ranks, and weighted scores.
- ***Mobile Integration****: Access reports and management tools on the go with Android and iOS support.
- --
- *Developed with ❤️ as a complete academic management solution.**
