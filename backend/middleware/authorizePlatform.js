exports.authorizePlatformRole = (...allowedRoles) => {
  return (req, res, next) => {
    // if (
    //   req.authUser.is_deleted != 0 ||
    //   req.authUser.status != status_user.active
    // ) {
    //   return res.status(403).json({ message: "User is inactive" });
    // }

    if (!req.authUser || !allowedRoles.includes(req.authUser.role)) {
      return res.status(403).json({ message: "Access denied (platform role)" });
    }
    next();
  };
};
