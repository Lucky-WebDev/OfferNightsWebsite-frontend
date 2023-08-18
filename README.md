# Build a blog using Nest.js, TypeScript, React and MongoDB

Application repo for a simple blog application built with Nest.js, TypeScript, React and MongoDB.

## Getting Started
This prototype is divided into two separate sections. Namely the Backend ( Built with Nest.js) and the frontend
( Built with React ).

## Version
node 16.16.0
mongo 4.4

Install TypeScript globally on your machine if you don't have it installed already:

```bash
npm install -g typescript
```

## Backend
### Change directory into the backend
```bash
cd backend
```

### Install backend dependencies

```bash
npm install
```

### Create .env file
Once the installation process is complete, modify a `.env` file:

Open the newly created file and add the following code:

```
TWILIO_ACCOUNT_SID=YOUR_TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN=YOUR_TWILIO_AUTH_TOKEN
TWILIO_VERIFICATION_SERVICE_SID=YOUR_TWILIO_VERIFICATION_SERVICE_SID
TWILIO_SENDER_PHONE_NUMBER=SENDER_PHONE_NUMBER
GMAIL_USERNAME=REPLACE_WITH_YOUR_EMAIL_ADDRESS
GMAIL_PASSWORD=YOUR_PASSWORD
SERVER_PORT=5000
URL=YOUR_SERVER_IP_ADDRESS
CLIENT_PORT=3000
```

### MongoDB
Ensure that you have mongoDB installed on your machine before running the application. I have this fully setup on my mac already.

Start mongoDB:

### Run the application
Open another terminal and still within the `backend` project directory run the application with:

```bash
npm run start:dev
```

This will start the backend application on port `5000`. This was modified to avoid confliction with the frontend application which by default will run on port `3000`


## Frontend
Open another terminal from the `OfferNights` and navigate to the `frontend` folder to setup the frontend

### Frontend dependencies
```bash
cd frontend
npm install
```

### Run the frontend app

```bash
npm start
```

### Create .env file
Once the installation process is complete, modify a `.env` file:

Open the newly created file and add the following code:

```
REACT_APP_URL=YOUR_SERVER_IP_ADDRESS:5000
```

### Test the application
Finally open your browser and view the application on http://localhost:3000

## Prerequisites
 [Node.js](https://nodejs.org/en/), [Yarn package manager](https://yarnpkg.com/lang/en/docs/install/#mac-stable), [MongoDB](https://docs.mongodb.com/v4.4/installation/) and [TypeScript](https://www.typescriptlang.org/)


## Built With
[Nest.js]()
[React.js]()
[TypeScript]()
[MongoDB]() 