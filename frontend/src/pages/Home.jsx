import Navbar from "../components/Navbar";
import ImageSlider from "../components/ImageSlider";
import Product from "../components/Product";
import Loader from "../components/Loader";
import "../pageStyles/Home.css";
import PageTitle from "../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, removeErrors } from "../features/products/productSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";

const Home = () => {
  const { loading, error, products, productsCount } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProduct({keyword: ""}))
  }, [dispatch])

  useEffect(()=> {
    if(error) {
      toast.error(error.message, {position: 'top-center', autoClose: 3000});
      dispatch(removeErrors())
    }
  }, [dispatch, error])

  return (
    <div className="home">
      <PageTitle title={`Home - MERN-Ecommerce`} />
      <Navbar />
      <ImageSlider />

      {loading ? <Loader /> :
        <div className="home-product-container">
          {products.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      }
    </div>
  )
};

export default Home;