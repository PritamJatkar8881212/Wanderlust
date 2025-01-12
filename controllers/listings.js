const Listing = require("../models/listing.js");
const cloudinary = require('../cloudConfig').cloudinary;

const extractPublicId = (imageUrl) => {
    const parts = imageUrl.split('/');
    const versionIndex = parts.findIndex(part => part.startsWith('v')) + 1;
    const publicIdWithExtension = parts.slice(versionIndex).join('/');
    return publicIdWithExtension.replace(/\.[^/.]+$/, ''); // Remove file extension
};

const deleteImageByUrl = (imageUrl) => {
    const publicId = extractPublicId(imageUrl);
    console.log(publicId);

    cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
            console.error('Error deleting image:', error);
        } else {
            console.log('Image deleted successfully:', result);
        }
    });
};

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({}); const validateListing = (req, res, next) => {
        let { error } = listingSchema.validate(req.body);
        if (error) {
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errMsg);
        }
        else {
            next();
        }
    }
    // res.render("index.ejs", { allListings });                        
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render('listings/new.ejs');
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    }).populate('owner');
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });   
}

module.exports.createListing = async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    newListing.image = {
        url: req.file.path,
        filename: req.file.filename
    };
    await newListing.save();
    console.log(req.file.path + " " + req.file.filename);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.editListingForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    let previewImageURL = listing.image.url;
    previewImageURL = previewImageURL.replace("upload/", "upload/w_400,h_300/");
    res.render("listings/edit.ejs", { listing, previewImageURL });
}

module.exports.updateListingForm = async (req, res) => {
    console.log("in update route");
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        deleteImageByUrl(listing.image.url);
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        await listing.save();
    }

    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    console.log(req.params);
    const listing = await Listing.findById(id);
    await Listing.findByIdAndDelete(id);
    deleteImageByUrl(listing.image.url);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect(`/listings`);
}

