const {ApolloServer} = require('apollo-server-express');
const {typeDefs, resolvers} = require('./schemas');

//Auth Util
const {authMiddleware} = require('./utils/auth');

const express = require('express');
const path = require('path');
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function startApolloServer(typeDefs,resolvers){
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => authMiddleware({req})
  });
  
  await server.start();
  server.applyMiddleware({ app });
  console.log(`GraphQL Running @ http://localhost:${PORT}${server.graphqlPath}`);
}

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});

startApolloServer(typeDefs,resolvers);