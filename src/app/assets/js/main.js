

window.onload = () => {



    const { ipcRenderer: ipc } = require('electron')


    ipc.on('cpu', (e, data) => {
        i = JSON.parse(data)
        _('#status-cpu').innerHTML = `CPU ${i.cpu}%`
        _('#status-mem').innerHTML = `Mem ${i.mem}% - ${i.tmem}GB`
    })
}