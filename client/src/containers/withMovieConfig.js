import React, { Component } from 'react';
import { movieConfig } from '../data/api/movies';

export const withMovieConfig = Wrapped => props => {
    class WithMovieConfig extends Component {
        state = {
            movieConfig: null
        }

        componentDidMount() {
            movieConfig().then(cfg => {
                this.setState({
                    movieConfig: cfg
                })
            })
        }

        render() {
            const { movieConfig } = this.state
            if (!movieConfig) return (<div>Loading...</div>)

            return (<Wrapped
                    movieConfig={movieConfig}
                    {...props} />)
        }
    }
    return <WithMovieConfig {...props} />
}

export default withMovieConfig;
