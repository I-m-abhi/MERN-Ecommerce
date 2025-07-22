import Product from "../models/product.model.js";
import HandleError from "../utils/handleError.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import APIFunctionality from "../utils/apiFunctionality.js";

export const createProduct = handleAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    sucess: true,
    product
  })
})

export const getAllProducts = handleAsyncError(async (req, res, next) => {
  const resultPerPage = 3;
  const apiFeatures = new APIFunctionality(Product.find(), req.query)
    .search()
    .filter();

  // Getting filtered query before pagination
  const filteredQuery = apiFeatures.query.clone();
  const totalProducts = await filteredQuery.countDocuments();

  // Calculating total pages
  const totalPages = Math.ceil(totalProducts / resultPerPage);
  const currentPage = Number(req.query.page) || 1;

  if (currentPage > totalPages && totalProducts > 0) {
    return next(new HandleError("This page does not exist", 404));
  }

  // Applying pagination
  apiFeatures.pagination(resultPerPage);

  const products = await apiFeatures.query;

  if (!products || products.length === 0) {
    return next(new HandleError("No Products Found", 404));
  }

  res.status(200).json({
    success: true,
    products,
    totalProducts,
    resultPerPage,
    totalPages,
    currentPage
  })
})

export const updateProduct = handleAsyncError(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    // useFindAndModify: false
  });

  // if (!product) {
  //   return res.status(500).json({
  //     success: false,
  //     message: "Project not found",
  //   })
  // }

  if (!product) {
    return next(new HandleError("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    product
  });
})

export const deleteProduct = handleAsyncError(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new HandleError("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully"
  });
})

export const getProductDetails = handleAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new HandleError("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    product
  });
})

// Create and update product review
export const createProductReview = handleAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  }
  const product = await Product.findById(productId);
  if (!product) {
    return next(new HandleError("Product not found", 400))
  }

  //??? Understand it console.log("id",req.user.id, "_id", req.user._id)
  const isReviewExists = product.reviews.find(review => review.user.toString() === req.user._id.toString());
  if (isReviewExists) {
    product.reviews.forEach(review => {
      if (review.user.toString() === req.user.id.toString()) {
        review.rating = rating;
        review.comment = comment;
      }
    })
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  let sumOfRating = 0;
  product.reviews.forEach(review => sumOfRating += review.rating);
  product.ratings = product.reviews.length > 0 ? sumOfRating / product.reviews.length : 0;

  product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: "Review Added Successfully",
    product
  });

})

export const getProductReviews = handleAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new HandleError("Product Not Found", 400));
  }
  const reviews = product.reviews;
  res.status(200).json({
    sucess: true,
    reviews
  })
})

export const deleteReview = handleAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new HandleError("Product Not Found", 400));
  }
  const reviews = product.reviews.filter((review) => {
    return review._id.toString() !== req.query.id.toString();
  })
  let sumOfRating = 0;
  reviews.forEach(review => sumOfRating += review.rating);
  const ratings = reviews.length > 0 ? sumOfRating / reviews.length : 0;
  const numOfReviews = reviews.length;
  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    ratings,
    numOfReviews,
  }, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })
  res.status(200).json({
    success: true,
    message: "Review Deleted Successfully"
  });
})