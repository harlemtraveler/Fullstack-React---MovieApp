import React, { Component } from 'react';
import PosterList from '../../components/Poster/List';
import ContentHeader from '../../components/ContentHeader/ContentHeader';
import Search from '../../components/Search/Search';

export const Discover = props => {
    const {
        onSearch,
        onLoadMore,
        movies,
        movieConfig
    } = props

    return (
        <ContentHeader
            sticky={true}
            right={<Search onSearch={onSearch} />}
            title={'Discover'}>
            <PosterList
                movies={movies}
                movieConfig={movieConfig}
            />
            <div
                className='load_more'
                onClick={onLoadMore}
            >
                Load More
            </div>
        </ContentHeader>
    );
}

export default Discover;
