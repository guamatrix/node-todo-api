const { ObjectID } = require('mongodb');

const objectIDverify = (req, res, next) => {
  const { id } = req.params;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  next();
};

module.exports = { objectIDverify };
