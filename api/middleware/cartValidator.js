const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {  
  //  console.log(req.body.cart);
     const cart = req.body.cart
   
       {
            console.log('cart verifier  ');
            try {
                
                cart = jwt.verify(req.body.cart, 'ericomballus', cartVerifyJwtOptions)
                      
            } catch(e) {
                newCart = { items: [] }; 
            }
        }
      //  console.log(newCart);
        next(); 
};

//process.env.JWT_KEY