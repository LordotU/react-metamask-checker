import Loader from './__mocks__/components/Loader'
import Err from './__mocks__/components/Err'
import App from './__mocks__/components/App'

import MetamaskInpageProvider from './__mocks__/MetamaskInpageProvider'

import MetamaskChecker from '../src/MetamaskChecker'

const flushPromises = () => new Promise(resolve => setImmediate(resolve))

describe('MetamaskChecker', () => {
    let wrapper

    const renderProps = {
        renderDefault : () =>
            <Loader />,
        renderErrored : error =>
            <Err error={ error.message || 'Unexpected error' } />,
        renderChecked : (provider, account, network) =>
            <App account={account} network={network} />
    }

    const NETWORK = 0x01
    const ACCOUNT = '0x1111111111111111111111111111111111111111'

    beforeEach(async () => {
        window.ethereum = new MetamaskInpageProvider({
            network  : NETWORK,
            accounts : [ACCOUNT]
        })

        wrapper = shallow( <MetamaskChecker { ...renderProps } /> )
    })
    afterEach(() => {
        wrapper.unmount()
    })

    it('renders Loader when nothing happens', async () => {
        expect(wrapper.html()).toEqual('<div id="loader">Loader</div>')
    })

    it('renders Err when something wrong with MetamaskInpageProvider', async () => {
        window.ethereum = null
        await flushPromises()
        window.dispatchEvent(new Event('load'))
        await flushPromises()

        expect(wrapper.html()).toEqual(`<div id="err">Can&#x27;t find ethereum provider object!</div>`)
    })

    it('renders Err when something wrong with given network', async () => {
        await flushPromises()
        wrapper.setProps({ network : 0 })
        window.dispatchEvent(new Event('load'))
        await flushPromises()

        expect(wrapper.html()).toEqual(`<div id="err">Metamask&#x27;s selected network is not the same as given (0)!</div>`)
    })

    it('renders Err when something wrong with given account', async () => {
        await flushPromises()
        wrapper.setProps({ account : '0x0000000000000000000000000000000000000000' })
        window.dispatchEvent(new Event('load'))
        await flushPromises()

        expect(wrapper.html()).toEqual(`<div id="err">Metamask&#x27;s selected account is not the same as given (0x0000000000000000000000000000000000000000)!</div>`)
    })

    it('renders App when all ok with MetamaskInpageProvider', async () => {
        await flushPromises()
        window.dispatchEvent(new Event('load'))
        await flushPromises()

        expect(wrapper.html()).toEqual(`<div id="app">Selected account ${ACCOUNT} in selected network ${NETWORK}</div>`)
    })

    it('renders App when all ok with MetamaskInpageProvider, given network and account', async () => {
        await flushPromises()
        wrapper.setProps({ network : NETWORK, account : ACCOUNT })
        window.dispatchEvent(new Event('load'))
        await flushPromises()

        expect(wrapper.html()).toEqual(`<div id="app">Selected account ${ACCOUNT} in selected network ${NETWORK}</div>`)
    })
})
