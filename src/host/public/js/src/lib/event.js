/**
 * Event register
 * 
 */

const _Event = function () {

    let events = {},
        count = 0


    /**
     * insere uma ação para um determinado evento
     * 
     * @param {string} event  Nome do evento
     * @param {string} id Nome da ação
     * @param {function} action Ação a ser executada quando o Evento for disparado
     * 
     * @return {boolean}
     */
    const subscribe = (event, id, action) => {
        if (!events[event]) events[event] = {}
        if (!events[event][id]) {
            events[event][id] = action
            return true
        }
        return false
    }

    /**
     * Apaga um determinado evento indicado pelo seu id
     * 
     * @param {string} event 
     * @param {string} id 
     * 
     * @return {boolean}
     */
    const unsubscribe = (event, id) => {
        if (!events[event]) return false
        return delete (events[event][id])
    }

    /**
     * Executa TODAS as ações registradas para um "event" e "id" 
     * 
     * @param {string} event Nome do evento
     * @param {object|string|number|boolean} data dados passados como argumento (opcional) 
     * 
     * @return {boolean} 
     */
    const trigger = (event, data) => {
        if (!events[event]) return false
        for (var i in events[event]) {
            events[event][i](data)
        }
        return true
    }

    /**
     * Retorna os eventos registrados (debug)
     * 
     * @param {string} e 
     */
    const getEvent = e => !e ? events : events[e]

    /**
     * Apaga um evento ou limpa o registro de eventos
     * 
     * @param {string|void} e 
     */
    const clear = e => {
        e = e || false
        if (!e) {
            events = []
            return watchdogStart()
        }
        if (undefined != typeof events[e]) events[e] = null
    }

    /**
     * Reseta o contador (não reseta o watchdog)
     * @param {number} c 
     */
    const reset = c => {
        c = parseInt(c) || 0
        count = c < 0 ? 0 : c
    }

    /**
     * Inicia o watchdog timer como um Evento
     * @param {} e 
     * @returns 
     */
    const watchdogStart = () => setInterval(() => trigger('watchdog', count++), 100)

    /**
  * Iniciador do objeto
  */
    const init = () => {
        clear()
        watchdogStart()
    }

    init()
    return {
        subscribe,
        unsubscribe,
        trigger,
        reset,
        clear,
        getEvent
    }
}