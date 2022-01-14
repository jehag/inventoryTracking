const express = require('express');
const cors = require('cors');
const { dbService } = require('./services/database.service');
const { ItemsController } = require('./controllers/items.controller');

const PORT = 5000;
const app = express();
const SIZE_LIMIT = '50mb';
const itemsController = new ItemsController();

// display every request in the console
app.use((request, response, next) => {
  console.log(`New HTTP request: ${request.method} ${request.url}`);
  next();
});

app.use(cors());

app.use(express.json({ limit: SIZE_LIMIT, extended: true }));
app.use(express.urlencoded({ limit: SIZE_LIMIT, extended: true }));

// Routing
app.use('/api/items', itemsController.router);

const server = app.listen(PORT, () => {
  dbService.connectToServer().then(() => {
    console.log(`Listening on port ${PORT}.`);
  });
});

module.exports = server;
