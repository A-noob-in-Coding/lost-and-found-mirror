import db from '../config/db.js';

class UtilityModel {
    static async getAllCampus() {
        const query = 'SELECT * FROM campus';
        const { rows } = await db.query(query);
        return rows;
    }

    static async getVerifiedUsers() {
        const query = 'SELECT rollno FROM verified_users';
        const { rows } = await db.query(query);
        return rows.map(r => String(r.rollno));
    }
}

export default UtilityModel;
