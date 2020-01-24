import React, { Component } from 'react'
import PropTypes from 'prop-types'

import checkMetamask, { MetamaskNotFoundError } from './checkMetamask'


export default class MetamaskChecker extends Component {

  static defaultState = {
    selectedNetwork: undefined,
    selectedAccount: undefined,

    isChecked: false,

    isErrored: false,
    error: null
  }

  state = MetamaskChecker.defaultState

  static defaultProps = {
    network: null,
    account: null,

    onCheckError: async () => null,
    onCheckSuccess: async () => null,

    renderDefault: () => null,
    renderErrored: () => null,
    renderChecked: () => null,
  }

  static propTypes = {
    network: PropTypes.number,
    account: PropTypes.oneOfType([
      PropTypes.oneOf([undefined, null, false]),
      (props, propName, componentName) => {
        if (!/^(0x)?[0-9a-f]{40}$/i.test(props[propName])) {
          return new Error(
            `Invalid prop \`${propName}\` supplied to \`${componentName}\`.
          Validation failed for value ${props[propName]}.`
          )
        }
      }
    ]),

    onCheckError: PropTypes.func,
    onCheckSuccess: PropTypes.func,

    renderDefault: PropTypes.func,
    renderErrored: PropTypes.func,
    renderChecked: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.provider = null
    this.account = null
  }

  componentDidMount () {
    window.addEventListener('load', this.check)
  }

  componentWillUnmount () {
    this.removeProviderListeners()
    window.removeEventListener('load', this.check)
  }

  addProviderListeners = () => {
    (this.provider || { on: function () { return this }})
      .on('networkChanged', this.check)
      .on('accountsChanged', this.check)
  }

  removeProviderListeners = () => {
    (this.provider || { off: function () { return this }})
      .off('networkChanged', this.check)
      .off('accountsChanged', this.check)
  }

  check = async () => {
    let result = {}
    let resultError = null

    try {

      result = (await checkMetamask(
        window.ethereum,
        this.props.network,
        this.props.account,
      ))

    } catch (error) {

      console.error (error)

      resultError = error

    } finally {

      if (! (resultError instanceof MetamaskNotFoundError)) {
        this.provider = window.ethereum

        this.removeProviderListeners()
        this.addProviderListeners()
      }

      if (resultError) {
        await this.props.onCheckError(resultError)
      } else {
        await this.props.onCheckSuccess(
          this.provider,
          result.selectedAccount,
          result.selectedNetwork,
        )
      }

      this.setState(() => ({
        selectedAccount: result.selectedAccount,
        selectedNetwork: result.selectedNetwork,
        isChecked: !!! resultError,
        isErrored: !! resultError,
        error: resultError,
      }))

    }
  }

  render () {
    const {
      selectedAccount,
      selectedNetwork,
      isChecked,
      isErrored,
      error
    } = this.state

    let render = this.props.renderDefault()

    if (isErrored) {
      render = this.props.renderErrored(error)
    } else if (isChecked) {
      render = this.props.renderChecked(
        this.provider,
        selectedAccount,
        selectedNetwork,
      )
    }

    return render
  }
}
