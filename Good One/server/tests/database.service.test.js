/* eslint-disable no-undef */
const { MongoMemoryServer } = require('mongodb-memory-server');
const { dbService } = require('../services/database.service');

describe('Database tests', () => {
  let mongoServer;
  let uri = '';
  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
  });

  afterEach(() => {
    dbService.client.close();
    mongoServer.stop();
  });

  it('should connect to the database', async () => {
    await dbService.connectToServer(uri);
    expect(dbService.client).not.toBeUndefined();
  });

  it('should populate a collection', async () => {
    const contact1 = { id: 1, name: 'Test', email: 'a@b.ca', message: 'test' };
    const contact2 = { id: 2, name: 'Test', email: 'a@b.ca', message: 'test' };

    const collectionName = 'contacts';
    await dbService.connectToServer(uri);
    await dbService.db.createCollection(collectionName);
    await dbService.populateDb(collectionName, [contact1, contact2]);
    const insertedContacts = await dbService.db.collection(collectionName).find({}).toArray();
    expect(insertedContacts.length).toEqual(2);
    expect(insertedContacts).toEqual([contact1, contact2]);
  });

  it('should not populate a collection if data exsits', async () => {
    const contact1 = { id: 1, name: 'Test', email: 'a@b.ca', message: 'test' };
    const contact2 = { id: 2, name: 'Test', email: 'a@b.ca', message: 'test' };

    const collectionName = 'contacts';
    await dbService.connectToServer(uri);
    await dbService.db.createCollection(collectionName);
    await dbService.db.collection(collectionName).insertOne(contact1);
    await dbService.populateDb(collectionName, [contact1, contact2]);
    const insertedContacts = await dbService.db.collection(collectionName).find({}).toArray();
    expect(insertedContacts.length).toEqual(1);
    expect(insertedContacts).toEqual([contact1]);
  });
});
