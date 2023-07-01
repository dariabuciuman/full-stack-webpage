# MERN full-stack application

This app aims to be an online shop that is specialized in PC parts and peripherals. The user can look for products posted by the store's administrators, add the products in cart (the application doesn't have the payment module implemented) and see the history of its orders. The admins have access to a page that can manage the products displayed on the online shop.

The technologies used in this application: ReactJS, NodeJS, ExpressJS, MongoDB.

## Instalation guide
In order to run this app, you need to have Node installed, preferably version 16.14.0, you can find it [here](https://nodejs.org/download/release/v16.14.0/).

For the frontend part, you need to install the dependencies by opening a command prompt, navigating to the client folder, and entering the `npm install` command.

To start the backend server, you need to navigate to the server folder in a command prompt and type `npm start`. To start the frontend server, you need to navigate to the client folder in a command prompt and type the same thing.

Now, for the server connection to MongoDB you need to create a file named `.env` and add the DB_URI and JWT_PRIVATE_KEY fields, completed with your data.

The `.env` file should have the format:

`DB_URI = mongodb://localhost:{your uri}`  
`JWT_PRIVATE_KEY = {a string of your choice}`
