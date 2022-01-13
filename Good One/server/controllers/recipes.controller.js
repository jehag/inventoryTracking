const recettesRouter = require('express').Router();
const { HTTP_STATUS } = require('../utils/http');
const { RecipesService } = require('../services/recipes.service');

class RecipesController {
  constructor() {
    this.recipesService = new RecipesService();
    this.router = recettesRouter;
    this.configureRouter();
  }

  /**
   * Configurer toutes les routes pour les recettes lors de l'initialisation
   */
  configureRouter() {
    /**
     * @returns toutes les recettes sauvegardées
     */
    this.router.get('/', async (req, res) => {
      const recipes = await this.recipesService.getAllItems();
      res.json(recipes);
    });

    /**
     * Ajouter la nouvelle recette dans la BD
     */
    this.router.post('/', async (req, res) => {
      try {
        if (!Object.keys(req.body).length) {
          res.status(HTTP_STATUS.BAD_REQUEST).send();
          return;
        }
        const newRecipe = req.body;
        let itemAdded = await this.recipesService.addNewRecipe(newRecipe);
        res.status(HTTP_STATUS.CREATED).send();
        return itemAdded;
      } catch (error) {
        res.status(HTTP_STATUS.SERVER_ERROR).send();
      }
    });

    /**
     * Renvoyer une recette spécifique selon un id
     * @returns la recette si le id existe. Sinon, le code d'erreur approprié
     */
    this.router.get('/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const recipe = await this.recipesService.getRecipeById(id);
        if (!recipe) res.status(HTTP_STATUS.NOT_FOUND).send();
        else res.json(recipe);
      } catch (error) {
        res.status(HTTP_STATUS.SERVER_ERROR).send();
      }
    });

    /**
     * Supprimer une recette spécifique selon un id
     */
    this.router.delete('/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const deletedElement = await this.recipesService.deleteRecipeById(id);
        const status = deletedElement.value ? HTTP_STATUS.NO_CONTENT : HTTP_STATUS.NOT_FOUND;
        res.status(status).send();
      } catch (error) {
        res.status(HTTP_STATUS.SERVER_ERROR).send();
      }
    });

    /**
     * Renvoyer les recettes spécifiques selon une catégorie
     * @returns les recettes appartenant à une catégorie
     */
    this.router.get('/category/:category', async (req, res) => {
      try {
        const { category } = req.params;
        const recipes = await this.recipesService.getRecipesByCategory(category);
        res.json(recipes);
      } catch (error) {
        res.status(HTTP_STATUS.SERVER_ERROR).send();
      }
    });

    /**
     * Renvoyer les recette spécifiques selon un ingrédiants et matchExact
     * @ingredient fait partie des paramètres de la requête
     * @matchExact fait partie de la query de la requête
     * @returns les recettes ayant ces ingrédiants
     */
    this.router.get('/ingredient/:ingredient', async (req, res) => {
      try {
        const { ingredient } = req.params;
        const matchExact = req.query.matchExact !== undefined;
        const recipes = await this.recipesService.getRecipesByIngredient(ingredient, matchExact);
        res.json(recipes);
      } catch (error) {
        res.status(HTTP_STATUS.SERVER_ERROR).send();
      }
    });

    this.router.post('/editItem', async (req, res) => {
      try {
        const item = req.body;
        const recipes = await this.recipesService.modifyItem(item);
        res.json(recipes);
      } catch (error) {
        res.status(HTTP_STATUS.SERVER_ERROR).send();
      }
    });

    /**
     * Permet de remplacer la liste des recettes par la liste par défaut
     */
    this.router.patch('/admin/reset', async (req, res) => {
      try {
        await this.recipesService.resetRecipes();
        res.status(HTTP_STATUS.SUCCESS).send();
      } catch (error) {
        res.status(HTTP_STATUS.SERVER_ERROR).send();
      }
    });
  }
}
module.exports = { RecipesController };
