const express = require('express');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// turn on routes
app.use(routes);

const sequelize = require('./config/connection');

const models =  require("./models");

// turn on connection to db and server
sequelize.sync({ force: false })
.then(() => {
  app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
});
