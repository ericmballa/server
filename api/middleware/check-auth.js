const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    try{
       // const token = req.headers.authorization.split(' ')[0];;
       const token = req.body.token;
        //console.log(req.headers.authorization);
        //console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
       req.userData = decoded;
       // console.log(decoded);
       // return request.userData;
        next();
    } catch(error)
    {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};