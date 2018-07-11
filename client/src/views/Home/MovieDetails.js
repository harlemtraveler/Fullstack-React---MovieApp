import React, { Component } from 'react';
import { getMovie, getMovieImages } from '../../data/api/movies';
import ContentHeader from '../../components/ContentHeader/ContentHeader';
import StarRating from '../../components/StarRating/StarRating';

export class MovieDetails extends Component {
    state = {
        movies: null,
        images: []
    }

    componentDidMount() {
        const { match } = this.props
        const { id } = match.params

        getMovie(id)
            .then(movie => this.setState({ movie }))
            .then(() => getMovieImages(id))
            .then(({posters}) => this.setState({
                images: posters
            }))
    }

    imageUrl = (poster_path) => {
        const { movieConfig } = this.props;
        return `${movieConfig.images.base_url}/w500/${poster_path}`
    }

    render() {
        const { movie, images } = this.state
        if (!movie) return (
            <div className='loading'>Loading...</div>
        );
        return (
            <ContentHeader
                title={movie.title}
                sticky={true}
                className={'movie_details'}
                left={(
                    <div className='btn'>
                        Watch trailer
                    </div>
                )}
                style={{
                    backgroundImage: `url(${this.imageUrl(movie.backrop_path)})`
                }}
                right={(
                    <section>
                        <StarRating rating={(movie.vote_average/10)*100} />
                    </section>
                )}>
                <div className='images'>
                    {images && images.map(i => (
                        <img
                            key={i.file_path}
                            alt={movie.name}
                            src={this.imageUrl(i.file_path)}
                        />
                    ))}
                </div>
                <div className='genres'>
                    {movie.genres.map(g => (
                        <span
                            key={g.id}
                            className='genre'
                        >
                            {g.name}
                        </span>
                    ))}
                </div>
                <div className='desc'>
                    {movie.overiew}
                </div>
            </ContentHeader>
        );
    }
}

export default MovieDetails;
