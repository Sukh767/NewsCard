import News from '../models/News.js';

const getAllNews = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const news = await News.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    const total = await News.countDocuments(query);

    res.json({
      news,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news articles' });
  }
};

const getFeaturedNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 }).limit(5);
    res.json(news);
  } catch (error) {
    console.error('Error fetching featured news:', error);
    res.status(500).json({ error: 'Failed to fetch featured news articles' });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await News.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

const getSingleNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ error: 'News article not found' });
    }
    res.json(news);
  } catch (error) {
    console.error('Error fetching news article:', error);
    res.status(500).json({ error: 'Failed to fetch news article' });
  }
};

const createNews = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { title, content, description, category, imageUrl } = req.body;
    if (!title || !content || !description || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let finalImageUrl = imageUrl || '';
    if (req.file) {
      finalImageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const news = new News({ title, content, description, category, imageUrl: finalImageUrl });
    const savedNews = await news.save();
    res.status(201).json(savedNews);
  } catch (error) {
    console.error('Error creating news article:', error);
    res.status(500).json({ error: 'Failed to create news article' });
  }
};

const updateNews = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { title, content, description, category, imageUrl } = req.body;
    if (!title || !content || !description || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ error: 'News article not found' });

    let finalImageUrl = imageUrl || news.imageUrl;
    if (req.file) {
      finalImageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    Object.assign(news, { title, content, description, category, imageUrl: finalImageUrl });
    const updatedNews = await news.save();
    res.json(updatedNews);
  } catch (error) {
    console.error('Error updating news article:', error);
    res.status(500).json({ error: 'Failed to update news article' });
  }
};

const deleteNews = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ error: 'News article not found' });

    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'News article deleted successfully' });
  } catch (error) {
    console.error('Error deleting news article:', error);
    res.status(500).json({ error: 'Failed to delete news article' });
  }
};


export {
  getAllNews,
  getFeaturedNews,
  getCategories,
  getSingleNews,
  createNews,
  updateNews,
  deleteNews
};