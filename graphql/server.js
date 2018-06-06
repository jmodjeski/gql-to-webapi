const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const axios = require('axios');
const https = require('https');
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
})

// The GraphQL schema in string form
const typeDefs = `
  type Query { 
    tasks: [Task] 
  }
  
  type Mutation {
    createTask(input: TaskInput!) : CreateTaskResult
  }

  type Task { id: ID, name: String, isComplete: Boolean, completionDate: String }

  type CreateTaskResult { task: Task }

  input TaskInput { name: String }
`;

// The resolvers
const resolvers = {
  Query: { 
    tasks: () => axios.create({httpsAgent})
      .get('https://localhost:5001/api/tasks/')
      .then(r => r.data)
  },
  Mutation: {
    createTask: (obj, input) =>
      axios.create({httpsAgent})
        .post('https://localhost:5001/api/tasks', input)
        .then(r => axios.create({httpsAgent}).get(r.headers.location))
        .then(r => r.data)
        .then(task => {task})
  }
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