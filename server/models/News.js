import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Sports', 'Politics', 'Entertainment', 'Health', 'Business']
  },
  imageUrl: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Automatically update `updatedAt` on save
newsSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const News = mongoose.model('News', newsSchema);
export default News;
