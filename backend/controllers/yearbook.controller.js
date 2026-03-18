const path = require('path');
const multer = require('multer');
const Yearbook = require('../models/Yearbook');

const uploadDirectory = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDirectory),
  filename: (_req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF uploads are allowed'));
    }

    cb(null, true);
  }
});

const uploadYearbook = [
  upload.single('file'),
  async (req, res) => {
    try {
      const { title, year, class: className } = req.body;

      if (!title || !year || !className || !req.file) {
        return res.status(400).json({
          message: 'title, year, class, and file are required'
        });
      }

      const yearbook = await Yearbook.create({
        title,
        year: Number(year),
        class: className,
        filePath: `/uploads/${req.file.filename}`,
        uploadedBy: req.user._id
      });

      return res.status(201).json(yearbook);
    } catch (error) {
      return res.status(500).json({ message: 'Could not upload yearbook', error: error.message });
    }
  }
];

const getYearbooks = async (_req, res) => {
  try {
    const yearbooks = await Yearbook.find()
      .populate('uploadedBy', 'username email role')
      .sort({ year: -1, createdAt: -1 });

    return res.json(yearbooks);
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch yearbooks', error: error.message });
  }
};

const getYearbook = async (req, res) => {
  try {
    const yearbook = await Yearbook.findById(req.params.id)
      .populate('uploadedBy', 'username email role')
      .populate('bookmarks.user', 'username email')
      .populate('comments.user', 'username email');

    if (!yearbook) {
      return res.status(404).json({ message: 'Yearbook not found' });
    }

    return res.json(yearbook);
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch yearbook', error: error.message });
  }
};

const addBookmark = async (req, res) => {
  try {
    const page = Number(req.body.page);

    if (!Number.isFinite(page) || page < 1) {
      return res.status(400).json({ message: 'A valid page number is required' });
    }

    const yearbook = await Yearbook.findById(req.params.id);

    if (!yearbook) {
      return res.status(404).json({ message: 'Yearbook not found' });
    }

    yearbook.bookmarks.push({
      user: req.user._id,
      page
    });

    await yearbook.save();

    return res.status(201).json({
      message: 'Bookmark added',
      bookmarks: yearbook.bookmarks
    });
  } catch (error) {
    return res.status(500).json({ message: 'Could not add bookmark', error: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const text = (req.body.text || '').trim();
    const page = req.body.page ? Number(req.body.page) : 1;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const yearbook = await Yearbook.findById(req.params.id);

    if (!yearbook) {
      return res.status(404).json({ message: 'Yearbook not found' });
    }

    yearbook.comments.push({
      user: req.user._id,
      page: Number.isFinite(page) && page > 0 ? page : 1,
      text
    });

    await yearbook.save();

    return res.status(201).json({
      message: 'Comment added',
      comments: yearbook.comments
    });
  } catch (error) {
    return res.status(500).json({ message: 'Could not add comment', error: error.message });
  }
};

module.exports = {
  uploadYearbook,
  getYearbooks,
  getYearbook,
  addBookmark,
  addComment
};
