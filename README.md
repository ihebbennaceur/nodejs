# Support Ticket Management System
# Description: Develop a platform where users can submit technical support tickets and track their resolution.
# Features:
● Authentication (users and administrators)
● Ticket creation, updates, and closure
● Ticket assignment to support agents
● Email notifications on ticket status
● Dashboard for performance tracking

# Install dependencies:
npm install

# Create a .env file in the root directory and add the following environment variables:

PORT=9092
MONGO_URI=mongodb://localhost:27017/support-ticket-system
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_outlook_email@example.com
EMAIL_PASS=your_outlook_password

# start application
nodemon

# API Endpoints
Authentication
## Register a new user

URL: http://localhost:9092/register
Method: POST


## Login 
/login
methode :Post

## create tickets : 
/api/tickets
methode : Post

## get all ticket for the current connected user
/api/tickets
methode: get

## all users
/api/users
methode : get

## update ticket : 
/api/tickets/{ticket_id}

## assign agent :
/api/tickets/assign/67cffe2317c3908d7deedde3
## close ticket
/api/tickets/67cffe2317c3908d7deedde3/close


