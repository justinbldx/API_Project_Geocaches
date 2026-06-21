import mariadb from 'mariadb';

/**
 * Pool de connexions partagé par toute l'application.
 * Les repositories importent `pool` directement pour exécuter leurs requêtes.
 */
export const pool = mariadb.createPool({
    host: process.env.MARIADB_HOST,
    port: Number(process.env.MARIADB_PORT),
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE,
    connectionLimit: 10,
    bigIntAsNumber: true,
});

export async function connectDatabase(): Promise<void> {
    let connection;

    try {
        connection = await pool.getConnection();
        await connection.query('SELECT 1');
        console.log('✅ Connexion à la base de données établie');
    } finally {
        connection?.release();
    }
}

export async function closeDatabase(): Promise<void> {
    await pool.end();
}