import React from 'react';
import {
    BrowserRouter as Router,
} from 'react-router-dom';

export const withRouter = Wrapped =>
props => (
    <Router>
        <Wrapped {...props} />
    </Router>
)

export default withRouter;
// !!!Duplicate File!!!
// This is the original file.
// The file currently on use is located in "client/src/ocntainers/withRouter.js"
