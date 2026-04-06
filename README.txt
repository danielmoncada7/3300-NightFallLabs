All American Eats Project by Nightfall Labs

Directory:

/planning
    project_proposal
    schedule
    risk_management

/meeting_minutes
    
/src
    /frontend
        index.html
        styles.CSS
        script.js
    /backend
        server.js
        database.sql

/deliverables
    team_deliverables
        
README.txt

--------------------------------------------------
HOW TO INSTALL & RUN THE PROJECT
--------------------------------------------------

PREREQUISITES:
- Node.js installed on your machine.
- A modern web browser.

1. BACKEND SETUP:
   - Open a terminal in the root directory of the project.
   - Install the necessary dependencies (this reads the package.json file in the root):
     > npm install
   - Navigate to the backend directory and start the server:
     > cd src/backend
     > node server.js
   - You should see "Server running on http://localhost:3000".

2. FRONTEND SETUP:
   - Ensure the backend server is running.
   - Navigate to the `src/frontend` folder in your file explorer.
   - Simply double-click `index.html` to open it in your browser (or use VS Code Live Server).
   - You are now ready to use the application!

TESTING:
   - Currently, all testing is performed manually through the browser by simulating customer workflows (navigating the menu, filtering, testing cart calculations, and completing checkout).