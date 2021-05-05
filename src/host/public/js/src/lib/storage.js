const _Storage = function () {

    data = { user: { id: 0, name: '' } }

    init = async () => {
        var c = await __get('/_config_')
        if (c && c.user) data = c
        return save()
    }

    get = param => data[param] || false

    set = async (param, value) => {
        data[param] = value
        await __post('/_config_', data)
        return data
    }

    // Private save data
    save = async () => {
        var s = await __post('/_config_', data)
        return !s ? {} : data
    }

    return {
        init, get, set
    }
}