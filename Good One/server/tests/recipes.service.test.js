const { MongoMemoryServer } = require('mongodb-memory-server');
const { dbService } = require('../services/database.service');
const { RecipesService } = require('../services/recipes.service');

describe('ContactsService tests', () => {
  let mongoServer;
  let uri = '';
  let service;
  const collectionName = 'recipes';

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
    await dbService.connectToServer(uri);
    await dbService.db.createCollection(collectionName);
    service = new RecipesService();
    service.dbService = dbService;
  });

  afterEach(() => {
    dbService.client.close();
    mongoServer.stop();
    jest.clearAllMocks();
  });

  it('should get all Recipes', async () => {
    const recipe1 = { nom: 'Recette Test' };
    const recipe2 = { nom: 'Recette Test 2' };
    await dbService.db.collection(collectionName).insertMany([recipe1, recipe2]);
    const allContacts = await service.getAllRecipes();
    expect(allContacts.length).toEqual(2);
  });

  it('should get a specific Recipe by id', async () => {
    const recipe1 = { nom: 'Recette Test', id: 1 };
    const recipe2 = { nom: 'Recette Test 2', id: 2 };
    await dbService.db.collection(collectionName).insertMany([recipe1, recipe2]);
    const recipe = await service.getRecipeById(2);
    expect(recipe).toEqual(recipe2);
  });

  it('should get all Recipes of a category', async () => {
    const recipe1 = { nom: 'Recette Test', id: 1, categorie: 'keto' };
    const recipe2 = { nom: 'Recette Test 2', id: 2, categorie: 'vege' };
    const recipe3 = { nom: 'Recette Test 3', id: 3, categorie: 'keto' };
    await dbService.db.collection(collectionName).insertMany([recipe1, recipe2, recipe3]);
    const recipes = await service.getRecipesByCategory('keto');
    expect(recipes).toEqual([recipe1, recipe3]);
  });

  it('should get all Recipes with a specific ingredient without a specific match', async () => {
    const ingredient = 'oignon';
    const recipe1 = {
      nom: 'Recette Test',
      id: 1,
      categorie: 'keto',
      ingredients: [
        {
          nom: 'oignon',
          quantite: '1',
        },
        {
          nom: 'fromage halloumi',
          quantite: '235g',
        },
      ],
    };
    const recipe2 = {
      nom: 'Recette Test 2',
      id: 2,
      categorie: 'vege',
      ingredients: [
        {
          nom: 'oignon rouge',
          quantite: '1',
        },
        {
          nom: 'fromage halloumi',
          quantite: '235g',
        },
      ],
    };
    await dbService.db.collection(collectionName).insertMany([recipe1, recipe2]);
    const recipes = await service.getRecipesByIngredient(ingredient, false);
    expect(recipes).toEqual([recipe1, recipe2]);
  });

  it('should get all Recipes with a specific ingredient with exact match', async () => {
    const ingredient = 'oignon';
    const recipe1 = {
      nom: 'Recette Test',
      id: 1,
      categorie: 'keto',
      ingredients: [
        {
          nom: 'oignon',
          quantite: '1',
        },
        {
          nom: 'fromage halloumi',
          quantite: '235g',
        },
      ],
    };
    const recipe2 = {
      nom: 'Recette Test 2',
      id: 2,
      categorie: 'vege',
      ingredients: [
        {
          nom: 'oignon rouge',
          quantite: '1',
        },
        {
          nom: 'fromage halloumi',
          quantite: '235g',
        },
      ],
    };
    await dbService.db.collection(collectionName).insertMany([recipe1, recipe2]);
    const recipes = await service.getRecipesByIngredient(ingredient, true);
    expect(recipes).toEqual([recipe1]);
  });

  it('should delete a Recipe based on id', async () => {
    const recipe1 = { nom: 'Recette Test', id: 1, categorie: 'keto' };
    const recipe2 = { nom: 'Recette Test 2', id: 2, categorie: 'vege' };
    const recipe3 = { nom: 'Recette Test 3', id: 3, categorie: 'keto' };
    await dbService.db.collection(collectionName).insertMany([recipe1, recipe2, recipe3]);
    await service.deleteRecipeById(2);
    const recipes = await service.getAllRecipes();
    expect(recipes).toEqual([recipe1, recipe3]);
  });

  it('should add a new Recipe', async () => {
    const recipe1 = { nom: 'Recette Test', id: 1, categorie: 'keto' };

    await service.addNewRecipe(recipe1);
    const allRecipes = await service.getAllRecipes();
    expect(allRecipes.length).toEqual(1);
    expect(allRecipes[0]).toEqual(recipe1);
  });

  it('should reset all data', async () => {
    const spyPopulate = jest.spyOn(service, 'populateDb').mockImplementation(() => {});
    await service.resetRecipes();
    expect(spyPopulate).toHaveBeenCalled();
  });

  it('should call populateDb() of DatabaseService', async () => {
    const spy = jest.spyOn(service.dbService, 'populateDb').mockImplementation(() => {});

    await service.populateDb();
    expect(spy).toHaveBeenCalled();
  });
});
