import { getAllCampusService, getCategoriesService, sendContactEmailService, getVerifiedUsersService } from "../service/utitilityService.js";

export const getCategories = async (req, res) => {
  try {
    const catagories = await getCategoriesService();
    if (catagories) {
      return res.status(200).json(catagories)
    }
    else {
      return res.status(400).json({ message: "Error fetching categories" })
    }
  }
  catch (error) {
    return res.status(500).json({ message: "Error in getting categories" })
  }
};

export const sendContactEmail = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await sendContactEmailService(name, email, message);
    return res.status(200).json({message: "Email has been sent successfully"});
  } catch (error) {
    return res.status(500).json({ message: "Error in sending email" });
  }
};

export const getAllCampus = async (req, res) => {
  try {
    const result = await getAllCampusService()
    return res.status(200).json(result)
  }
  catch (error) {
    return res.status(500).json({ message: "Error in getting campus" });

  }
}

export const getVerifiedUsers = async (req, res) => {
  try {
    const verifiedRolls = await getVerifiedUsersService();
    return res.status(200).json(verifiedRolls);
  } catch (error) {
    return res.status(500).json({ message: "Error in getting users" });
  }
}
