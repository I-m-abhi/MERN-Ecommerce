import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import "../pageStyles/Products.css";
import Product from "../components/Product";
import { useEffect, useState } from "react";
import { getProduct, removeErrors } from "../features/products/productSlice";
import Loader from "../components/Loader";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import NoProducts from "../components/NoProducts";
import { toast } from "react-toastify";
import Pagination from "../components/Pagination";

const Products = () => {
  const { loading, error, products } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword");
  const category = searchParams.get("category");
  const pageFromUrl = parseInt(searchParams.get("page"), 10) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromUrl)
  const navigate = useNavigate();

  const onPageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      const newSearchParams = new URLSearchParams(location.search);
      if (page === 1) {
        newSearchParams.delete("page")
      } else {
        newSearchParams.set("page", page)
      }
      navigate(`?${newSearchParams.toString()}`)
    }
  }

  useEffect(() => {
    dispatch(getProduct({ keyword, page: currentPage, category }))
  }, [dispatch, keyword, currentPage, category])

  useEffect(() => {
    if (error) {
      toast.error(error.message, { position: 'top-center', autoClose: 3000 });
      dispatch(removeErrors())
    }
  }, [dispatch, error])

  //  if(loading) {
  //   return <Loader />
  //  }

  const categories = ["shirt", "mobile", "jeans", "geyser", "glass", "motar", "fan", 'laptop']

  const handleCategoryClick = (category) => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set("category", category)
    newSearchParams.delete("page")
    navigate(`?${newSearchParams.toString()}`)
  }

  return (
    <>
      <PageTitle title={"All Products"} />
      <Navbar />
      <div className="products-layout">
        <div className="filter-section">
          <h3 className="filter-heading">CATEGORIES</h3>
          {/* Render Categorires */}
          <ul>
            {categories.map((category) => (
              <li key={category} onClick={() => handleCategoryClick(category)}>{category}</li>
            ))}
          </ul>
        </div>
        <div className="product-section">
          {products.length > 0 ? (<div className="products-product-container">
            {products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>) : (
            <NoProducts keyword={keyword} />
          )}

          <Pagination currentPage={currentPage} onPageChange={onPageChange} />
        </div>
      </div>
    </>
  )
};

export default Products;