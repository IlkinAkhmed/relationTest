import { useEffect, useState } from 'react'
import './App.css'
import axios from "axios"

function App() {

  const [products, setProducts] = useState(null)
  const [basket, setBasket] = useState(null)
  


  async function handleIncrease(id) {
    await axios.post('http://localhost:7000/users/65ca373c6e364026ca2f87a4/increaseCount', { productId: id })
    await fetchBasketData()

  }


  async function handleDecrease(id) {
    await axios.post('http://localhost:7000/users/65ca373c6e364026ca2f87a4/decreaseCount', { productId: id })
    await fetchBasketData()
  }


  async function handleDelete(id) {
    await axios.post(`http://localhost:7000/users/65ca373c6e364026ca2f87a4/delete`, { productId: id });
    await fetchBasketData()
  }


  async function fetchBasketData() {
    const res = await axios.get('http://localhost:7000/users/65ca373c6e364026ca2f87a4/basket')
    setBasket(res.data)
  }

  async function addToCart(id) {
    const res = await axios.post('http://localhost:7000/users/65ca373c6e364026ca2f87a4/addBasket', { productId: id })
    res.status === 201 ? alert('Already In Cart') : alert('Added To Cart')
    await fetchBasketData()
  }

  async function fetchData() {
    const res = await axios('http://localhost:7000/products/')
    setProducts(res.data)
  }
  useEffect(() => {
    fetchBasketData()
    fetchData()
  }, [])
  return (
    <>
      <div style={{ backgroundColor: 'gray' }} className="basket">
        <h2>Basket</h2>
        <ul>
          {basket && basket.map(item => (
            <>
              <li>{item.product.title}</li>
              <li>${item.product.newPrice}</li>
              <button onClick={() => handleIncrease(item._id)}>+</button>
              <li>qty: {item.count}</li>
              <button onClick={() => handleDecrease(item._id)}>-</button>
              <button onClick={() => handleDelete(item._id)}>delete</button>
              <hr />
            </>
          ))}
        </ul>
      </div>
      <div className="shop">
        <h1>Shopping</h1>
        <ul>
          {products && products.map(item => (
            <>
              <li>{item.title}</li>
              <li>${item.price}</li>
              <button onClick={() => addToCart(item._id)}>add</button>
              <hr />
            </>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
