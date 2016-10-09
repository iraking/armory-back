const controllerFactory = require('./');
const setupTestDb = require('../../../spec/helpers/setup-test-db');

const setupTestData = (models) => {
  return models
      .User
      .create({
        email: 'cool@email',
        passwordHash: 'coolpassword',
        alias: 'madou',
      })
      .then(() => {
        return models
          .User
          .findOne({
            where: {
              email: 'cool@email',
            },
          });
      })
      .then((data) => {
        return models
          .Gw2ApiToken
          .create({
            token: 'swag',
            accountName: 'nameyname',
            accountId: 'aaaa',
            permissions: 'cool,permissions',
            world: 1111,
            UserId: data.id,
          });
      })
      .then(() => {
        return models
          .Gw2Character
          .create({
            Gw2ApiTokenToken: 'swag',
            name: 'blastrn',
            gender: 'male',
            profession: 'Ranger',
            level: 123,
            created: new Date(),
            age: 1,
            guild: 'guild',
            race: 'Asura',
            deaths: 1,
          });
      })
      .then(() => {
        return models
          .Gw2Guild
          .create({
            name: 'Guild Name',
            id: 'guild',
            tag: '[tag]',
          });
      })
      .then(() => {
        return models
          .Gw2Character
          .create({
            Gw2ApiTokenToken: 'swag',
            name: 'ayyyyy',
            gender: 'female',
            profession: 'Necromancer',
            level: 21,
            created: new Date(),
            age: 1,
            race: 'Human',
            deaths: 1,
          });
      });
};

describe('statistics', () => {
  let models;
  let controller;

  beforeEach((done) => {
    return setupTestDb(true, {
      email: 'email@email.com',
      alias: 'cool-name',
      addTokens: true,
    })
    .then((dbModels) => {
      models = dbModels;
      controller = controllerFactory(models);

      return setupTestData(models);
    })
    .then(done);
  });

  it('should return user stats', (done) => {
    controller
      .users()
      .then((stats) => {
        expect(stats).toEqual({
          count: 2,
        });
      })
      .then(done);
  });

  it('should return guild stats', (done) => {
    controller
      .guilds()
      .then((stats) => {
        expect(stats).toEqual({
          count: 1,
        });
      })
      .then(done);
  });

  it('should return character stats', (done) => {
    controller
      .characters()
      .then((stats) => {
        expect(stats).toEqual({
          count: 2,
          gender: {
            male: 1,
            female: 1,
          },
          race: {
            Asura: 1,
            Human: 1,
          },
          profession: {
            Necromancer: 1,
            Ranger: 1,
          },
          level: {
            21: 1,
            123: 1,
          },
          guild: {
            yes: 1,
            no: 1,
          },
        });
      })
      .then(done);
  });
});