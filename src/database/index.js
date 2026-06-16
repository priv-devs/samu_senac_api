require('dotenv').config();

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = process.env.SQLITE_FILE
    ? path.resolve(process.env.SQLITE_FILE)
    : path.resolve(__dirname, '../../database.sqlite');

const db = new sqlite3.Database(dbPath);

function normalizarSql(sql) {
    return sql.replace(/\$(\d+)/g, '?');
}

function normalizarParametros(params = []) {
    return params.map((param) => {
        if (param && typeof param === 'object' && !Buffer.isBuffer(param) && !(param instanceof Date)) {
            return JSON.stringify(param);
        }

        return param;
    });
}

function normalizarLinha(row) {
    if (!row) {
        return row;
    }

    if (typeof row.payload === 'string') {
        try {
            row.payload = JSON.parse(row.payload);
        } catch (err) {
            // Mantem o valor original se ele nao for JSON valido.
        }
    }

    return row;
}

let initPromise;

async function executar(sql, params = [], skipReady = false) {
    if (!skipReady && initPromise) {
        await initPromise;
    }

    const query = normalizarSql(sql);
    const values = normalizarParametros(params);
    const isSelect = /^\s*SELECT\b/i.test(query);
    const hasReturning = /\bRETURNING\b/i.test(query);

    return new Promise((resolve, reject) => {
        if (isSelect || hasReturning) {
            db.all(query, values, (err, rows = []) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve({
                    rows: rows.map(normalizarLinha),
                    rowCount: rows.length
                });
            });
            return;
        }

        db.run(query, values, function callback(err) {
            if (err) {
                reject(err);
                return;
            }

            resolve({
                rows: [],
                rowCount: this.changes || 0
            });
        });
    });
}

async function initDB() {
    const schemaPath = path.resolve(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await executar('PRAGMA foreign_keys = ON', [], true);

    await new Promise((resolve, reject) => {
        db.exec(schema, (err) => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });

    await executar(`
        INSERT OR IGNORE INTO tipo_usuario (tipo)
        VALUES ('cliente'), ('admin')
    `, [], true);

    console.log(`Banco SQLite inicializado em ${dbPath}.`);
}

initPromise = initDB().catch((err) => {
    console.error('Erro ao inicializar banco:', err);
    throw err;
});

module.exports = {
    query: executar,
    close() {
        return new Promise((resolve, reject) => {
            db.close((err) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }
};
