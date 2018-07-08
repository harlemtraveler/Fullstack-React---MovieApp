import React from 'react';
import {
    Route
} from 'react-router-dom';
import {
    pageWithoutLayout
} from './containers/page';

import Home from './views/Home/Home';
import About from './views/About/About';

export const Routes = props => (
    <div className='app'>
        <Route
            path='/'
            exact
            component={Home}
        />
        <Route
            path='/about'
            render={(renderProps) => (
                <About
                    {...props}
                    {...renderProps}
                />
            )}
        />
    </div>
)

export default pageWithoutLayout(Routes);
