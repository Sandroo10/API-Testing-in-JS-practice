const Ajv2020 = require('ajv/dist/2020');
const addFormats = require('ajv-formats');

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

function validateResponse(schema, data) {
  const validate = ajv.compile(schema);
  const valid = validate(data);

  return { valid, errors: validate.errors || [] };
}

module.exports = { validateResponse };
