const addCreditSchema = {
  type: 'object',
  properties: {
    amount: {
      type: 'number',
    },
  },
  required: [
    'amount',
  ],
  additionalProperties: false,
};

export {
  addCreditSchema,
};
