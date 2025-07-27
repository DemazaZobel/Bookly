export const isAdmin = (req, res, next) => {
    if (req.user && req.user.roleId === 1) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Admins only.' });
    }
  };
  