import Sequelize from 'sequelize';

const sequelize = new Sequelize(
  'todo_graphql',
  'rashmiranganathan',
  '',
  {
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: false
  },
);

const db = {
  Task: sequelize.import('./task')
};

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
// db.Sequelize = Sequelize;

export default db;
