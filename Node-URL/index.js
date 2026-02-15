const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { nanoid } = require('nanoid');
const Url = require('./models/Url');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/urlshortener')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// --- ROUTES ---

// 1. Generate Short URL
app.post('/api/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  
  // Simple generation of 6-char ID
  // Note: For older nanoid versions use require('nanoid'), for v3+ import might differ
  // Or just write a quick random string function if nanoid gives version errors
  const shortId = nanoid(6); 

  try {
    let url = await Url.findOne({ originalUrl });
    if (url) {
      res.json(url);
    } else {
      url = new Url({
        originalUrl,
        shortId,
        date: new Date()
      });
      await url.save();
      res.json(url);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
});

// 2. Redirect to Original URL
app.get('/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ shortId: req.params.code });

    if (url) {
      // Increment clicks (Optional feature)
      url.clicks++;
      url.save();
      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json('No URL found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));