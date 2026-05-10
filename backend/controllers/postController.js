import {
  createLostPostService,
  createFoundPostService,
  getLostPostService,
  deleteLostPostService,
  getFoundPostService,
  updateFoundPostService,
  deleteFoundPostService,
  getAdminPostsService,
  getAllPostsForAdminService,
  updateLostPostService,
  getPostDataService,
  getPostsByRollNoService,
  getUnverifiedPostsByRollNoService,
  getRecent6PostsService,
  getStatisticsService,
  approveAllPostsService
} from "../service/postService.js";
import { getSupabaseClient } from '../config/supabase.js';
import { getUserByEmailService } from '../service/userService.js';
const validateRequired = (fields) => {
  for (const key in fields) {
    if (!fields[key]) return false;
  }
  return true;
};

export const userCreateLostPost = async (req, res) => {
  try {
    const supabase = getSupabaseClient(req.authToken);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || !user.email) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const dbUser = await getUserByEmailService(user.email);
    const rollno = dbUser.rollno;

    let image_url = req.body.image_url; 
    if (req.file) {
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${rollno}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('image-bucket')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('image-bucket')
        .getPublicUrl(filePath);

      image_url = publicUrl;
    }

    const { title, location, description, category_id, campusID } = req.body;

    if (!rollno || !title || !location || !description || !category_id || !campusID) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await createLostPostService(rollno, title, location, description, image_url, category_id, campusID);

    return res.status(201).json({ message: "Lost post created successfully", autoApproved: result.autoApproved });
  } catch (error) {
    console.error("Create Lost Post Error:", error);
    return res.status(500).json({ message: "Error in creating post" });
  }
};

export const userDeleteLostPost = async (req, res) => {
  const { postId } = req.params;

  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const dbUser = await getUserByEmailService(req.user.email);
    const userRollNo = dbUser.rollno;

    const posts = await getPostsByRollNoService(userRollNo);
    const unverifiedPosts = await getUnverifiedPostsByRollNoService(userRollNo);

    const isOwner = [...posts, ...unverifiedPosts].some(p => p.type === 'Lost' && String(p.id) === String(postId));

    if (!isOwner) {
      return res.status(403).json({ message: "Unauthorized to delete this post" });
    }

    await deleteLostPostService(postId, req.authToken);
    return res.status(200).json({ message: "Lost post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error in deleting post" });
  }
};

export const userGetLostPost = async (req, res) => {
  try {
    const lostPost = await getLostPostService(true);
    if (!lostPost) {
      return res.status(404).json({ message: "Lost post not found" });
    }
    return res.status(200).json(lostPost);
  } catch (error) {
    return res.status(500).json({ message: "Error in getting post" });
  }
};

export const userCreateFoundPost = async (req, res) => {
  try {
    const supabase = getSupabaseClient(req.authToken);
    let userEmail = req.user?.email;
    if (!userEmail) {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user || !user.email) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }
      userEmail = user.email;
    }

    const dbUser = await getUserByEmailService(userEmail);
    const rollno = dbUser.rollno;

    // 2. Handle Image Upload
    let image_url = req.body.image_url; // Fallback if no file
    if (req.file) {
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${rollno}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('image-bucket')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('image-bucket')
        .getPublicUrl(filePath);

      image_url = publicUrl;
    }

    // 3. Extract other fields
    const { title, location, description, category_id, campusID } = req.body;

    if (!rollno || !title || !location || !description || !category_id || !campusID) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await createFoundPostService(rollno, title, location, description, image_url, category_id, campusID);

    return res.status(201).json({ message: "Found post created successfully", autoApproved: result.autoApproved });
  } catch (error) {
    return res.status(500).json({ message: "Error in creating post" });
  }
};

export const userDeleteFoundPost = async (req, res) => {
  const { postId } = req.params;

  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const dbUser = await getUserByEmailService(req.user.email);
    const userRollNo = dbUser.rollno;

    const posts = await getPostsByRollNoService(userRollNo);
    const unverifiedPosts = await getUnverifiedPostsByRollNoService(userRollNo);

    const isOwner = [...posts, ...unverifiedPosts].some(p => p.type === 'Found' && String(p.id) === String(postId));

    if (!isOwner) {
      return res.status(403).json({ message: "Unauthorized to delete this post" });
    }

    await deleteFoundPostService(postId, req.authToken);
    return res.status(200).json({ message: "Found post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error in deleting post" });
  }
};

export const userGetFoundPost = async (req, res) => {
  try {
    const foundPost = await getFoundPostService(true);
    if (!foundPost) {
      return res.status(404).json({ message: "Found post not found" });
    }
    return res.status(200).json(foundPost);
  } catch (error) {
    return res.status(500).json({ message: "Error in getting post" });
  }
};


export const getAdminPosts = async (req, res) => {
  try {
    const result = await getAdminPostsService();
    if (!result) {
      return res.status(404).json({ message: "Lost post not found" });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error in getting post" });
  }
};

export const getAllPostsForAdmin = async (req, res) => {
  try {
    const result = await getAllPostsForAdminService();
    if (!result) {
      return res.status(404).json({ message: "Posts not found" });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getAllPostsForAdmin:", error);
    return res.status(500).json({ message: "Error in getting posts", error: error.message });
  }
};


export const adminDeleteLostPost = async (req, res) => {
  const postId = req.query.id;

  try {
    await deleteLostPostService(postId, req.authToken);
    return res.status(200).json({ message: "Lost post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error in deleting post" });
  }
};

export const adminGetFoundPost = async (req, res) => {
  try {
    const foundPost = await getFoundPostService(false);
    if (!foundPost) {
      return res.status(404).json({ message: "Found post not found" });
    }
    return res.status(200).json(foundPost);
  } catch (error) {
    return res.status(500).json({ message: "Error in deleting post" });
  }
};

export const adminUpdateFoundPost = async (req, res) => {
  const post_id = req.query.id;
  if (!post_id) {
    return res.status(400).json({ message: "Must provide post ID" });
  }
  try {
    await updateFoundPostService(post_id);
    return res.status(200).json({ message: "Found post updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error in updating post" });
  }
};

export const adminDeleteFoundPost = async (req, res) => {
  const postId = req.query.id;
  if (!postId) {
    return res.status(400).json({ message: "Must provide post ID" });
  }
  try {
    await deleteFoundPostService(postId, req.authToken);
    return res.status(200).json({ message: "Found post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error in deleting post" });
  }
};

export const adminUpdateLostPost = async (req, res) => {
  const post_id = req.query.id;
  if (!post_id) {
    return res.status(400).json({ message: "Must provide post ID" });
  }
  try {
    await updateLostPostService(post_id);
    return res.status(200).json({ message: "Lost post updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error in upadting post" });
  }
};

export const getPostData = async (req, res) => {
  try {
    const result = await getPostDataService();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error in getting post" });
  }
}

export const getPostsByRollNo = async (req, res) => {
  try {
    const { rollno } = req.params;

    if (!rollno) {
      return res.status(400).json({ message: "Roll number is required" });
    }

    const posts = await getPostsByRollNoService(rollno);
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: "Error in getting post" });
  }
};

export const getUnverifiedPostsByRollNo = async (req, res) => {
  try {
    const { rollno } = req.params;

    if (!rollno) {
      return res.status(400).json({ message: "Roll number is required" });
    }

    if (req.user?.email) {
      const dbUser = await getUserByEmailService(req.user.email);
      if (dbUser.rollno !== rollno) {
        return res.status(403).json({ message: "Unauthorized to view these posts" });
      }
    }

    const posts = await getUnverifiedPostsByRollNoService(rollno);
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: "Error in getting post" });
  }
};

export const getRecent6Posts = async (req, res) => {
  try {
    const posts = await getRecent6PostsService();
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: "Error in getting post" });
  }
};

export const getStatistics = async (req, res) => {
  try {
    const statistics = await getStatisticsService();
    return res.status(200).json(statistics);
  } catch (error) {
    return res.status(500).json({ message: "Error in getting stats" });
  }
};

export const adminApproveAllPosts = async (req, res) => {
  try {
    const result = await approveAllPostsService();
    return res.status(200).json({ message: "All posts approved" });
  } catch (error) {
    return res.status(500).json({ message: "Error in approving post" });
  }
};
