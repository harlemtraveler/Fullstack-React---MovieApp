const BASE_URL = 'http://localhost:3456'
// const BASE_URL = 'https://api.themoviedb.org/3'
const defaultFetchOpts = {}
const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiYzVjYzYzZjAtOGVjOC0xMWU4LTg5YjItNGQ5ZjQ3OGFlNzlkIiwiaWF0IjoxNTMyMzg1NDY0fQ.UmHyiAZQhZY0Z_209uaeTVW38_u7KgW7FDymg804pxQ"
// const AUTH_TOKEN = ""

// This takes in a parameter that's an object and
// returns it's properties replaced with their encoded values
const queryParams = params => Object.keys(params)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&')

const completeUrl = (path, query={}) => {
    let url = `${BASE_URL}${path}`
    // add query here
    if (Object.keys(query).length > 0) {
        url += (url.indexOf('?') === -1 ? '?': '&') + queryParams(query)
    }
    return url
}

const makeFetchOpts = (opts={}) => {
    const userHeaders = opts.headers || {}
    delete opts.headers
    const headers = new Headers({
        ...defaultHeaders,
        ...userHeaders
    })
    return {...defaultFetchOpts, ...opts, headers}
}

export const makeFetch = (path, opts={}) => {
    const url = completeUrl(path, opts.query)
    const fetchOpts = makeFetchOpts(opts)
    return fetch(url, fetchOpts)
        .then(resp => {
            if (resp.ok) return resp.json()
            const err = resp.statusText
            throw new Error(err)
        })
}

export const makeAuthFetch = (path, opts={}) => {
    const fetchOpts = {
        ...opts,
        headers: {
            'Authorization': `Bearer ${AUTH_TOKEN}`
        }
    }
    return makeFetch(path, fetchOpts)
}
