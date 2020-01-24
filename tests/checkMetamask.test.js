import Web3Mock from './__mocks__/MetamaskInpageProvider'

describe('checkMetamask', () => {
    beforeEach(() => {
        jest.resetModules()
    })

    it('imports without errors', async () => {
        expect(() => require('../src/checkMetamask').default).not.toThrow()
    })

    it('throws an error when web3 is undefined', async () => {
        const checkMetamask = require('../src/checkMetamask').default

        const ERROR_MSG = `Can't find Web3 injected object!`

        await expect(checkMetamask()).rejects.toThrowError(ERROR_MSG)
        await expect(checkMetamask(null)).rejects.toThrowError(ERROR_MSG)
        await expect(checkMetamask(false)).rejects.toThrowError(ERROR_MSG)
    })

    it('throws an error when wrong network has been passed', async () => {
        const checkMetamask = require('../src/checkMetamask').default
        const web3 = new Web3Mock({ network : 1 })

        await expect(checkMetamask(web3, 42)).rejects.toThrow(`Web3's selected network is not the same as given (42)!`)
    })

    it('throws an error when wrong account has been passed', async () => {
        const checkMetamask = require('../src/checkMetamask').default
        const web3 = new Web3Mock({ accounts : [ '0x1' ] })

        await expect(checkMetamask(web3, null, '0x0')).rejects.toThrow(`Web3's selected account is not the same as given (0x0)!`)
    })

    it('executes without errors when network and account not passed', async () => {
        const checkMetamask = require('../src/checkMetamask').default
        const web3 = new Web3Mock()

        await expect(checkMetamask(web3)).resolves.toBe(undefined)
    })

    it('executes without errors when right network and account has been passed', async () => {
        const checkMetamask = require('../src/checkMetamask').default
        const web3 = new Web3Mock({
            network : 1,
            accounts: ['0x1']
        })

        await expect(checkMetamask(web3, 1, '0x1')).resolves.toBe(undefined)
    })
})
