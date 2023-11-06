const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

const authMiddleware = (context) => {
  // allows token to be sent via  req.query or headers, or req.body
  let token = context.body.token || context.query.token || context.headers.authorization;

  if(context.headers.authorization){
    token = token.split(' ').pop().trim();
  }

  if(!token){
    return context;
  } 

  try{
    const {data} = jwt.verify(token, secret, {maxAge: expiration});
    context.user = data;
  } catch {
    console.log('Invalid token');
  }

  //Return Request Object for GraphQL
  return context;
}

const signToken = ({username, email, _id}) => {
  const payload = {username, email, _id};
  return jwt.sign({data: payload}, secret, {expiresIn: expiration});
}

module.exports = {authMiddleware, signToken};