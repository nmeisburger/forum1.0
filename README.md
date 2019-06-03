# forum
Forum is web app that allows users to share their ideas and view the ideas shared by others. The app allows users to create an account, login and write posts for that explain their idea. Other users can then view the ideas that have been posted on the app and up vote the ones they like the best. The app also provides an admin level access that allows for the monitoring and removal of posts.

## Development 

The following assumes that you have mongodb installed on your computer. You can check this by running 
`$ mongod --version` and `$ mongo --version`

### Running the app locally in development mode

1. Run `$ npm run setup` to install the necessary dependencies for the frontent and backend portions of the app.

2. Run `$ npm run start` to run the app using node to run the server. This means that the local version of the server you are running will not reflect any changes made to the backend until you stop and rerun the server.

3. Run `$ npm run dev` to run the app using nodemon to run the server. This means that the local version of the server will automatically update as you make changes to the backend, without having to stop and rerun the server.

The app defaults to using `http://localhost:5000` to locally host the server. This can be changed by changing the value of the `SERVER_PORT` variable in `./server/server.js`.

The app defaults to using `mongodb://localhost/database` as the database for the app. This can be changed by changing the value of the `DB_ROUTE` variable in `./server/server.js`.

## App Features

At the initial login screen users have a choice between logining in directly with an existing account, or making a new account. After they login or create an account they will arrive at a page that shows the various posts made by other users, and will give them the ability to up vote posts that they like. They will also be able to create new posts themselves. The app also supports admin level permissions. Admins will login from the same login screen, but will then see a slightly different menu. They will be able to see all of the posts with the ability to remove offensive of inappropriate messages, or they will be able to switch views and see a list of all of the users on the site, with the ability to promote other users to admin should that be necessary.

## Contributors
- Nicholas Meisburger ([nmeisburger0](https://github.com/nmeisburger0))
