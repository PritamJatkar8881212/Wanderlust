const express = require("express")
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const ListingController = require("../controllers/listings.js"); 
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });

router
    .route("/")
    .get(wrapAsync(ListingController.index))   // Index Route
    .post(
        isLoggedIn,
        upload.single('listing[image]'),  // Upload image
        validateListing,  // Validate listing data
        wrapAsync(ListingController.createListing), // Controller to handle create
    );  // Create Route

    

//New Route
router.get("/new", isLoggedIn, ListingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(ListingController.showListing))  // Show Route
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(ListingController.updateListingForm))  // Update Route
    .delete(isLoggedIn, isOwner, wrapAsync(ListingController.deleteListing));  // Delete Route

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.editListingForm));

module.exports = router;