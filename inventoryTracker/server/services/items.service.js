const { dbService } = require('./database.service');

const ITEMS_COLLECTION = 'items';

class ItemsService {
  constructor() {
    this.dbService = dbService;
  }

  /**
   * @returns the collection of items in the database
   */
  get collection() {
    return this.dbService.db.collection(ITEMS_COLLECTION);
  }

  /**
   * @returns the items of the collection
   */
  async getAllItems() {
    return this.collection.find().toArray();
  }

  /**
   * @param id : the id corresponding to the item we're looking for
   * @returns the corresponding item
   */
  async getItemById(id) {
    return this.collection.findOne({ id: Number(id) });
  }

  /**
   * @param id : the id corresponding to the item we want to delete
   * @returns the promise that the item has been deleted
   */
  async deleteItemById(id) {
    return await this.collection.findOneAndDelete({
      id: Number(id),
    });
  }

  /**
   * @param item : the new item to add
   */
  async addNewItem(item) {
    await this.collection.insertOne(item);
  }

  /**
   * @param item : the item to modify
   * @returns the promise that the item has been modified
   */
    async editItem(item) {
      let itemToMod = await this.collection.findOneAndUpdate({id: Number(item.id)}, {"$set" : {name:item.name, price:item.price}});
      return itemToMod;
    }
}

module.exports = { ItemsService };
