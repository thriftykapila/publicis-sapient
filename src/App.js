import { useEffect } from "react";
import { useState } from "react";
import "./styles.css";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [cartData, setCartData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function getData() {
      setLoading(true);
      setErrorMessage(``);
      const CARTNUMBER = 2;
      const cartUrl = `https://fakestoreapi.com/carts/${CARTNUMBER}`;

      const cartData = await fetch(cartUrl);
      const fetchedCartData = await cartData.json();

      getProducts(fetchedCartData.products);
    }

    getData();
  }, []);

  async function getProducts(products) {
    try {
      const productDetails = await Promise.all(
        products.map(async ({ productId, quantity }) => {
          const url = `https://fakestoreapi.com/products/${productId}`;
          const data = await fetch(url);
          const fetchedData = await data.json();

          return { ...fetchedData, quantity };
        })
      );
      setCartData(productDetails);
    } catch {
      setErrorMessage(`Something went wrong`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="App">
      <h1>Jio Cart</h1>
      {!loading ? (
        <div>
          {cartData.map(({ description, image, title, price, quantity }) => (
            <div className="cart-data">
              <div className="image">
                <img height={50} width={50} alt={description} src={image} />
              </div>
              <div>
                <label>Product Title : </label>
                <span className="title">{title}</span>
              </div>
              <div>
                <label>Quantity :</label>
                <span className="quantity">{quantity}</span>
              </div>
              <div>
                <label>Price :</label>
                <span className="price">{price}</span>
              </div>
              <label>Total Price :</label>
              <span className="total-price">{price * quantity}</span>
            </div>
          ))}
        </div>
      ) : (
        <div>Loading...</div>
      )}
      <div className="error-warning">{errorMessage}</div>
    </div>
  );
}
