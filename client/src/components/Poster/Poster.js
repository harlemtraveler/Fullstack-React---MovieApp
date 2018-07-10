import React, { Component } from 'react';

const posterPath = ({images, poster_path}) => {
    return `${images.base_url}/w500${poster_path}`
}

export const Poster = ({ title, movieConfig, poster_path }) => (
    <div className='poster'>
        { title }
        <img alt={title} src={posterPath({ poster_path, ...movieConfig })} />
    </div>
)

export default Poster;
