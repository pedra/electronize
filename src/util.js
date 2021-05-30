/*
    Electronizer

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronizer

 */

module.exports = {

    _dez: v => (v < 10 ? '0' + v : v),

    // Retira as barras no final da URL => '/site.com/data////' == '/site.com/data'
    _u: u => u.substr(-1) == '/' ? _u(u.slice(0, -1)) : u,

    // Generate a token base 36 from datetime || unkey: decode base 36 string to integer
    tokey: n => ('number' == typeof n ? n : new Date().getTime()).toString(36),
    unkey: t => ('string' == typeof t ? parseInt(t, 36) : false),

    // Convert Real(currency) to float || ftor: float to Real
    rtof: v => parseFloat((v.trim() == '' ? (v = '0') : v).replace(/\.| /g, '').replace(/,/g, '.')),
    ftor: v => parseFloat(v).toLocaleString('pt-br', { minimumFractionDigits: 2 }),

    // Generate a password
    rpass: chars => {
        const pool = '8u7zoicjgyaFrfb5VQG0OwNJTWAqknZItsER6S42pmxKL9CUlYHDdhB1M3veXP'
        let l = pool.length - 1,
            r = '',
            c = parseInt(chars)
        c = isNaN(c) || c > 40 || c < 0 ? 20 : c
        for (let i = 0; i < c; i++) r += pool[Math.floor(Math.random() * l) + 1]
        return r
    },

    // Require a module or false
    req: (module, test = true) => {
        if (!test) return false
        try {
            return require(module)
        } catch (e) {
            return false
        }
    },
}