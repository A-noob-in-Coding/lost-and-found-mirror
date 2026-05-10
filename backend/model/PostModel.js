import db from '../config/db.js';

class PostModel {
  static async getLostPosts(isVerified = false) {
    const query = `
      SELECT lp.lpost_id, lp.rollno, lp.created_at, i.item_id, i.title, i.description, i.image_url, i.location, c.category
      FROM lostpost lp
      JOIN item i ON lp.item_id = i.item_id
      JOIN category c ON i.category_id = c.category_id
      WHERE is_verified = $1
      ORDER BY lp.created_at DESC
    `;
    const { rows } = await db.query(query, [isVerified]);
    return rows;
  }

  static async getFoundPosts(isVerified = false) {
    const query = `
      SELECT fp.f_post_id, fp.rollno, fp.created_at, i.item_id, i.title, i.description, i.image_url, i.location, c.category
      FROM foundpost fp
      JOIN item i ON fp.item_id = i.item_id
      JOIN category c ON i.category_id = c.category_id
      WHERE is_verified = $1
      ORDER BY fp.created_at DESC
    `;
    const { rows } = await db.query(query, [isVerified]);
    return rows;
  }

  static async getAdminPosts() {
    const query = `
      SELECT 
          'l' AS post_type,
          lp.lpost_id AS post_id,
          i.image_url,
          i.title,
          i.description,
          i.location
      FROM lostpost lp
      JOIN item i ON lp.item_id = i.item_id
      WHERE lp.is_verified = false

      UNION ALL

      SELECT 
          'f' AS post_type,
          fp.f_post_id AS post_id,
          i.image_url,
          i.title,
          i.description,
          i.location
      FROM foundpost fp
      JOIN item i ON fp.item_id = i.item_id
      WHERE fp.is_verified = false
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  static async createItem(client, { category_id, image_url, description, title, location }) {
    const query = `
      INSERT INTO item (category_id, image_url, description, title, location)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING item_id
    `;
    const { rows } = await client.query(query, [category_id, image_url, description, title, location]);
    return rows[0].item_id;
  }

  static async createLostPost(client, { rollno, item_id, campusID, is_verified = false }) {
    const query = `
      INSERT INTO lostpost (rollno, created_at, item_id, "campusID", is_verified)
      VALUES ($1, NOW(), $2, $3, $4)
      RETURNING *
    `;
    const { rows } = await client.query(query, [rollno, item_id, campusID, is_verified]);
    return rows[0];
  }

  static async createFoundPost(client, { rollno, item_id, campusID, is_verified = false }) {
    const query = `
      INSERT INTO foundpost (rollno, created_at, item_id, "campusID", is_verified)
      VALUES ($1, NOW(), $2, $3, $4)
      RETURNING *
    `;
    const { rows } = await client.query(query, [rollno, item_id, campusID, is_verified]);
    return rows[0];
  }

  static async getImageUrlFromLostPost(postId) {
    const query = `
      SELECT i.image_url
      FROM item i
      JOIN lostpost lp ON i.item_id = lp.item_id
      WHERE lp.lpost_id = $1
    `;
    const { rows } = await db.query(query, [postId]);
    return rows[0]?.image_url;
  }

  static async getImageUrlFromFoundPost(postId) {
    const query = `
      SELECT i.image_url
      FROM item i
      JOIN foundpost fp ON i.item_id = fp.item_id
      WHERE fp.f_post_id = $1
    `;
    const { rows } = await db.query(query, [postId]);
    return rows[0]?.image_url;
  }

  static async deleteLostPost(client, postId) {
    const query = `
      DELETE FROM item WHERE item_id = (SELECT item_id FROM lostpost WHERE lpost_id = $1)
    `;
    await client.query(query, [postId]);
  }

  static async deleteFoundPost(client, postId) {
    const query = `
      DELETE FROM item WHERE item_id = (SELECT item_id FROM foundpost WHERE f_post_id = $1)
    `;
    await client.query(query, [postId]);
  }

  static async verifyLostPost(postId) {
    const query = "UPDATE lostpost SET is_verified = true WHERE lpost_id = $1";
    await db.query(query, [postId]);
  }

  static async verifyFoundPost(postId) {
    const query = "UPDATE foundpost SET is_verified = true WHERE f_post_id = $1";
    await db.query(query, [postId]);
  }

  static async verifyAllPosts() {
    const updateLost = `UPDATE lostpost SET is_verified = true WHERE is_verified = false`;
    const updateFound = `UPDATE foundpost SET is_verified = true WHERE is_verified = false`;

    const lostRes = await db.query(updateLost);
    const foundRes = await db.query(updateFound);

    return { lost: lostRes.rowCount, found: foundRes.rowCount };
  }

  // Get ALL posts for admin (both verified and unverified)
  static async getAllPostsForAdmin() {
    const query = `
  SELECT
    lp.lpost_id AS id,
    lp."campusID",
    'lost' AS type,
    i.title AS item_name,
    cat.category AS category,
    camp."campusName" AS campus,
    i.description,
    i.location,
    lp.is_verified,
    lp.created_at,
    i.image_url,
    u.name AS username,
    u.rollno,
    u.image_url AS user_avatar
  FROM lostpost lp
  JOIN "User" u ON lp.rollno = u.rollno
  JOIN item i ON lp.item_id = i.item_id
  LEFT JOIN category cat ON i.category_id = cat.category_id
  LEFT JOIN campus camp ON lp."campusID" = camp."campusID"

  UNION ALL

  SELECT
    fp.f_post_id AS id,
    fp."campusID",
    'found' AS type,
    i.title AS item_name,
    cat.category AS category,
    camp."campusName" AS campus,
    i.description,
    i.location,
    fp.is_verified,
    fp.created_at,
    i.image_url,
    u.name AS username,
    u.rollno,
    u.image_url AS user_avatar
  FROM foundpost fp
  JOIN "User" u ON fp.rollno = u.rollno
  JOIN item i ON fp.item_id = i.item_id
  LEFT JOIN category cat ON i.category_id = cat.category_id
  LEFT JOIN campus camp ON fp."campusID" = camp."campusID"

  ORDER BY created_at DESC;
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  // queries for Feed
  static async getVerifiedFeed() {
    const query = `
  SELECT
    lp.lpost_id AS id,
    lp."campusID",
    'Lost' AS type,
    i.title,
    i.category_id,
    i.description,
    i.location,
    to_char(lp.created_at, 'YYYY-MM-DD HH24:MI:SS') AS date,
    i.image_url AS image,
    json_build_object(
      'name', u.name,
      'rollNumber', u.rollno,
      'avatar', u.image_url
    ) AS user,
    COALESCE(json_agg(
      json_build_object(
        'id', lc.l_comment_id,
        'text', lc.comment,
        'date', to_char(lc.created_at, 'YYYY-MM-DD HH24:MI:SS'),
        'user', json_build_object(
          'name', cu.name,
          'rollNumber', cu.rollno,
          'avatar', cu.image_url
        )
      )
    ) FILTER (WHERE lc.l_comment_id IS NOT NULL), '[]') AS comments
  FROM lostpost lp
  JOIN "User" u ON lp.rollno = u.rollno
  JOIN item i ON lp.item_id = i.item_id
  LEFT JOIN lostpostcomment lc ON lc.l_post_id = lp.lpost_id AND lc.is_verified = true
  LEFT JOIN "User" cu ON lc.rollno = cu.rollno
  WHERE lp.is_verified = true
  GROUP BY lp.lpost_id, lp."campusID", i.title, i.description, i.location, i.image_url,i.category_id, lp.created_at, u.name, u.rollno, u.image_url

  UNION ALL

  SELECT
    fp.f_post_id AS id,
    fp."campusID",
    'Found' AS type,
    i.title,
    i.category_id,
    i.description,
    i.location,
    to_char(fp.created_at, 'YYYY-MM-DD HH24:MI:SS') AS date,
    i.image_url AS image,
    json_build_object(
      'name', u.name,
      'rollNumber', u.rollno,
      'avatar', u.image_url
    ) AS user,
    COALESCE(json_agg(
      json_build_object(
        'id', fc.f_comment_id,
        'text', fc.comment,
        'date', to_char(fc.created_at, 'YYYY-MM-DD HH24:MI:SS'),
        'user', json_build_object(
          'name', cu.name,
          'rollNumber', cu.rollno,
          'avatar', cu.image_url
        )
      )
    ) FILTER (WHERE fc.f_comment_id IS NOT NULL), '[]') AS comments
  FROM foundpost fp
  JOIN "User" u ON fp.rollno = u.rollno
  JOIN item i ON fp.item_id = i.item_id
  LEFT JOIN foundpostcomment fc ON fc.f_post_id = fp.f_post_id AND fc.is_verified = true
  LEFT JOIN "User" cu ON fc.rollno = cu.rollno
  WHERE fp.is_verified = true
  GROUP BY fp.f_post_id, fp."campusID", i.title, i.description, i.location, i.image_url, i.category_id, fp.created_at, u.name, u.rollno, u.image_url

  ORDER BY date DESC;
      `;
    const { rows } = await db.query(query);
    return rows;
  }

  static async getPostsByRollNo(rollno) {
    const query = `
      SELECT
        lp.lpost_id AS id,
        lp."campusID",
        'Lost' AS type,
        i.title,
        i.category_id,
        i.description,
        i.location,
        to_char(lp.created_at, 'YYYY-MM-DD HH24:MI:SS') AS date,
        i.image_url AS image,
        lp.is_verified AS isVerified
      FROM lostpost lp
      JOIN item i ON lp.item_id = i.item_id
      WHERE lp.rollno = $1
      
      UNION ALL
      
      SELECT
        fp.f_post_id AS id,
        fp."campusID",
        'Found' AS type,
        i.title,
        i.category_id,
        i.description,
        i.location,
        to_char(fp.created_at, 'YYYY-MM-DD HH24:MI:SS') AS date,
        i.image_url AS image,
        fp.is_verified AS isVerified
      FROM foundpost fp
      JOIN item i ON fp.item_id = i.item_id
      WHERE fp.rollno = $1
      
      ORDER BY date DESC
    `;
    const { rows } = await db.query(query, [rollno]);
    return rows;
  }

  static async getUnverifiedPostsByRollNo(rollno) {
    const query = `
      SELECT 
        'Lost' AS post_type,
        lp.lpost_id AS post_id,
        i.image_url,
        i.title,
        i.description,
        i.location,
        to_char(lp.created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at,
        c.category
      FROM 
        lostpost lp
      JOIN 
        item i ON lp.item_id = i.item_id
      JOIN 
        category c ON i.category_id = c.category_id
      WHERE 
        lp.rollno = $1 AND lp.is_verified = false
        
      UNION ALL
      
      SELECT 
        'Found' AS post_type,
        fp.f_post_id AS post_id,
        i.image_url,
        i.title,
        i.description,
        i.location,
        to_char(fp.created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at,
        c.category
      FROM 
        foundpost fp
      JOIN 
        item i ON fp.item_id = i.item_id
      JOIN 
        category c ON i.category_id = c.category_id
      WHERE 
        fp.rollno = $1 AND fp.is_verified = false
      
      ORDER BY created_at DESC
    `;
    const { rows } = await db.query(query, [rollno]);
    return rows;
  }

  static async getRecent6Posts() {
    const query = `
      SELECT
        lp.lpost_id AS id,
        lp."campusID",
        'Lost' AS type,
        i.title,
        i.description,
        i.location,
        to_char(lp.created_at, 'YYYY-MM-DD HH24:MI:SS') AS date,
        i.image_url AS image,
        c."campusName" AS campus,
        u.name AS userName
      FROM lostpost lp
      JOIN "User" u ON lp.rollno = u.rollno
      JOIN item i ON lp.item_id = i.item_id
      JOIN campus c ON lp."campusID" = c."campusID"
      WHERE lp.is_verified = true

      UNION ALL

      SELECT
        fp.f_post_id AS id,
        fp."campusID",
        'Found' AS type,
        i.title,
        i.description,
        i.location,
        to_char(fp.created_at, 'YYYY-MM-DD HH24:MI:SS') AS date,
        i.image_url AS image,
        c."campusName" AS campus,
        u.name AS userName
      FROM foundpost fp
      JOIN "User" u ON fp.rollno = u.rollno
      JOIN item i ON fp.item_id = i.item_id
      JOIN campus c ON fp."campusID" = c."campusID"
      WHERE fp.is_verified = true

      ORDER BY date DESC
      LIMIT 6
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  static async getStatistics() {
    const totalPostsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM lostpost WHERE is_verified = true) +
        (SELECT COUNT(*) FROM foundpost WHERE is_verified = true) AS total_posts
    `;
    const totalUsersQuery = `SELECT COUNT(*) AS total_users FROM "User"`;
    const totalCommentsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM lostpostcomment WHERE is_verified = true) +
        (SELECT COUNT(*) FROM foundpostcomment WHERE is_verified = true) AS total_comments
    `;

    const [postsRes, usersRes, commentsRes] = await Promise.all([
      db.query(totalPostsQuery),
      db.query(totalUsersQuery),
      db.query(totalCommentsQuery)
    ]);

    return {
      totalPosts: parseInt(postsRes.rows[0].total_posts),
      totalUsers: parseInt(usersRes.rows[0].total_users),
      totalComments: parseInt(commentsRes.rows[0].total_comments)
    };
  }
}

export default PostModel;
