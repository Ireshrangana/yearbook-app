const express = require('express');
const router = express.Router();
const {
  uploadYearbook,
  getYearbooks,
  getYearbook,
  addBookmark,
  addComment
} = require('../controllers/yearbook.controller');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, admin, uploadYearbook);
router.get('/', protect, getYearbooks);
router.get('/:id', protect, getYearbook);
router.post('/:id/bookmarks', protect, addBookmark);
router.post('/:id/comments', protect, addComment);

module.exports = router;