import express from 'express'
import { getReviews, createReview, updateReview, deleteReview, getReviewById } from '../controllers/reviewController.js';
import { validateReviewRegistration, validateReviewModificar, validateReviewID } from '../middleware/validators/reviewValidators.js';
import { checkAuth } from '../middleware/authMiddleware.js';

const reviewRoutes = express.Router();

reviewRoutes.get('/', getReviews)
reviewRoutes.get('/:_id', validateReviewID, getReviewById)
reviewRoutes.post('/', checkAuth, validateReviewRegistration, createReview)
reviewRoutes.put('/:_id', checkAuth, validateReviewModificar, updateReview)
reviewRoutes.delete('/:_id', checkAuth, validateReviewID, deleteReview);


export { reviewRoutes }
