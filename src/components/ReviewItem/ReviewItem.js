import React from 'react';
import './ReviewItem.css'

const ReviewItem = (props) => {
    const {name,quantity,key,price}=props.product;
    console.log(props);
    return (
        <div className="review-item">
            <h4 className="product-name">{name}</h4>
            <p>Quantity:{quantity}</p>
            <p><small>$ {price}</small></p>
            <br />
            <button onClick={() => props.removeProduct(key)} className="main-button">Remove</button>
        </div>
    );
};

export default ReviewItem;