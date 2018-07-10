import { makeAuthFetch } from './utils';

// This is the first API endpoint to fetch, a route to 'movies'
// This is essentially the 'discover' movies API route according to the docs
export const discover = (opts={}) => makeAuthFetch('/movies', opts)
export const movieConfig = (opts={}) => makeAuthFetch('/config', opts)
