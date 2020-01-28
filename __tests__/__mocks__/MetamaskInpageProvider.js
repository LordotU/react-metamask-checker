export default class MetamaskInpageProvider {
  constructor ({
    isMetaMask = true,
    network = null,
    accounts = [],
  } = {}) {
    this.isMetaMask = isMetaMask

    this._data = {
      network,
      accounts,
    }
  }

  async send (method = '') {
    switch (method) {
      case 'eth_accounts':
      case 'eth_requestAccounts':
        return { result: this._data.accounts }

      case 'eth_chainId':
        return { result: this._data.network }

      default:
        return { result: null }
    }
  }

  on () {
    return this
  }

  off () {
    return this
  }
}
