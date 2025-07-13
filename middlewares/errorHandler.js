module.exports.errorHandler = async (error, req, res, next) => {
  return res.status(500).send({ message: error?.message || 'Something went wrong!', status: error?.status || 500 });
};

