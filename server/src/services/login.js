function checkLogin(req, res, next) {
    const isLoggedIn = true;
    if (!isLoggedIn) {
        return res.status(401).json({
            error: 'Not authorized',
        }); 
    }
    next();
}