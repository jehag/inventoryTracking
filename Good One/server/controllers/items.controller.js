const itemRouter = require('express').Router();
const { HTTP_STATUS } = require('../utils/http');
const { ItemsService } = require('../services/items.service');

class ItemsController {
  constructor() {
    this.itemsService = new ItemsService();
    this.router = itemRouter;
    this.configureRouter();
  }

  /**
   * Configure all the routes for the items
   */
  configureRouter() {
    /**
     * @returns all the items in the database
     */
    this.router.get('/', async (req, res) => {
      const items = await this.itemsService.getAllItems();
      res.json(items);
    });

    /**
     * Add a new item into the database
     */
    this.router.post('/', async (req, res) => {
      try {
        if (!Object.keys(req.body).length) {
          res.status(HTTP_STATUS.BAD_REQUEST).send();
          return;
        }
        const newItem = req.body;
        let itemAdded = await this.itemsService.addNewItem(newItem);
        res.status(HTTP_STATUS.CREATED).send();
        return itemAdded;
      } catch (error) {
        res.status(HTTP_STATUS.SERVER_ERROR).send();
      }
    });

    /**
     * Return a specific item, finding it by id
     * @returns the item if it exists, else returns an error code
     */
    this.router.get('/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const item = await this.itemsService.getItemById(id);
        if (!item) res.status(HTTP_STATUS.NOT_FOUND).send();
        else res.json(item);
      } catch (error) {
        res.status(HTTP_STATUS.SERVER_ERROR).send();
      }
    });

    /**
     * Delete an item with a specific id
     */
    this.router.delete('/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const deletedElement = await this.itemsService.deleteItemById(id);
        const status = deletedElement.value ? HTTP_STATUS.NO_CONTENT : HTTP_STATUS.NOT_FOUND;
        res.status(status).send();
      } catch (error) {
        res.status(HTTP_STATUS.SERVER_ERROR).send();
      }
    });

    /**
     * Edit a given item
     */
    this.router.post('/editItem', async (req, res) => {
      try {
        const item = req.body;
        const itemToMod = await this.itemsService.editItem(item);
        res.json(itemToMod);
      } catch (error) {
        res.status(HTTP_STATUS.SERVER_ERROR).send();
      }
    });
  }
}
module.exports = { ItemsController };
