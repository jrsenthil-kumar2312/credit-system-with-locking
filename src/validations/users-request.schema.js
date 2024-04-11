const addUserSchema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    username: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
  },
  required: [
    'firstName',
    'lastName',
    'username',
    'password',
  ],
  additionalProperties: false,
};

export {
  addUserSchema,
};
