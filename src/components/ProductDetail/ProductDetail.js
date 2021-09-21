import React, { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router';
import Product from '../Product/Product';

const ProductDetail = () => {
    const { productKey } = useParams();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState({})
    useEffect(() => {
        fetch('https://polar-river-17164.herokuapp.com/product/' + productKey)
            .then(res => res.json())
            .then(data => {
                setProduct(data)
                setLoading(false);
            })
    }, [productKey])
    // const product = fakeData.find(product => product.key === productKey);
    return (
        <div>
            {
                loading === true ? <p>Loading...</p> : <Product showAddToCart={false} product={product}></Product>
            }
        </div>
    );
};

export default ProductDetail;