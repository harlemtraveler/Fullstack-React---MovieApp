import React from 'react';
import {
    Route,
    Switch
} from 'react-router-dom';
import {
    pageWithoutLayout
} from './containers/page';

import Home from './views/Home/Home';
import About from './views/About/About';

export const Routes = props => (
    <Switch className='app'>
        <Route
            path='/'
            exact
            render={(renderProps) => (
                <Home {...props} {...renderProps} />
            )}
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
    </Switch>
)

export default pageWithoutLayout(Routes);
