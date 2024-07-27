import initMongodbConnection from './db/initMongodbConnection.js';
import startServer from './server.js';

const bootstrap = async () => {
  await initMongodbConnection();
  startServer();
};

bootstrap();
