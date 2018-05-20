import Loader from './mocks/components/Loader'
import Err from './mocks/components/Err'
import App from './mocks/components/App'

import Web3Mock from './mocks/Web3Mock'

import MetamaskChecker from '../src/MetamaskChecker'

const flushPromises = () => new Promise(resolve => setImmediate(resolve))

describe('MetamaskChecker', () => {
    let wrapper
    const checkerProps = {
        renderDefault : () => <Loader />,
        renderErrored : error => <Err error={ error.message || error } />,
        renderChecked : (provider, account) => <App />
    }

    const NETWORK = 1
    const ACCOUNT = '0x1111111111111111111111111111111111111111'

    beforeEach(async () => {
        window.web3 = new Web3Mock({
            network  : NETWORK,
            accounts : [ACCOUNT]
        })

        wrapper = mount( <MetamaskChecker { ...checkerProps } /> )
    })
    afterEach(() => {
        wrapper.unmount()
    })

    it('renders Loader when nothing happens', async () => {
        expect(wrapper.html()).toEqual(`<div id="loader">Loader</div>`)
    })

    it('renders Err when something wrong with Web3', async () => {
        await flushPromises()
        window.web3 = null
        window.dispatchEvent(new Event('load'))
        await flushPromises()

        expect(wrapper.html()).toEqual(`<div id="err">Can't find Web3 injected object!</div>`)
    })

    it('renders Err when something wrong with given network', async () => {
        await flushPromises()
        wrapper.setProps({ network : 0 })
        window.dispatchEvent(new Event('load'))
        await flushPromises()

        expect(wrapper.html()).toEqual(`<div id="err">Web3's selected network is not the same as given (0)!</div>`)
    })

    it('renders Err when something wrong with given account', async () => {
        await flushPromises()
        wrapper.setProps({ account : '0x0000000000000000000000000000000000000000' })
        window.dispatchEvent(new Event('load'))
        await flushPromises()

        expect(wrapper.html()).toEqual(`<div id="err">Web3's selected account is not the same as given (0x0000000000000000000000000000000000000000)!</div>`)
    })

    it('renders App when all ok with Web3', async () => {
        await flushPromises()
        window.dispatchEvent(new Event('load'))
        await flushPromises()

        expect(wrapper.html()).toEqual(`<div id="app">App</div>`)
    })

    it('renders App when all ok with Web3, given network and account', async () => {
        await flushPromises()
        wrapper.setProps({ network : NETWORK, account : ACCOUNT })
        window.dispatchEvent(new Event('load'))
        await flushPromises()

        expect(wrapper.html()).toEqual(`<div id="app">App</div>`)
    })
})
