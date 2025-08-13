import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import routes from './routes/routes';
// import 'newrelic'

dotenv.config();

// Config
const app = express();

import './database';

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Habilita CORS apenas para o domínio especificado
app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);

app.use(routes);

export default app;
