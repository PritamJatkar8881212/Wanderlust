const express = require("express")
const router = express.Router({mergeParams: true});

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const review = require("../models/review.js");

const reviewController = require("../controllers/reviews.js");

// Reviews 
// Post Review route
router.post("/", validateReview, isLoggedIn, wrapAsync(reviewController.createReview));

// Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;