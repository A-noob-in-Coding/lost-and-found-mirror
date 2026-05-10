import db from '../config/db.js';

class NotificationModel {
    static async create(senderEmail, receiverEmail) {
        const query = 'INSERT INTO notification (sender, receiver) VALUES ($1, $2) RETURNING *';
        const { rows } = await db.query(query, [senderEmail, receiverEmail]);
        return rows[0];
    }

    static async getByReceiver(receiverEmail) {
        const query = 'SELECT * FROM notification WHERE receiver = $1 ORDER BY id DESC';
        const { rows } = await db.query(query, [receiverEmail]);
        return rows;
    }

    static async getCount(receiverEmail) {
        const query = 'SELECT COUNT(*) FROM notification WHERE receiver = $1';
        const { rows } = await db.query(query, [receiverEmail]);
        return parseInt(rows[0].count);
    }

    static async delete(notificationId) {
        const query = 'DELETE FROM notification WHERE id = $1 RETURNING *';
        const { rows } = await db.query(query, [notificationId]);
        return rows[0];
    }
}

export default NotificationModel;
