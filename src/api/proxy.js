export const proxy = process.env.NODE_ENV === 'production' ? 'http://' + window.location.hostname + ':' + window.location.port + '/' : '/proxy/'
