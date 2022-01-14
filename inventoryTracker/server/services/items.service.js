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
    if (item.id == undefined) {
      item["id"] = await this.findId();
    }
    await this.collection.insertOne(item);
  }

  /**
   * @param item : the item to modify
   */
  async editItem(item) {
    await this.collection.findOneAndUpdate({id: item.id}, {"$set" : item}); 
  }

  async findId() {
    let allItems = await this.getAllItems();
    let potentialId = 1;
    // Loop to avoid duplicating an ID if an item was deleted
    while (allItems.some((element) => element.id === potentialId)) {
      potentialId++;
    }
    return potentialId;
}
}

module.exports = { ItemsService };
