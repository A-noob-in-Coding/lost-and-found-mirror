import db from '../config/db.js';

class OtpModel {
    static async create(email, otp) {
        const query = `
      INSERT INTO otp (email, otp)
      VALUES ($1, $2)
      RETURNING *
    `;
        const { rows } = await db.query(query, [email, otp]);
        return rows[0];
    }

    static async getRecentByEmail(email) {
        const query = `
      SELECT * FROM otp
      WHERE email = $1
      ORDER BY created_at DESC
      LIMIT 1
    `;
        const { rows } = await db.query(query, [email]);
        return rows[0];
    }

    static async markVerified(otp_id) {
        const query = `
      UPDATE otp
      SET is_verified = true
      WHERE otp_id = $1
    `;
        await db.query(query, [otp_id]);
    }

    static async deleteById(otp_id) {
        const query = `DELETE FROM otp WHERE otp_id = $1`;
        await db.query(query, [otp_id]);
    }

    static async upsert(email, otp) {
        const query = `
      INSERT INTO otp (email, otp, is_verified, created_at, expires_at)
       VALUES ($1, $2, false, NOW(), NOW() + INTERVAL '5 minutes')
       ON CONFLICT (email)
       DO UPDATE SET
         otp = $2,
         is_verified = false,
         created_at = NOW(),
         expires_at = NOW() + INTERVAL '5 minutes'
    `;
        await db.query(query, [email, otp]);
    }

    static async verify(email, otp) {
        const query = `SELECT * FROM otp WHERE email = $1 AND otp = $2 AND expires_at > NOW()`;
        const { rows } = await db.query(query, [email, otp]);
        return rows[0];
    }

    static async cleanupExpired() {
        const query = `DELETE FROM otp WHERE expires_at < NOW()`;
        const { rowCount } = await db.query(query);
        return rowCount;
    }
}

export default OtpModel;
