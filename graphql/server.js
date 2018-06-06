const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const fetch = require('node-fetch');
const https = require('https');
const agent = new https.Agent({
    rejectUnauthorized: false
})

// The GraphQL schema in string form
const typeDefs = `
  type Query { tasks: [Task] }
  type Task { id: ID, name: String, isComplete: Boolean, completionDate: String }
`;

// The resolvers
const resolvers = {
  Query: { tasks: () => 
    fetch('https://localhost:5001/api/tasks/', {agent})
        .then(r => r.json()) 
    },
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Initialize the app
const app = express();

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Start the server
app.listen(3000, () => {
  console.log('Go to http://localhost:3000/graphiql to run queries!');
});