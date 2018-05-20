class Web3Mock {
    constructor({
        network = null,
        accounts = [null]
    } = {}) {
        this._data = {
            network,
            accounts
        }
    }
    get version() {
        const _this = this
        return {
            getNetwork(cb) {
                cb(null, _this._data.network)
            }
        }
    }
    get eth() {
        const _this = this
        return {
            getAccounts(cb) {
                cb(null, _this._data.accounts)
            }
        }
    }
}

export default Web3Mock
