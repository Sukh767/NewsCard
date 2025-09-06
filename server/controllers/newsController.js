import News from "../models/News.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// ------------------ GET ALL NEWS ------------------
export const getAllNews = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20, sortBy = "createdAt", order = "desc" } = req.query;

    const query = {};
    if (category) query.category = category;
    if (search?.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
        { content: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 🔹 Sorting dynamically
    const sortOrder = order === "asc" ? 1 : -1;
    const sortCriteria = { [sortBy]: sortOrder };

    const news = await News.find(query)
      .sort(sortCriteria)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-__v");

    const total = await News.countDocuments(query);

    res.json({
      news,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error in getAllNews:", error);
    res.status(500).json({ error: "Failed to fetch news articles" });
  }
};

// ------------------ GET FEATURED NEWS ------------------
export const getFeaturedNews = async (req, res) => {
  try {
    // 🔹 Most viewed or most recent
    const news = await News.find()
      .sort({ views: -1, createdAt: -1 })
      .limit(5)
      .select("title description category imageUrl views likes createdAt");
    res.json(news);
  } catch (error) {
    console.error("Error in getFeaturedNews:", error);
    res.status(500).json({ error: "Failed to fetch featured news" });
  }
};

// ------------------ GET CATEGORIES ------------------
export const getCategories = async (req, res) => {
  try {
    const categories = await News.distinct("category");
    res.json(categories);
  } catch (error) {
    console.error("Error in getCategories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// ------------------ GET SINGLE NEWS ------------------
export const getSingleNews = async (req, res) => {
  try {
    // 🔹 Increment views on each fetch
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).select("-__v");

    if (!news) return res.status(404).json({ error: "News not found" });

    res.json(news);
  } catch (error) {
    console.error("Error in getSingleNews:", error);
    res.status(500).json({ error: "Failed to fetch news article" });
  }
};


// Helper to resolve a secure Cloudinary URL from Multer file object
const resolveCloudinaryUrl = (file) => {
  if (!file) return "";
  const direct = file.secure_url || file.url;
  if (direct) return direct;
  const publicId = file.filename || file.path || file.public_id;
  if (publicId) {
    return cloudinary.url(publicId, { secure: true });
  }
  return "";
};

// ------------------ CREATE NEWS ------------------
export const createNews = async (req, res) => {
  try {
    const { title, content, description, category, imageUrl } = req.body;

    // 🔹 Validate required fields
    if (!title?.trim() || !content?.trim() || !description?.trim() || !category?.trim()) {
      return res.status(400).json({
        message: "All fields are required: title, content, description, and category.",
      });
    }

    // 🔹 Validate category
    const validCategories = ["Technology", "Sports", "Politics", "Entertainment", "Health", "Business"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category." });
    }

    // 🔹 Handle imageUrl (priority: imageUrl > file > default)
    let imageUrlToSave = imageUrl?.trim();
    if (!imageUrlToSave && req.file) {
      console.log("Uploaded file for createNews:", req.file);
      imageUrlToSave = resolveCloudinaryUrl(req.file);
    }
    if (!imageUrlToSave) {
      imageUrlToSave = "https://via.placeholder.com/600x400?text=Default+News+imageUrl"; // 🔹 default fallback
    }

    // 🔹 Create news doc
    const news = new News({
      title: title.trim(),
      content: content.trim(),
      description: description.trim(),
      category,
      imageUrl: imageUrlToSave,
    });

    await news.save();

    res.status(201).json({ message: "News created successfully", news });
  } catch (error) {
    console.error("Error creating news:", error);
    res.status(500).json({ message: "Error creating news" });
  }
};

// ------------------ UPDATE NEWS ------------------
export const updateNews = async (req, res) => {
  try {
    const { title, description, content, category, imageUrl } = req.body;
    // console.log(req.body)

    // 🔹 Build update object only with provided fields
    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description) updateData.description = description.trim();
    if (content) updateData.content = content.trim();
    if (category) updateData.category = category;

    // 🔹 Handle imageUrl (priority: body imageUrl > file > default)
    if (imageUrl?.trim()) {
      updateData.imageUrl = imageUrl.trim();
    } else if (req.file) {
      console.log("Uploaded file for updateNews:", req.file);
      updateData.imageUrl = resolveCloudinaryUrl(req.file);
    } else {
      updateData.imageUrl = "https://via.placeholder.com/600x400?text=Default+News+imageUrl"; // 🔹 default fallback
    }

    const updated = await News.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-__v");

    if (!updated) {
      return res.status(404).json({ error: "News not found" });
    }

    res.json({ message: "News updated successfully", news: updated });
  } catch (error) {
    console.error("Error updating news:", error);
    res.status(500).json({ message: "Error updating news" });
  }
};

// ------------------ LIKE NEWS ------------------
export const likeNews = async (req, res) => {
  try {
    const userId = req.user._id; // assuming auth middleware adds user
    const news = await News.findById(req.params.id);

    if (!news) return res.status(404).json({ error: "News not found" });

    const index = news.likes.indexOf(userId);

    if (index === -1) {
      news.likes.push(userId); // like
    } else {
      news.likes.splice(index, 1); // unlike
    }

    await news.save();

    res.json({ message: "Toggled like", likes: news.likes.length });
  } catch (error) {
    console.error("Error liking news:", error);
    res.status(500).json({ error: "Failed to like news" });
  }
};

// ------------------ UNLIKE NEWS ------------------
export const unlikeNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: -1 } }, // decrement likes
      { new: true }
    ).select("-__v");

    if (!news) return res.status(404).json({ error: "News not found" });

    res.json({ message: "News unliked", likes: news.likes });
  } catch (error) {
    console.error("Error unliking news:", error);
    res.status(500).json({ error: "Failed to unlike news" });
  }
};


// ------------------ DELETE NEWS ------------------
export const deleteNews = async (req, res) => {
  try {
    const deleted = await News.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ error: "News not found" });

    res.json({ message: "News deleted successfully" });
  } catch (error) {
    console.error("Error deleting news:", error.message);
    console.error("Error details:", error);
    res.status(500).json({ message: "Error deleting news", error });
  }
};

// ------------------ INGEST NEWS FROM PROVIDER ------------------
const allowedCategories = ['Technology', 'Sports', 'Politics', 'Entertainment', 'Health', 'Business'];
const newsApiCategoryMap = {
  Technology: 'technology',
  Sports: 'sports',
  Politics: 'general',
  Entertainment: 'entertainment',
  Health: 'health',
  Business: 'business',
};

export const ingestNews = async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY || '997ddd79dbf14327a53f88165b5244cb';
    if (!apiKey) {
      return res.status(500).json({ message: 'NEWS_API_KEY missing' });
    }

    let totalUpserts = 0;
    let totalFetched = 0;

    for (const cat of allowedCategories) {
      const providerCat = newsApiCategoryMap[cat];
      const url = `https://newsapi.org/v2/top-headlines?country=us&category=${encodeURIComponent(providerCat)}&pageSize=50&apiKey=${apiKey}`;
      const resp = await fetch(url);
      if (!resp.ok) {
        console.warn(`Fetch failed for ${cat}:`, resp.status, await resp.text());
        continue;
      }
      const data = await resp.json();
      const articles = Array.isArray(data.articles) ? data.articles : [];
      totalFetched += articles.length;

      for (const a of articles) {
        const title = a.title?.trim();
        if (!title) continue;
        const description = a.description?.trim() || '';
        const content = a.content?.trim() || description;
        const imageUrl = a.urlToimageUrl || '';
        const mapped = {
          title,
          description,
          content,
          category: cat,
          imageUrl,
        };
        const resUpsert = await News.updateOne(
          { title: mapped.title },
          { $setOnInsert: mapped },
          { upsert: true }
        );
        if (resUpsert.upsertedCount || (resUpsert.upserted && resUpsert.upserted.length)) {
          totalUpserts += 1;
        }
      }
    }

    res.json({ message: 'Ingest complete', totalFetched, totalInserted: totalUpserts });
  } catch (error) {
    console.error('Ingest error:', error);
    res.status(500).json({ message: 'Failed to ingest news', error: error?.message || error });
  }
};
