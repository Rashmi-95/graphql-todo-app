export default `

  type Task {
    id: Int!
    description: String!
    status: Boolean!
  }

  type Query {
    allTask: [Task!]!
  }

  type Mutation {
    createTask(description: String!, status: Boolean!): Task!
    updateTask(id: Int!, description: String, status: Boolean): Int!
    deleteTask(id: Int!): Int!
    deleteAllCompletedTask: Int!
    updateAllTaskStatus(status: Boolean!): Int!
  }
`;
