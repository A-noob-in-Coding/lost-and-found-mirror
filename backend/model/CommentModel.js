import db from '../config/db.js';

class CommentModel {
    static async addLostComment(rollNo, postId, comment, is_verified = false) {
        const query = 'INSERT INTO lostpostcomment (l_post_id, rollno, "comment", is_verified) VALUES ($1, $2, $3, $4)';
        await db.query(query, [postId, rollNo, comment, is_verified]);
    }

    static async addFoundComment(rollNo, postId, comment, is_verified = false) {
        const query = 'INSERT INTO foundpostcomment (f_post_id, rollno, "comment", is_verified) VALUES ($1, $2, $3, $4)';
        await db.query(query, [postId, rollNo, comment, is_verified]);
    }

    static async deleteLostComment(rollNo, commentId) {
        const query = 'DELETE FROM lostpostcomment WHERE l_comment_id = $1 AND rollno = $2';
        await db.query(query, [commentId, rollNo]);
    }

    static async deleteFoundComment(rollNo, commentId) {
        const query = 'DELETE FROM foundpostcomment WHERE f_comment_id = $1 AND rollno = $2';
        await db.query(query, [commentId, rollNo]);
    }

    static async getAllLostComments(isVerified = false) {
        const query = `
      SELECT lc.l_comment_id, lc.l_post_id, lc.comment, lc.rollno, u.name, u.email, lp.created_at
      FROM lostpostcomment lc
      JOIN "User" u ON lc.rollno = u.rollno
      JOIN lostpost lp ON lc.l_post_id = lp.lpost_id
      WHERE lc.is_verified = $1
      ORDER BY lp.created_at DESC
    `;
        const { rows } = await db.query(query, [isVerified]);
        return rows;
    }

    static async getAllFoundComments(isVerified = false) {
        const query = `
      SELECT fc.f_comment_id, fc.f_post_id, fc.comment, fc.rollno, u.name, u.email, fp.created_at, i.title, i.description, i.location
      FROM foundpostcomment fc
      JOIN "User" u ON fc.rollno = u.rollno
      JOIN foundpost fp ON fc.f_post_id = fp.f_post_id
      JOIN item i ON fp.item_id = i.item_id
      WHERE fc.is_verified = $1
      ORDER BY fp.created_at DESC
    `;
        const { rows } = await db.query(query, [isVerified]);
        return rows;
    }

    static async verifyLostComment(commentId) {
        const query = 'UPDATE lostpostcomment SET is_verified = true WHERE l_comment_id = $1';
        await db.query(query, [commentId]);
    }

    static async verifyFoundComment(commentId) {
        const query = 'UPDATE foundpostcomment SET is_verified = true WHERE f_comment_id = $1';
        await db.query(query, [commentId]);
    }

    static async approveAllComments() {
        const updateLost = `UPDATE lostpostcomment SET is_verified = true WHERE is_verified = false`;
        const updateFound = `UPDATE foundpostcomment SET is_verified = true WHERE is_verified = false`;

        const lostRes = await db.query(updateLost);
        const foundRes = await db.query(updateFound);

        return { lost: lostRes.rowCount || 0, found: foundRes.rowCount || 0 };
    }

    static async getAdminAllComments() {
        const query = "SELECT l_comment_id AS comment_id, comment, 'l' AS comment_type FROM lostpostcomment WHERE is_verified = false UNION ALL SELECT f_comment_id AS comment_id, comment, 'f' AS comment_type FROM foundpostcomment WHERE is_verified = false";
        const { rows } = await db.query(query);
        return rows;
    }

    static async deleteAdminLostComment(commentId) {
        const query = "DELETE FROM lostpostcomment WHERE l_comment_id = $1";
        await db.query(query, [commentId]);
    }

    static async deleteAdminFoundComment(commentId) {
        const query = "DELETE FROM foundpostcomment WHERE f_comment_id = $1";
        await db.query(query, [commentId]);
    }

    static async getUserComments(rollno) {
        const query = `
      SELECT 
        lc.l_comment_id AS id,
        lc.comment,
        lc.is_verified AS isVerified,
        to_char(lc.created_at, 'YYYY-MM-DD HH24:MI:SS') AS date,
        lc.created_at AS rawDate,
        'Lost' AS postType,
        i.title AS postTitle,
        lp.lpost_id AS postId
      FROM lostpostcomment lc
      JOIN lostpost lp ON lc.l_post_id = lp.lpost_id
      JOIN item i ON lp.item_id = i.item_id
      WHERE lc.rollno = $1
      
      UNION ALL
      
      SELECT 
        fc.f_comment_id AS id,
        fc.comment,
        fc.is_verified AS isVerified,
        to_char(fc.created_at, 'YYYY-MM-DD HH24:MI:SS') AS date,
        fc.created_at AS rawDate,
        'Found' AS postType,
        i.title AS postTitle,
        fp.f_post_id AS postId
      FROM foundpostcomment fc
      JOIN foundpost fp ON fc.f_post_id = fp.f_post_id
      JOIN item i ON fp.item_id = i.item_id
      WHERE fc.rollno = $1
      
      ORDER BY rawDate DESC
    `;
        const { rows } = await db.query(query, [rollno]);
        return rows;
    }

    static async deleteUserCommentByText(rollNo, commentText, type) {
        const query = type.toLowerCase() === 'lost'
            ? 'DELETE FROM lostpostcomment WHERE rollno = $1 AND comment = $2 RETURNING l_comment_id'
            : 'DELETE FROM foundpostcomment WHERE rollno = $1 AND comment = $2 RETURNING f_comment_id';

        const { rows } = await db.query(query, [rollNo, commentText]);
        return rows.length > 0;
    }
}

export default CommentModel;
