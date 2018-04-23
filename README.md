# React Metamask Checker

[![License](https://img.shields.io/badge/License-MIT-000000.svg)](https://opensource.org/licenses/MIT)

## Description

React component which uses [Render Props](https://reactjs.org/docs/render-props.html) approach for checking Web3 instance object injected by [Metamask](https://metamask.io/) extension.

***Note:*** Web3 API version prior to 1.0 is using for checking.

## Installation

```bash
yarn install react-metamask-checker
```

[//]: # ("## Test")
[//]: # ("")
[//]: # ("```bash")
[//]: # ("# Coming soon...")
[//]: # ("```")

## Usage

```javascript
// ./containers/App.js

import React, { Component } from 'react'
import MetamaskChecker from 'react-metamask-checker'

import Loader from './components/Loader'
import Err from './components/Error'
import Content from './components/Content'

class App extends Component {

  async initialize (provider, account) {
    console.log(provider, account)
  }

  render () {

    const props = {
      /* Ethereum account (address) which should be selected in Metamask */
      // account : null,
      /* Ethereum network_id (numeric) which should be selected in Metamask */
      // network : null,

      /* Checking timeout (ms) in case of checking error */
      // checkTimeout : 300,

      /* Function which executes on checking error */
      // onCheckError   : async (error) => null,

      /* Function which executes on checking success */
      onCheckSuccess : async (provider, account) => await this.initialize(provider, account),

      renderDefault : () => <Loader />,

      renderErrored : error => <Err message={error.message || 'Unexpected error'} />,

      renderChecked : (provider, account) => <Content />
    }

    return <MetamaskChecker {...props} />
  }
}
```
