const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {  
  //  console.log(req.body.cart);
     const cart = req.body.cart
    /* try { 
            const cart = req.body.cart
            const decoded= jwt.verify(cart, process.env.JWT_KEY);
            req.userData = decoded;
           // console.log(req.userData);
            next();
        } catch( error) {
            return res.status(401).json({
                message: 'pas de panier'
            });
        }  */
       // const decoded= jwt.verify(cart, process.env.JWT_KEY);
      //  req.userData = decoded;
      // console.log(req.userData);
     //  console.log(req.body.id);


      /*  if(!req.body.cart) {
        console.log('cart verifier pas de cart');
        cart = {  };
      //  next();
        } else */
       {
            console.log('cart verifier  ');
            try {
                
                cart = jwt.verify(req.body.cart,  process.env.JWT_KEY,cartVerifyJwtOptions)
                      
            } catch(e) {
                newCart = { items: [] }; 
            }
        }
      //  console.log(newCart);
        next(); 
};