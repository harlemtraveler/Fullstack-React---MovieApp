import React, { Component } from 'react';
import { Link } from 'react-router-dom'

const posterPath = ({images, poster_path}) => {
    return `${images.base_url}/w500${poster_path}`
}

export const Poster = ({ id, title, movieConfig, poster_path }) => (
    <Link
        to={`/movies/${id}`}
        className='poster'>
        <img
            alt={title}
            src={posterPath({ poster_path, ...movieConfig })}
        />
        <div className='details'>
            { title }
        </div>
    </Link>
)

export default Poster;
