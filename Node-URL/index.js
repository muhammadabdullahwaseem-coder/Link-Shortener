const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { nanoid } = require('nanoid');
const Url = require('./models/Url');
require('dotenv').config();

const app = express();

app.use(express.json());

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://link-shortener-pn72.onrender.com"
    ],
    credentials: true
}));

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/urlshortener')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.post('/api/shorten', async (req, res) => {
  const { originalUrl } = req.body;

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

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.get('/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ shortId: req.params.code });

    if (url) {
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
