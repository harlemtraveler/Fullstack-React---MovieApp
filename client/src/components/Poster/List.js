import React, { Component } from 'react';
import Poster from './Poster';

export const PosterList = ({ movies, movieConfig }) => (
    <div className='poster_list'>
        {movies && movies.map(movie => (
            <Poster
                key={movie.id}
                movieConfig={movieConfig}
                {...movie} />
        ))}
    </div>
)

export default PosterList;
