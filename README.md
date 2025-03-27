# Angular Admin Panel with Authentication & Worker Management System

This project is built using **Angular 16**, **JSON Server**, and **Angular Material UI**. It provides an admin panel where users can sign up, log in, and manage workers.  

## Technologies Used  
- **Angular 16**  
- **Angular Material**   
- **JSON Server**

## How It Works  

### Authentication: 
  - Admins can **sign up** and **log in**.  
  - Once logged in, a token is stored locally, and users are redirected to the admin panel.  
  - If a user has a token, they can't access the login/signup page.  

### Admin Panel:  
  - Admins can **check existing workers and also add, edit, delete workers**.  
  - Each worker is linked to the admin who created them.  

## Installation & Setup  

### Clone the Repository: 
   - git clone https://github.com/asl1n/AdminPanel.git

  -  cd AdminPanel

### Install Dependencies:

- npm install

### Download and start JSON Server:
 
 - npm install -g json-server

- json-server --watch db.json

### Run Angular App:

- ng serve