import Product from "../models/product.model.js";
import HandleError from "../utils/handleError.js";
// import handleAsyncError from "../middleware/handleAsyncError.js";
import APIFunctionality from "../utils/apiFunctionality.js";

export const createProduct = async (req, res) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    sucess: true,
    product
  })
};

export const getAllProducts = async (req, res, next) => {
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
}

export const updateProduct = async (req, res, next) => {
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
}

export const deleteProduct = async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new HandleError("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully"
  });
}

export const getProductDetails = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new HandleError("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    product
  });
}