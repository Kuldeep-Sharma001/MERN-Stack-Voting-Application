    📜 Voting App Setup Guide
This guide will walk you through setting up both the frontend and backend environments for the Voting Application.

💻 Frontend Setup (Vite + React)
The frontend is built using Vite for a fast development experience.

1. Initialization & Installation
Navigate to the frontend folder and install dependencies:

Bash
cd frontend
npm install
2. Environment Configuration
Create a .env file in the root of the frontend directory:

Bash
touch .env
Add the following variable to connect to your backend:

Code snippet
VITE_API_BASE_URL=http://localhost:5000/api
Note: Vite requires environment variables to start with VITE_ to be accessible in your code via import.meta.env.

3. Run the App
Bash
npm run dev
⚙️ Backend Setup (Node.js + Express)
The backend handles the logic, authentication, and database connection.

1. Installation
Navigate to the backend folder and install dependencies:

Bash
cd backend
npm install
2. Environment Configuration
Create a .env file in the root of the backend directory:

Code snippet
PORT=5000
JWT_SECRETKEY=your_super_secret_key_here
MONGODB_URL=mongodb://localhost:27017/voting_app
3. Run the Server
Bash
# Using standard node
npm start
NOTE:" nodemon is not used in this application, you can use if you want to.
        You have to setup the package.json file in backend folder to run app using nodemon"
📂 Project Structure Overview
    VOTINGAPP
      /frontend
      /backend
