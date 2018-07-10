import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { pageWithoutLayout, pageWithLayout } from '../../containers/page';
import { discover } from '../../data/api/movies';
import PosterList from '../../components/Poster/List';

export class Home extends Component {
    state = {
        movies: []
    }

    componentDidMount() {
        discover().then(({movies}) => {
            this.setState({ movies })
        })
    }

    render() {
        const { movies } = this.state
        const { movieConfig } = this.props
        return (
            <div className='home'>
                <h2>Welcome home</h2>
                <PosterList
                    movies={movies}
                    movieConfig={movieConfig}
                />
                <Link to='/about'>About us</Link>
            </div>
        );
    }
}

export default pageWithoutLayout(pageWithLayout(Home));
