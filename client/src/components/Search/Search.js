import React, { Component } from 'react';

export class Search extends Component {
    state = {
        searchValue: ''
    }

    handleSearch = () => {
        const { searchValue } = this.state;
        this.props.onSearch(searchValue)
    }

    onChange = e => {
        e.preventDefault()
        this.setState({
            searchValue: e.target.value
        }, () => this.handleSearch(e))
    }

    onSubmit = e => {
        e.preventDefault()
        this.handleSearch()
    }

    render() {
        return (
            <section>
                <form onSubmit={this.onSubmit}>
                    <input
                        onChange={this.onChange}
                        placeholder='Search...'
                        type='search'
                    />
                </form>
            </section>
        );
    }
}

export default Search;
