import { PubSub } from 'graphql-subscriptions';
export const pubsub = new PubSub();

export default {
  Query: {
    allTask: (parent, args, { models }) => models.Task.findAll(),
  },

  Mutation: {
    createTask: (parent, args, { models }) => {
      console.log(args);
      return models.Task.create(args)
    },
    updateTask: (parent, { id, description, status }, { models }) =>
      models.Task.update({ description, status }, { where: { id } }),
    deleteTask: (parent, { id }, { models }) => models.Task.destroy({ where: { id } }),
    updateAllTaskStatus: (parent, { status }, { models }) =>
      models.Task.update({ status }, { where: {} }),
    deleteAllCompletedTask: (parent, args, { models }) => models.Task.destroy({ where: { status: true } }),
  }
};
