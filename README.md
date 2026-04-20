# Mental Health Journal

In today’s fast-paced digital environment, mental health awareness is increasing, but individuals often lack a private, structured, and secure platform to consistently express their thoughts and track emotional well-being. Traditional journaling methods are either not easily accessible, lack data security, or do not provide organized tracking of entries over time. 

This repository provides a comprehensive full-stack solution to address these challenges, featuring a **Mental Health Journaling Application** that integrates AI-powered personalized mood analysis.

## Features
- **User Authentication:** Secure user registration and login routines, facilitated using `bcrypt` for password hashing and JSON Web Tokens (JWT) for secure session management.
- **Journaling:** A safe, persistent private space for users to record their thoughts and daily emotional experiences.
- **AI-Powered Mood Analysis:** Integrates a Naive Bayes algorithm to evaluate and classify user journal entries' emotional context, providing intelligent feedback.
- **Responsive Frontend UI:** Built with React and structured thoughtfully for a modern user experience.

## Tech Stack
- **Frontend:** React.js, React Router, Axios
- **Backend:** Node.js, Express.js (RESTful APIs)
- **Database:** MongoDB (using Mongoose for Object Modeling)
- **Authentication:** JSON Web Tokens (JWT), bcrypt
- **Testing:** Jest

## Structure
- `/frontend`: Contains the React application that serves as the user interface.
- `/Backend`: Contains the Node.js API endpoints handling authentication, journal entries, and mood detection logic.

## Installation & Setup

### Prerequisites
- Node.js (v14 or above)
- MongoDB instance (Atlas or local)

### Backend Setup
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:  
   Create a `.env` file in the `Backend` root with your MongoDB URI, JWT Secret, and port (e.g., 5000).
4. Start the server:
   ```bash
   npm start
   ```
   *(Optional) Run backend tests using `npm test`.*

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure local environment variables or API URLs in `src/config.js` if necessary.
4. Start the application:
   ```bash
   npm start
   ```

## License
ISC
