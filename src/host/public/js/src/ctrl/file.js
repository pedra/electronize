



const _File = function (config) {

    let path = '/'

    const show = () => {
        path = path.replace('//', '/')

        __get('file/list?path=' + path).then(l => {

            if (l.error) return __report(`Ocorreu um erro com a listagem de arquivos!<br>Error: [${l.error}]`)

            let i = '',
                c = 0

            l.map(f => {
                if (f.path) {
                    path = f.path
                    return false
                }

                let icon = 'description',
                    type = 'file',
                    ext = f.ext.replace('.', '')

                if (f.ext == "_dir_") {
                    icon = 'folder'
                    type = 'folder'
                } else {
                    let e = ['png', 'jpg', 'jpeg', 'gif']
                    if (e.indexOf(ext) != -1) {
                        icon = 'photo'
                        type = 'image'
                    }
                    e = ['mp4', 'mpeg', 'mov', 'avi', 'mkv']
                    if (e.indexOf(ext) != -1) {
                        icon = 'play_circle_filled'
                        type = 'video'
                    }
                }

                i += `<li class="file-item ${type}" data-id="234" 
                          onclick="App.File.click(${c}, '${type == 'folder' ? f.name : ''}')" 
                          oncontextmenu="return App.File.menu(${c})">
                        <i class="material-icons">${icon}</i>
                        <div class="file-info">
                            <div class="file-name">${f.name}</div>
                            <div class="file-data">${(type == 'folder' ? 'Diretorio' : __toByte(f.size)) + ' | ' + (new Date(f.date)).toLocaleString()}</div>
                        </div>
                    </li>`
                c++
            })

            let bc = path.replace('/', '').split('/')
            let b = '', d = ''
            bc.map(a => b += `<a onclick="return App.File.go('${d += '/' + a}')">${a}</a>/`)
            b = b.substring(0, b.lastIndexOf("/"))

            _('#file-breadcumbs').innerHTML = `${path == '/' ? '<i class="material-icons">home</i>' : '<i class="material-icons" onclick="App.File.back()">arrow_back</i><i class="material-icons" onclick="App.File.home()">home</i>'}<div class="file-path" id="file-path">${b}</div>`
            _('#file-list').innerHTML = i
        })
    }

    const click = (id, dir) => {
        if (dir !== '') {
            path = path + '/' + dir
            return show()
        }
        showMenu(id)
        console.log("Clicou em " + id)
    }

    const menu = (id, dir) => {
        console.log("ContextMenu para " + id + " | " + _a('.file-name')[id].innerHTML)
        showMenu(id)
        return false
    }

    const back = () => {
        if (path == '/') return false
        let t = path.split('/')
        t.pop()
        path = t.join('/') || '/'
        return show()
    }

    const home = () => {
        path = '/'
        return show()
    }

    const go = l => {
        path = l
        return show()
    }

    const showMenu = (id) => {
        _(config.html.menuTitle).innerHTML = _a(config.html.fileName)[id].innerHTML
        _(config.html.menu).classList.add('on')
    }

    const closeMenu = () => {
        _(config.html.menuTitle).innerHTML = ''
        _(config.html.menu).classList.remove('on')
    }

    const editMenu = () => console.log('Menu : edit')

    const downloadMenu = () => console.log('Menu : download')

    const deleteMenu = () => console.log('Menu : delete')

    return {
        show, click, menu, back, home, go,
        // Menu ---- 
        closeMenu, editMenu, downloadMenu, deleteMenu
    }

}