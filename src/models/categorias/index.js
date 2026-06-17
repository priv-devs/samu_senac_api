const pool = require('../../database');

module.exports = class Categoria{

    async findAll(){
        const { rows } = await pool.query(
            'SELECT * FROM categorias'
        );

        return rows;
    }

    
    async create(nome){
        const { rows } = await pool.query(
            `
            INSERT INTO categorias(nome)
            VALUES($1)
            RETURNING *
            `,
            [nome]
        );

        return rows;
    }

}
