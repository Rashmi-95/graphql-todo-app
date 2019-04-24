module.exports =  (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    description: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
  });

  return Task;
};
