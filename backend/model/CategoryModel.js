import db from '../config/db.js';

class CategoryModel {
    static async getAll() {
        const query = 'SELECT * FROM category ORDER BY category';
        const { rows } = await db.query(query);
        return rows;
    }

    static async getById(id) {
        const query = 'SELECT * FROM category WHERE category_id = $1';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }

    static async create(category) {
        const query = 'INSERT INTO category (category) VALUES ($1) RETURNING *';
        const { rows } = await db.query(query, [category]);
        return rows[0];
    }

    static async update(id, category) {
        const query = 'UPDATE category SET category = $1 WHERE category_id = $2 RETURNING *';
        const { rows } = await db.query(query, [category, id]);
        return rows[0];
    }

    static async delete(id) {
        const client = await db.connect();
        try {
            await client.query(
                'UPDATE public.item SET category_id = 1 WHERE category_id = $1',
                [id]
            );

            const query = 'DELETE FROM public.category WHERE category_id = $1 RETURNING *';
            const { rows } = await client.query(query, [id]);
            return rows[0];
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    }
}

export default CategoryModel;
