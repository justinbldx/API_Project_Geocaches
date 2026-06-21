import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFound';
import swaggerUi from 'swagger-ui-express';

const swaggerPath = require('path').join(__dirname, '../openapi.yaml');
const swaggerRaw = require('fs').readFileSync(swaggerPath, 'utf8');
const swaggerDocument = require('js-yaml').load(swaggerRaw);

export function createApp(): Application {
    const app = express();

    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(morgan('dev'));

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use('/api', routes);

    // Toujours en dernier : 404 puis gestionnaire d'erreurs centralisé
    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}