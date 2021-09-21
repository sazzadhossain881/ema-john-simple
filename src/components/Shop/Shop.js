import React, { useEffect, useState } from 'react';
import { addToDatabaseCart, getDatabaseCart } from '../../utilities/databaseManager';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import { Link } from 'react-router-dom';
import './Shop.css'

const Shop = () => {
    // const firstTen = fakeData.slice(0, 10);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetch('https://polar-river-17164.herokuapp.com/products')
            .then(res => res.json())
            .then(data => setProducts(data))
    }, []);


    useEffect(() => {
        const saveCart = getDatabaseCart();
        const productKeys = Object.keys(saveCart);
        console.log(products, productKeys);
        fetch('https://polar-river-17164.herokuapp.com/productByKeys', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productKeys)
        })
            .then(res => res.json())
            .then(data => setCart(data))
    }, [])

    const handleAddProduct = (product) => {
        const sameProduct = cart.find(pd => pd.key === product.key)
        let count = 1;
        let newCart;
        if (sameProduct) {
            count = sameProduct.quantity + 1;
            sameProduct.quantity = count;
            const others = cart.filter(pd => pd.key !== product.key)
            newCart = [...others, sameProduct];
        }
        else {
            product.quantity = 1;
            newCart = [...cart, product];
        }
        setCart(newCart);
        addToDatabaseCart(product.key, count);
    }

    return (
        <div className="shop-container">
            <div className="product-container">
                {
                    products.length === 0 && <p>Loading....</p>
                }
                {products.map(pd => <Product showAddToCart={true} handleAddProduct={handleAddProduct} product={pd} key={pd.key}></Product>)}
            </div>
            <div className="cart-container">
                <Cart cart={cart}>
                    <Link to={"/review"}><button className="main-button">Review Order</button></Link>
                </Cart>
            </div>
        </div>
    );
};

export default Shop;