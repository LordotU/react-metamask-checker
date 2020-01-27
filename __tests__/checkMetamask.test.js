import MetamaskInpageProvider from './__mocks__/MetamaskInpageProvider'


const metamaskInpageProviderOpts = {
  network : '0x01',
  accounts : ['0x1'],
}

describe('checkMetamask', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('imports without errors', async () => {
    expect(() => require('../src/checkMetamask').default).not.toThrow()
  })

  it('throws an error when inpageProvider is undefined', async () => {
    const checkMetamask = require('../src/checkMetamask').default

    const ERROR_MSG = `Can't find ethereum provider object!`

    await expect(checkMetamask()).rejects.toThrowError(ERROR_MSG)
    await expect(checkMetamask(null)).rejects.toThrowError(ERROR_MSG)
    await expect(checkMetamask(false)).rejects.toThrowError(ERROR_MSG)
    await expect(checkMetamask({ isMetaMask: false })).rejects.toThrowError(ERROR_MSG)
  })

  it('throws an error when wrong network has been passed', async () => {
    const checkMetamask = require('../src/checkMetamask').default
    const inpageProvider = new MetamaskInpageProvider(metamaskInpageProviderOpts)

    await expect(checkMetamask(inpageProvider, 42)).rejects.toThrow(`Metamask's selected network is not the same as given (42)!`)
  })

  it('throws an error when wrong account has been passed', async () => {
    const checkMetamask = require('../src/checkMetamask').default
    const inpageProvider = new MetamaskInpageProvider(metamaskInpageProviderOpts)

    await expect(checkMetamask(inpageProvider, null, '0x0')).rejects.toThrow(`Metamask's selected account is not the same as given (0x0)!`)
  })

  it('executes without errors when network and account not passed', async () => {
    const checkMetamask = require('../src/checkMetamask').default
    const inpageProvider = new MetamaskInpageProvider(metamaskInpageProviderOpts)

    await expect(checkMetamask(inpageProvider)).resolves.toStrictEqual({
      'selectedNetwork': 1,
      'selectedAccount': '0x1',
    })
  })

  it('executes without errors when right network and account has been passed', async () => {
    const checkMetamask = require('../src/checkMetamask').default
    const inpageProvider = new MetamaskInpageProvider(metamaskInpageProviderOpts)

    await expect(checkMetamask(inpageProvider, 1, '0x1')).resolves.toStrictEqual({
      'selectedNetwork': 1,
      'selectedAccount': '0x1',
    })
  })
})