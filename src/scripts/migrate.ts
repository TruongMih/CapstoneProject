import path from "node:path"
import { pool } from "../lib/db.js";
import fs from "node:fs"
import { logger } from "../lib/logger.js";
const MIGRATION_DIR = path.join(process.cwd(), "migrations");

const CREATE_MIGRATION_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS migration(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    execute_at TIMESTAMP NOT NULL DEFAULT NOW()
)
`;

type MigrationRows = {
    name: string
}

async function getExcutedMigration(): Promise<string[]>{
    const result = await pool.query<MigrationRows>(
        "SELECT name FROM migration ORDER BY name"
    )
    return result.rows.map((row: MigrationRows)=>row.name)
}

function getMigrationFiles(): string[]{
    return fs.readdirSync(MIGRATION_DIR).filter((file)=>file.endsWith(".sql")).sort();
}

async function runMigration(fileName: string): Promise<void>{
    const sql = fs.readFileSync(path.join(MIGRATION_DIR, fileName), 'utf-8');
    const client = await pool.connect();

    try {
        
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('INSERT INTO migration (name) VALUES ($1)', [fileName]);
        await client.query("COMMIT");

        logger.info(`Migration completed: ${fileName}`);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    }finally{
        await client.release();
    }
}

async function migrate(): Promise<void>{
    await pool.query(CREATE_MIGRATION_TABLE_SQL);

    const executed = new Set(await getExcutedMigration());
    const pending = getMigrationFiles().filter((file)=>!executed.has(file));

    if(pending.length === 0){
        logger.info('No pending migration');
        return
    }
    for( const fileName of pending){
        await runMigration(fileName);
    }

    logger.info('All migration completed');
}

migrate().catch((error)=>{
    console.error({error: error}, 'Migration failed'),
    process.exit(1);
}).finally(()=>pool.end());

