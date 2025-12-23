const adminAuth = (req, res, next) => {
  const adminSecret = process.env.ADMIN_SECRET;
  const providedSecret = req.headers['x-admin-secret'];
  
  if (!adminSecret || !providedSecret || providedSecret !== adminSecret) {
    return res.status(401).json({ error: 'Unauthorized: Invalid admin secret' });
  }
  
  next();
};

module.exports = { adminAuth };