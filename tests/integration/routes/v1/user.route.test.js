import { readFile } from 'fs/promises';
import {
  request, expect, httpStatus, server,
} from '../../setup.test.js';
import { truncateTables, insertUserData } from '../../../db.test.js';

let data;

describe('Users Endpoint', () => {
  before((async () => {
    data = JSON.parse(await readFile(
      new URL('../../../fixtures/user.input.json', import.meta.url),
    ));
  }));

  describe('POST /v1/users', () => {
    before(async () => {
      await truncateTables();
    });

    it('should return 201 and successfully create new user', async () => {
      const res = await request(server)
        .post('/v1/users')
        .send(data.validCreateUser)
        .expect(httpStatus.CREATED);

      expect(res.body).to.have.property('body');
      expect(res.body.body.id).to.not.be.undefined;
    });

    it('should return error if input schema validation fails', async () => {
      const res = await request(server)
        .post('/v1/users')
        .send(data.schemaError)
        .expect(httpStatus.BAD_REQUEST);

      expect(res.body.id).to.be.undefined;
      expect(res.body.success).to.be.false;
      expect(res.body.error).to.have.property('body');
    });
  });

  describe('GET /v1/users', () => {
    before(async () => {
      await truncateTables();
    });

    it('should return 200 and successfully fetched all available users', async () => {
      await insertUserData(data.validInsert);

      const res = await request(server)
        .get('/v1/users')
        .expect(httpStatus.OK);

      expect(res.body).to.have.property('body');
      expect(res.body.body).to.be.an('array');
      expect(res.body.body).not.empty;

      expect(res.body.body[0].id).to.not.be.undefined;
      expect(res.body.body[0].firstName).to.equal(data.validInsert.firstName);
      expect(res.body.body[0].lastName).to.equal(data.validInsert.lastName);
    });
  });

  describe('POST /v1/users/login', () => {
    before(async () => {
      await truncateTables();
    });

    it('should return 200 and authorization token', async () => {
      await insertUserData(data.validInsert);

      const res = await request(server)
        .post('/v1/users/login')
        .send(data.validLogin)
        .expect(httpStatus.OK);

      expect(res.body.token).not.empty;
    });
  });
});
