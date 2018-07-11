import React, { Component } from 'react';

export const StarRating = ({ rating }) => (
    <span className='star-rating'>
        <span
            style={{
                width: `${rating}%`
            }}
        />
    </span>
)

export default StarRating;
