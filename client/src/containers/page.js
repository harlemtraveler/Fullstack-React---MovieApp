import withSidebarLayout from './withSidebarLayout';
import withRouter from '../withRouter';
import withMovieConfig from './withMovieConfig';

export const pageWithoutLayout = Wrapped => {
    return withMovieConfig(withRouter(Wrapped))
}

export const pageWithLayout = Wrapped => withSidebarLayout(Wrapped)

export default pageWithLayout;
