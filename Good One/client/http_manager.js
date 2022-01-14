const HTTPInterface = {
  SERVER_URL: "http://localhost:5000/api",

  GET: async function (endpoint) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`);
    return await response.json();
  },

  POST: async function (endpoint, data) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    });
    return await response.json();
  },

  DELETE: async function (endpoint) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
    });
    return await response.status;
  },

  PATCH: async function (endpoint) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "PATCH",
    });
    return response.status;
  },
};

export default class HTTPManager {
  constructor() {
    this.items = {};
    this.baseURL = "items";
  }

  /**
   * @todo Sends a GET request to /api/items to obtain all the items
   * @returns a promise that all the items have been fetched
   */
  async fetchAllItems() {
    return await HTTPInterface.GET(`${this.baseURL}`);
  }

  /**
   * Get all the items
   * @returns all the items on the server
   */
  async getAllItems() {
    return new Promise(async (resolve, reject) => {
      try {
        this.items = await this.fetchAllItems();
        resolve(this.items);
      } catch (err) {
        reject("Error in the GET request /api/items");
      }
    });
  }

  /**
   * @param id : the id corresponding to the item we want
   * @returns the item or towards /error.html if it doesn't exist
   */
  async getItemByID(id) {
    try {
      return await HTTPInterface.GET(`${this.baseURL}/${id}`);
    } catch (error) {
      window.location.href = "/error";
    }
  }

  /**
   * @param newItem
   */
  async addNewItem(newItem) {
    try {
      await HTTPInterface.POST(`${this.baseURL}`, newItem);
    } catch (error) {
      console.log("An error occured while POSTING the new item", error);
    }
  }

  /**
   * @param id: id of item to delete
   */
  async deleteItem(id) {
    try {
      await HTTPInterface.DELETE(`${this.baseURL}/${id}`);
    } catch (error) {
      console.log("An error occured while DELETING item", error);
    }
  }

  /**
   * @param item: item to edit
   */
  async editItem(item) {
    try {
      await HTTPInterface.POST(`${this.baseURL}/editItem`, item);
    } catch (error) {
      console.log("An error occured while POSTING new item", error);
    }
  }
}

export { HTTPManager };
