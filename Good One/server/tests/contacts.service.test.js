const { MongoMemoryServer } = require('mongodb-memory-server');
const { dbService } = require('../services/database.service');
const { ContactsService } = require('../services/contacts.service');

describe('ContactsService tests', () => {
  let mongoServer;
  let uri = '';
  let service;
  const collectionName = 'contacts';

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
    await dbService.connectToServer(uri);
    await dbService.db.createCollection(collectionName);
    service = new ContactsService();
    service.dbService = dbService;
  });

  afterEach(() => {
    dbService.client.close();
    mongoServer.stop();
  });

  it('should get all Contacts', async () => {
    const contact1 = { id: 1, name: 'Test', email: 'a@b.ca', message: 'test' };
    const contact2 = { id: 2, name: 'Test', email: 'a@b.ca', message: 'test' };

    await dbService.db.collection(collectionName).insertMany([contact1, contact2]);
    const allContacts = await service.getAllContacts();
    expect(allContacts.length).toEqual(2);
  });

  it('should add a new Contacts', async () => {
    const contact1 = { id: 1, name: 'Test', email: 'a@b.ca', message: 'test' };

    await service.addNewContact(contact1);
    const allContacts = await service.getAllContacts();
    expect(allContacts.length).toEqual(1);
    expect(allContacts[0]).toEqual(contact1);
  });

  it('should delete a Contact based on id', async () => {
    const contact1 = { id: 1, name: 'Test', email: 'a@b.ca', message: 'test' };
    const contact2 = { id: 2, name: 'Test', email: 'a@b.ca', message: 'test' };

    await dbService.db.collection(collectionName).insertMany([contact1, contact2]);
    await service.deleteContactById(1);
    const allContacts = await service.getAllContacts();
    expect(allContacts.length).toEqual(1);
    expect(allContacts[0]).toEqual(contact2);
  });

  it('should call populateDb() of DatabaseService', async () => {
    const spy = jest.spyOn(service.dbService, 'populateDb').mockImplementation(() => {});

    await service.populateDb();
    expect(spy).toHaveBeenCalled();
  });
});
