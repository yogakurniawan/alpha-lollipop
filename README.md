# Cerebral API

LoopBack app to be used as the backend for [Cerebral App](https://cerebral-app.herokuapp.com/)

### About

This app is a Node.js app but it is built on top of [LoopBack](http://loopback.io/). Therefore you need to have Node.js and Strongloop installed.

The app also uses these technologies :
- [SendGrid](https://sendgrid.com)
- [socket.io](http://socket.io/)

### Installation

```bash
npm install
```

### Run

```bash
node .
```
Open `localhost:9000/explorer` in your browser

### Code Structure

The project is structured in the following way:

- `client`: this folder is supposed to contain static assets like HTML or CSS files.
In the best case scenario you shouldn't need to put anything in there since this is supposed
to stay as a pure API app.

- `common`: contains that can be used in other parts of the app, mainly models.

  - `mixins`: contains files that are not tied to an specific model, instead they can be used to extend a model to add an specific functionality. E.g. add archiving methods to an `Event` model. Note that this files does not handle creating the necessary fields in the model.

    Each mixin have specific requirements that needs to be met. You can find those right before the `module.exports` call in each mixin file.

  - `models`: the files inside this folder provide the interface between the API and the datasource. Each model is represented by at least two files: a .js file and a .json file.

    The .json file specifies the attributes of the model: properties, access control lists, methods, etc.

    The .js file is for you to extend the default model functionality and properties.


- `server`: contains configuration files for the datasources, middleware and models as well as the starting script `server.js`.

  - `boot` folder, this folder contains scripts that will be run each time the servers boots up, this is the ideal place to create seed files, configuration loading scripts and so on.


Since this is an API most of the logic is inside the models and mixins.


### Deployment

At the moment of writing this, the app is being deployed to Heroku. You will need to set the right buildpack for your Heroku app to make it work. [This](https://docs.strongloop.com/display/SL/Heroku) link offers details on how to do it.

The most important piece is running
```bash
heroku apps:create --buildpack https://github.com/strongloop/strongloop-buildpacks.git
```

or

```
heroku buildpack:set https://github.com/strongloop/strongloop-buildpacks.git
```
if the app already exists.

Also remember to set `NODE_ENV` to `production` so things like the API Explorer is not available.