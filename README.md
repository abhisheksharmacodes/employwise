# Employwise Project

This is a fullstack user management application built with React and Express. The React frontend integrates with the Reqres API (or a simulated Express backend) for user authentication, listing, searching, editing, and deletion.

## Project Structure
- **backend**: Contains the Express API server (in-memory user data).
- **src**: Contains the React frontend application with Material UI and React Router.

## Prerequisites
- Node.js (v14 or newer)
- npm or yarn

## Installation

### Backend
1. Navigate to the backend folder:
   ```bash
   cd d:\Projects\_Assignments\employwise\backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   node server.js
   ```
   The server will run on port 5000 by default.

### Frontend
1. Navigate to the project root if not already there:
   ```bash
   cd d:\Projects\_Assignments\employwise
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React application:
   ```bash
   npm start
   ```
   The app will open in your default browser, typically at http://localhost:3000.

## Assumptions & Considerations
- **API Endpoints**: The frontend is configured to interact with the Reqres API by default. A custom Express backend is provided for simulation and testing purposes.
- **State Management**: Basic state management is implemented using React hooks. No Redux or Context API is used.
- **Validation**: Both login and edit forms include per-field validation for empty fields and proper email format.
- **UI Framework**: Material UI is used for styling forms and buttons, while Tailwind classes are applied for layout in some parts.
- **Pagination**: User listing includes simple pagination controlled using React state.
- **Error Handling**: Snackbar components are used for notifying users of failed operations.

## Running Tests
_No automated tests have been configured for this project._

## Deployment
This project can be deployed on platforms such as Heroku, Vercel, or Netlify. Ensure that both frontend and backend are properly configured for production.

## License
This project is provided for educational purposes.
