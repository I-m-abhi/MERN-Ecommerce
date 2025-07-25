import Navbar from "../components/Navbar";
import ImageSlider from "../components/ImageSlider";
import Product from "../components/Product";
import "../pageStyles/Home.css";
import PageTitle from "../components/PageTitle";

const products = [
  {
    "_id": "687ad60f22bff29d66a89863",
    "name": "Product1",
    "description": "project description",
    "price": 100,
    "ratings": 3,
    "images": [
      {
        "public_id": "test id",
        "url": "this is test url",
        "_id": "687ad60f22bff29d66a89864"
      }
    ],
    "category": "shirt",
    "stock": 9,
    "numOfReviews": 1,
    "reviews": [
      {
        "user": "687ef12f68bda0846b061d32",
        "name": "bittu",
        "rating": 3,
        "comment": "Awesome again 5 ",
        "_id": "687f08f1885da5b08c68e03b"
      }
    ],
    "createdAt": "2025-07-18T23:17:35.420Z",
    "__v": 2
  },
  {
    "_id": "687ad61a22bff29d66a89866",
    "name": "Product2",
    "description": "project description",
    "price": 990,
    "ratings": 2.5,
    "images": [
      {
        "public_id": "test id",
        "url": "this is test url",
        "_id": "687ad61a22bff29d66a89867"
      }
    ],
    "category": "shirt",
    "stock": 4,
    "numOfReviews": 0,
    "reviews": [],
    "createdAt": "2025-07-18T23:17:46.734Z",
    "__v": 0
  },
  {
    "_id": "687ad61f22bff29d66a89869",
    "name": "Product3",
    "description": "project description",
    "price": 990,
    "ratings": 6,
    "images": [
      {
        "public_id": "test id",
        "url": "this is test url",
        "_id": "687ad61f22bff29d66a8986a"
      }
    ],
    "category": "shirt",
    "stock": 1,
    "numOfReviews": 3,
    "reviews": [],
    "createdAt": "2025-07-18T23:17:51.187Z",
    "__v": 0
  }
]

const Home = () => {
  return (
    <div className="home">
      <PageTitle title={`Home - MERN-Ecommerce`} />
      <Navbar />
      <ImageSlider />
      <div className="home-product-container">
        {products.map((product, index) => (
          <Product key={index} product={product} />
        ))}
      </div>
    </div>
  )
};

export default Home;