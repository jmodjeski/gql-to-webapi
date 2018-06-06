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
    completeTask(input: CompleteTaskInput!) : CompleteTaskResult
    createTask(input: CreateTaskInput!) : CreateTaskResult
    deleteTaskById(input: ID!) : DeleteTaskResult
    updateTaskName(input: UpdateTaskNameInput!) : UpdateTaskNameResult
  }

  type Task { id: ID, name: String, isComplete: Boolean, completionDate: String }

  type CompleteTaskResult { task: Task }
  type CreateTaskResult { task: Task }
  type DeleteTaskResult { task: Task }
  type UpdateTaskNameResult { task: Task }

  input CompleteTaskInput { id: ID! }
  input CreateTaskInput { name: String }
  input DeleteTaskByIdInput { id: ID! }
  input UpdateTaskNameInput { id: ID!, name: String }
`;

// The resolvers
const resolvers = {
  Query: { 
    tasks: () => axios.create({httpsAgent})
      .get('https://localhost:5001/api/tasks/')
      .then(r => r.data)
  },
  Mutation: {
    createTask: (obj, args) =>
      axios.create({httpsAgent})
        .post('https://localhost:5001/api/tasks', args.input)
        .then(r => axios.create({httpsAgent}).get(r.headers.location))
        .then(r => r.data)
        .then(task => ({task})),

    completeTask: (obj, args) => 
      axios.create({httpsAgent})
        .get(`https://localhost:5001/api/tasks/${args.input.id}`)
        .then(r => Object.assign({}, r.data, {isComplete: true}))
        .then(task => axios.create({httpsAgent})
          .put(`https://localhost:5001/api/tasks/${args.input.id}`, task))
        .then(() => axios.create({httpsAgent})
          .get(`https://localhost:5001/api/tasks/${args.input.id}`))
        .then(r => r.data)
        .then(task => ({task})),

    deleteTaskById: (obj, args) =>
      axios.create({httpsAgent})
        .delete(`https://localhost:5001/api/tasks/${args.input}`)
        .then(() => ({})),

    updateTaskName: (obj, args) => 
      axios.create({httpsAgent})
        .get(`https://localhost:5001/api/tasks/${args.input.id}`)
        .then(r => Object.assign({}, r.data, args.input))
        .then(task => axios.create({httpsAgent})
          .put(`https://localhost:5001/api/tasks/${args.input.id}`, task))
        .then(() => axios.create({httpsAgent})
          .get(`https://localhost:5001/api/tasks/${args.input.id}`))
        .then(r => r.data)
        .then(task => ({task}))
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