const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

const authMiddleware = (req) => {
  // allows token to be sent via  req.query or headers, or req.body
  let token = req.body.token || req.query.token || req.headers.authorization;

  if(req.headers.authorization){
    token = token.split(' ').pop().trim();
  }

  if(!token){
    return req;
  } 

  try{
    const {data} = jwt.verify(token, secret, {maxAge: expiration});
    req.user = data;
  } catch {
    console.log('Invalid token');
  }

  //Return Request Object for GraphQL
  return req;
}

const signToken = ({username, email, _id}) => {
  const payload = {username, email, _id};
  return jwt.sign({data: payload}, secret, {expiresIn: expiration});
}

module.exports = {authMiddleware, signToken};