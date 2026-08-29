const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { authenticate } = require('../middlewares/auth');

//публичный маршрут
router.get('/products/:id/reviews', reviewController.getReviews);

// защищенные
router.post('/reviews', authenticate, reviewController.postReview);
router.put('/reviews', authenticate, reviewController.changeReview);
router.delete('/reviews/:id', authenticate, reviewController.deleteReview);

module.exports = router;
