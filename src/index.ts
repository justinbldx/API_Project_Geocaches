import { createApp } from './app';
import { connectDatabase } from './config/database';

async function bootstrap(): Promise<void> {
    try {
        await connectDatabase();

        const app = createApp();
        app.listen(process.env.PORT, () => {
            console.log(`🚀 Serveur démarré sur http://localhost:${process.env.PORT}`);
            console.log(`📄 Documentation Swagger disponible sur http://localhost:${process.env.PORT}/api-docs`);
        });
    } catch (error) {
        console.error('❌ Échec du démarrage du serveur :', error);
        process.exit(1);
    }
}

bootstrap();