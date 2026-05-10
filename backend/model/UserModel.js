import db from '../config/db.js';

class UserModel {
    static async findByRollNo(rollno) {
        const query = 'SELECT * FROM "User" WHERE rollno = $1';
        const { rows } = await db.query(query, [rollno]);
        return rows[0];
    }

    static async findByRollNoWithCampus(rollno) {
        const query = `
      SELECT u.rollno, u.email, u.name, u.image_url, u."campusID", u.account_type, u.profile_changes_count, u.profile_changes_reset_date, c."campusName"
      FROM "User" u
      JOIN campus c ON u."campusID" = c."campusID"
      WHERE u.rollno = $1
    `;
        const { rows } = await db.query(query, [rollno]);
        return rows[0];
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM "User" WHERE email = $1';
        const { rows } = await db.query(query, [email]);
        return rows[0];
    }

    static async create({ rollno, email, name, password, campusID, account_type = 'public', image_url }) {
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = now.getUTCMonth();
        const nextReset = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0, 0));

        const query = `
      INSERT INTO "User" (rollno, email, name, password, "campusID", account_type, image_url, profile_changes_reset_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
        try {
            const { rows } = await db.query(query, [rollno, email, name, password, campusID, account_type, image_url, nextReset.toISOString()]);
            return rows[0];
        } catch (err) {
            throw err;
        }
    }

    static async updateProfile(rollno, { name, account_type, image_url }) {
        let query = 'UPDATE "User" SET ';
        const params = [];
        let idx = 1;
        const updates = [];

        if (name) {
            updates.push(`name = $${idx++}`);
            params.push(name);
        }
        if (account_type) {
            updates.push(`account_type = $${idx++}`);
            params.push(account_type);
        }
        if (image_url) {
            updates.push(`image_url = $${idx++}`);
            params.push(image_url);
        }

        if (updates.length === 0) return null;

        query += updates.join(', ') + ` WHERE rollno = $${idx} RETURNING *`;
        params.push(rollno);

        const { rows } = await db.query(query, params);
        return rows[0];
    }

    static async updateProfileChangeCount(rollno, { count, reset_date }) {
        let query = 'UPDATE "User" SET ';
        const params = [];
        let idx = 1;
        const updates = [];

        if (count !== undefined) {
            updates.push(`profile_changes_count = $${idx++}`);
            params.push(count);
        }
        if (reset_date) {
            updates.push(`profile_changes_reset_date = $${idx++}`);
            params.push(reset_date);
        }

        if (updates.length === 0) return null;

        query += updates.join(', ') + ` WHERE rollno = $${idx}`;
        params.push(rollno);

        await db.query(query, params);
    }

    static async updateCampus(rollno, campusID) {
        const query = 'UPDATE "User" SET "campusID" = $1 WHERE rollno = $2';
        await db.query(query, [campusID, rollno]);
    }

    static async updatePassword(rollno, hashedPassword) {
        const query = 'UPDATE "User" SET password = $1 WHERE rollno = $2';
        await db.query(query, [hashedPassword, rollno]);
    }

    static async isUserVerified(rollno) {
        const query = 'SELECT rollno FROM verified_users WHERE rollno = $1';
        const { rows } = await db.query(query, [rollno]);
        return rows.length > 0;
    }

    static async getAllUsers() {
        const query = 'SELECT rollno, email, name, image_url, "campusID", account_type FROM "User"';
        const { rows } = await db.query(query);
        return rows;
    }
}

export default UserModel;
