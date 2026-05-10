import PostModel from '../model/PostModel.js';
import UserModel from '../model/UserModel.js';
import db from '../config/db.js';
import { getSupabaseClient, supabaseAdmin } from '../config/supabase.js';

export const getLostPostService = async (flag) => {
  return await PostModel.getLostPosts(!!flag);
};

export const getAdminPostsService = async () => {
  return await PostModel.getAdminPosts();
}

export const getAllPostsForAdminService = async () => {
  return await PostModel.getAllPostsForAdmin();
}

export const getFoundPostService = async (flag) => {
  return await PostModel.getFoundPosts(!!flag);
};

export const getImageUrlLostPost = async (postId) => {
  return await PostModel.getImageUrlFromLostPost(postId);
};

const deleteImageFromSupabase = async (url, authToken) => {
  if (!url || url.trim() === '') {
    return;
  }
  try {
    // Use admin client for reliable deletion
    const supabase = supabaseAdmin || getSupabaseClient(authToken);
    if (!supabase) {
      return;
    }
    
    const parts = url.split('/image-bucket/');
    if (parts.length > 1) {
      const path = parts[1];
      const { data, error } = await supabase.storage.from('image-bucket').remove([path]);
      if (error) {
      }
    }
  } catch (e) {
  }
}

export const createLostPostService = async (rollno, title, location, description, image_url, category_id, campusID) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    // Check if user is verified - auto-approve their posts
    const isVerified = await UserModel.isUserVerified(rollno);

    const itemId = await PostModel.createItem(client, { category_id, image_url: image_url || "", description, title, location });
    const post = await PostModel.createLostPost(client, { rollno, item_id: itemId, campusID, is_verified: isVerified });

    await client.query("COMMIT");
    return { post, autoApproved: isVerified };
  } catch (error) {
    await client.query("ROLLBACK");
    throw new Error("Failed to create lost post");
  } finally {
    client.release();
  }
};


export const updateLostPostService = async (post_id) => {
  await PostModel.verifyLostPost(post_id);
  return { message: "Lost post updated successfully" };
};

export const deleteLostPostService = async (postId, authToken) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const img_url = await PostModel.getImageUrlFromLostPost(postId);
    await deleteImageFromSupabase(img_url, authToken);

    await PostModel.deleteLostPost(client, postId);

    await client.query("COMMIT");
    return { message: "Lost post deleted successfully" };
  } catch (error) {
    await client.query("ROLLBACK");
    throw new Error("Failed to delete lost post");
  } finally {
    client.release();
  }
};

export const createFoundPostService = async (rollno, title, location, description, image_url, category_id, campusID) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    // Check if user is verified - auto-approve their posts
    const isVerified = await UserModel.isUserVerified(rollno);

    const itemId = await PostModel.createItem(client, { category_id, image_url: image_url || "", description, title, location });
    const post = await PostModel.createFoundPost(client, { rollno, item_id: itemId, campusID, is_verified: isVerified });

    await client.query("COMMIT");
    return { post, autoApproved: isVerified };
  } catch (error) {
    await client.query("ROLLBACK");
    throw new Error("Failed to create found post");
  } finally {
    client.release();
  }
};


export const updateFoundPostService = async (post_id) => {
  await PostModel.verifyFoundPost(post_id);
  return { message: "Found post updated successfully" };
};

export const approveAllPostsService = async () => {
  const res = await PostModel.verifyAllPosts();
  return {
    lostUpdated: res.lost,
    foundUpdated: res.found,
  };
};

export const deleteFoundPostService = async (postId, authToken) => {
  try {
    const img_url = await PostModel.getImageUrlFromFoundPost(postId);
    await deleteImageFromSupabase(img_url, authToken);

    const client = await db.connect();
    try {
      await client.query('BEGIN');
      await PostModel.deleteFoundPost(client, postId);
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    return { message: "found post deleted successfully" };
  } catch (error) {
    throw new Error("Failed to delete found post");
  }
};

export const getPostDataService = async () => {
  return await PostModel.getVerifiedFeed();
}

export const getPostsByRollNoService = async (rollno) => {
  return await PostModel.getPostsByRollNo(rollno);
};

export const getUnverifiedPostsByRollNoService = async (rollno) => {
  return await PostModel.getUnverifiedPostsByRollNo(rollno);
};

export const getRecent6PostsService = async () => {
  return await PostModel.getRecent6Posts();
};

export const getStatisticsService = async () => {
  return await PostModel.getStatistics();
};
