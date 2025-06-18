const adminAuth = (req, res, next) => {
  console.log("The auth middleware is called!");
  const token = "xyz";
  const isAdminAuthenticated = token === "xyz";
  if (!isAdminAuthenticated) {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("The user middleware is called!");
  const token = "xyz33";
  const isAdminAuthenticated = token === "xyz";
  if (!isAdminAuthenticated) {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
};

module.exports = {
    adminAuth,
    userAuth
}
