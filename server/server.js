const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const {typeDefs, resolvers} = require('./schemas');

//Auth Util
const {authMiddleware} = require('./utils/auth');

const express = require('express');
const path = require('path');
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => authMiddleware({req}),
  // context: authMiddleware,
  introspection: true
});

const startApolloServer = async () => {

  await server.start();

  //Middleware
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
    console.log(`GraphQL Running @ http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startApolloServer();