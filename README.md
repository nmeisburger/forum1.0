# forum
Forum is web app that allows users to share their ideas and view the ideas shared by others. The app allows users to create an account, login and write posts for that explain their idea. Other users can then view the ideas that have been posted on the app and up vote the ones they like the best. The app also provides an admin level access that allows for the monitoring and removal of posts.

## Development 

The following assumes that you have mongodb installed on your computer. You can check this by running 
`$ mongod --version` and `$ mongo --version`

### Running the app locally in development mode

1. Run `$ npm run setup` to install the necessary dependencies for the frontent and backend portions of the app.
2. There are now 2 options for running the app locally:
a. Run `$ npm run start` to run the app using node to run the server. This means that the local version of the server you are running will not reflect any changes made to the backend until you stop and rerun the server.
b. Run `$ npm run dev` to run the app using nodemon to run the server. This means that the local version of the server will automatically update as you make changes to the backend, without having to stop and rerun the server.
