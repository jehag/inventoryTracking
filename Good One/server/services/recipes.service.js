const { dbService } = require('./database.service');
const defaultItems = require('../data/defaultItems.json');

const ITEMS_COLLECTION = 'items';

class RecipesService {
  constructor() {
    this.dbService = dbService;
  }

  /**
   * @returns la collection de recettes de la BD
   */
  get collection() {
    return this.dbService.db.collection(ITEMS_COLLECTION);
  }

  /**
   * TODO : Récupérer toutes les recettes de la collection
   * @returns les recettes de la collection
   */
  async getAllItems() {
    return this.collection.find().toArray();
  }

  /**
   * TODO : Récupérer toutes les recettes de la collection
   * @returns les recettes de la collection
   */
     async editItem(item) {
      return this.collection.findOneAndUpdate(item.id, {name:item.name});
    }
  

  // /**
  //  * TODO : Récupérer une recette selon son id
  //  * @param {string} id : le id qui correspond à la recette que l'on cherche
  //  * @returns la recette correspondante
  //  */
  // async getRecipeById(id) {
  //   return this.collection.findOne({ id: Number(id) });
  // }

  // /**
  //  * TODO : Récupérer des recettes selon leur catégorie
  //  * @param {string} category : la catégorie qui correspond aux recettes que l'on cherche
  //  * @returns les recettes correspondantes
  //  */
  // async getRecipesByCategory(category) {
  //   return this.collection.find({ categorie: category }).toArray();
  // }

  // /**
  //  * TODO : Récupérer des recette par ingrédient
  //  * @param {string} ingredient : nom de l'ingrédient à rechercher
  //  * @param {boolean} matchExact : cherche le nom exact d'ingrédient si true, sinon cherche un nom partiel
  //  * @returns les recettes trouvées ou un tableau vide
  //  */
  // async getRecipesByIngredient(ingredient, matchExact) {
  //   const recettes = await this.getAllRecipes();
  //   return matchExact
  //     ? recettes.filter((recette) => recette.ingredients.some((ing) => ing.nom === ingredient))
  //     : recettes.filter((recette) => recette.ingredients.some((ing) => ing.nom.includes(ingredient)));
  // }

  /**
   * TODO : Supprimer la recette de la collection en fonction de son id
   * @param {string} id : id de la recette à supprimer
   * @returns le résultat de la modification
   */
  async deleteRecipeById(id) {
    return this.collection.findOneAndDelete({
      id: Number(id),
    });
  }

  /**
   * TODO : Ajouter une recette à la liste des recettes
   * @param {*} item : la nouvelle recette à ajouter
   */
  async addNewRecipe(item) {
    //const items = await this.getAllRecipes();
    // let potentialId = items.length + 1;
    // // Loop to avoid duplicating an ID if a recipe was deleted
    // while (recipes.some((element) => element.id === potentialId)) {
    //   potentialId--;
    // }
    // recipe.id = potentialId;
    await this.collection.insertOne(item);
  }

  /**
   * TODO : Ajouter une recette à la liste des recettes
   * @param {*} item : la nouvelle recette à ajouter
   */
     async modifyName(item) {
      const items = await this.getAllRecipes();
      let itemToMod = this.collection.findOne(item.id);
      itemToMod.name = item.name;
      itemToMod.price = item.price;
      await this.getAllRecipes();
    }

  /**
   * Réinitialiser les recettes en supprimant la collection puis en la repeuplant
   */
  async resetItems() {
    await this.collection.deleteMany({});
    this.populateDb();
  }

  /**
   * Remplir la collection avec les recettes par défaut
   */
  async populateDb() {
    await this.dbService.populateDb(ITEMS_COLLECTION, defaultItems.items);
  }
}

module.exports = { RecipesService };
