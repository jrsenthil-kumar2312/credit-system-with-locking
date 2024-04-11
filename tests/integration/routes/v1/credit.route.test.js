import { readFile } from 'fs/promises';
import {
  request, expect, httpStatus, server,
} from '../../setup.test.js';
import { truncateTables, insertUserData, insertCreditData } from '../../../db.test.js';

let userData;
let creditData;
let authToken;

describe('Credit Endpoint', () => {
  before((async () => {
    userData = JSON.parse(await readFile(
      new URL('../../../fixtures/user.input.json', import.meta.url),
    ));
    creditData = JSON.parse(await readFile(
      new URL('../../../fixtures/credit.input.json', import.meta.url),
    ));
    await truncateTables();
    await insertUserData(userData.validInsert);
    await insertCreditData(creditData.validInsert);

    authToken = await request(server)
      .post('/v1/users/login')
      .send({ username: 'mark_anthony', password: 'password' });
  }));

  describe('POST /v1/credit/users/userId', () => {
    it('should return 200 and successfully return balance credit for the user', async () => {
      const res = await request(server)
        .get('/v1/credit/users/1/balance')
        .set('Authorization', `Bearer ${authToken.body.token}`);
        // .expect(httpStatus.OK);

      expect(res.body.success).to.equal(true);
      expect(res.body.body.creditBalance).to.equal(100);
    });

    it('should return 200 and successfully added credit for the user', async () => {
      const res = await request(server)
        .post('/v1/credit/users/1/add')
        .set('Authorization', `Bearer ${authToken.body.token}`)
        .send(creditData.validAdd)
        .expect(httpStatus.OK);

      expect(res.body.success).to.equal(true);
    });

    it('should return error if input schema validation fails', async () => {
      const res = await request(server)
        .post('/v1/credit/users/1/add')
        .set('Authorization', `Bearer ${authToken.body.token}`)
        .send(creditData.addSchemaError)
        .expect(httpStatus.BAD_REQUEST);

      expect(res.body.success).to.be.false;
      expect(res.body.error).to.have.property('body');
    });

    it('should return 200 and successfully deducted credit for the user', async () => {
      const res = await request(server)
        .post('/v1/credit/users/1/deduct')
        .set('Authorization', `Bearer ${authToken.body.token}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body.success).to.equal(true);
    });

    it('should return 200 and successfully return balance credit for the user', async () => {
      const res = await request(server)
        .post('/v1/credit/users/1/recalculate')
        .set('Authorization', `Bearer ${authToken.body.token}`)
        .expect(httpStatus.OK);

      expect(res.body.success).to.equal(true);
    });
  });
});
