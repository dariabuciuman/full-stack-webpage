const authenticateRole = (roles) => {
  return (req, res, next) => {
    const role = req.body.role;
    if (roles.includes(role)) {
      next();
    } else return res.status(401).json("Access denied");
  };
};

module.exports = { authenticateRole };
