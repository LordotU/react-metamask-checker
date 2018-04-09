import React, { Component } from 'react'
import PropTypes from 'prop-types'

import getSelectedNetwork from './getSelectedNetwork'
import getSelectedAccount from './getSelectedAccount'


export default class MetamaskChecker extends Component {
  
  state = {
    isChecked : false,
    isErrored : false,
    error     : null
  }
  
  static defaultProps = {
    network : null,
    account : null,
    
    onCheckError   : async () => null,
    onCheckSuccess : async () => null,
    
    renderDefault : () => null,
    renderErrored : () => null,
    renderChecked : () => null,
    
    checkTimeout : 300
  }
  
  static propTypes = {
    network : PropTypes.number,
    account : (props, propName, componentName) => {
      if ( ! /^(0x)?[0-9a-f]{40}$/i.test(props[propName])) {
        return new Error(
          `Invalid prop \`${propName}\` supplied to \`${componentName}\`.
          Validation failed for value ${props[propName]}.`
        )
      }
    },
    
    onCheckError   : PropTypes.func,
    onCheckSuccess : PropTypes.func,
    
    renderDefault : PropTypes.func,
    renderErrored : PropTypes.func,
    renderChecked : PropTypes.func,
    
    checkTimeout : PropTypes.number
  }
  
  constructor (props) {
    super(props)
    
    this.provider = null
    this.account  = null
  }
  
  componentDidMount () {
    window.addEventListener('load', () => this.checkMetamask(window.web3))
  }
  
  async checkMetamask (web3) {
    
    let error = null
    
    if (typeof web3 === 'undefined' || ! web3) {
      
      error = new Error(`Can't find Metamask's web3 injected object!`)
    
    } else if (
      this.props.network &&
      parseInt(await getSelectedNetwork(web3)) !== this.props.network
    ) {
      
      error = new Error(`Metamask's selected network is not the same as given (${this.props.network})!`)
    
    } else if (
      this.props.account &&
      await getSelectedAccount(web3) !== this.props.account
    ) {
      
      error = new Error(`Metamask\'s selected account is not the same as given (${this.props.account})!`)
    
    }
    
    if (error) {
      console.error(error)
      
      await this.props.onCheckError(error)
      
      this.setState({
        isErrored : true,
        error
      })
      
      setTimeout(() => this.checkMetamask(web3), this.props.checkTimeout)
      
      return
    }
    
    this.provider = web3.currentProvider
    this.account  = await getSelectedAccount(web3)
    
    await this.props.onCheckSuccess(this.provider, this.account)
    
    this.setState({
      isChecked  : true,
      isErrored : false,
      error     : null
    })
  }
  
  render () {
    
    let render = this.props.renderDefault()
    
    if (this.state.isErrored) {
      render = this.props.renderErrored(this.state.error)
    } else if (this.state.isChecked) {
      render = this.props.renderChecked(this.provider, this.account)
    }
    
    return render
  }
}
