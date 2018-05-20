import Web3Mock from './mocks/Web3Mock'

describe('checkWeb3', () => {
    beforeEach(() => {
        jest.resetModules()
    })
    
    it('imports without errors', async () => {
        expect(() => require('../src/checkWeb3').default).not.toThrow()
    })
    
    it('throws an error when web3 is undefined', async () => {
        const checkWeb3 = require('../src/checkWeb3').default
        
        const ERROR_MSG = `Can't find Web3 injected object!`
        
        await expect(checkWeb3()).rejects.toThrowError(ERROR_MSG)
        await expect(checkWeb3(null)).rejects.toThrowError(ERROR_MSG)
        await expect(checkWeb3(false)).rejects.toThrowError(ERROR_MSG)
    })
    
    it('throws an error when wrong network has been passed', async () => {
        const checkWeb3 = require('../src/checkWeb3').default
        const web3 = new Web3Mock({ network : 1 })
        
        await expect(checkWeb3(web3, 42)).rejects.toThrow(`Web3's selected network is not the same as given (42)!`)
    })
    
    it('throws an error when wrong account has been passed', async () => {
        const checkWeb3 = require('../src/checkWeb3').default
        const web3 = new Web3Mock({ accounts : [ '0x1' ] })
        
        await expect(checkWeb3(web3, null, '0x0')).rejects.toThrow(`Web3's selected account is not the same as given (0x0)!`)
    })
    
    it('executes without errors when network and account not passed', async () => {
        const checkWeb3 = require('../src/checkWeb3').default
        const web3 = new Web3Mock()
        
        await expect(checkWeb3(web3)).resolves.toBe(undefined)
    })
    
    it('executes without errors when right network and account has been passed', async () => {
        const checkWeb3 = require('../src/checkWeb3').default
        const web3 = new Web3Mock({
            network : 1,
            accounts: ['0x1']
        })
        
        await expect(checkWeb3(web3, 1, '0x1')).resolves.toBe(undefined)
    })
})
