# React Metamask Checker

[![License](https://img.shields.io/badge/License-MIT-000000.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/LordotU/react-metamask-checker.svg?branch=master)](https://travis-ci.org/LordotU/react-metamask-checker)
[![Coverage Status](https://coveralls.io/repos/github/LordotU/react-metamask-checker/badge.svg)](https://coveralls.io/github/LordotU/react-metamask-checker)

## Description

React component which uses [Render Props](https://reactjs.org/docs/render-props.html) approach for checking Web3 instance object injected by [Metamask](https://metamask.io/) extension.

***Note:*** Web3 API version prior to 1.0 is using for checking.

## Installation

```bash
yarn add react-metamask-checker
```

## Testing

```bash
yarn test:jest # Runs Jest with coverage collection
yarn test:coverage # Sends coverage to .coveralls.io
yarn test # yarn test:jest && yarn test:coverage
```

## Usage

```javascript
// ./containers/App.js

import React, { Component } from 'react'
import MetamaskChecker from 'react-metamask-checker'

import Loader from './components/Loader'
import Err from './components/Error'
import Content from './components/Content'

class App extends Component {

  async initialize (provider, account, network) {
    console.log(provider, account, network)
  }

  render () {

    const props = {
      /* Ethereum network_id (numeric) which should be selected in Metamask */
      // network : null,

      /* Ethereum account (address) which should be selected in Metamask */
      // account : null,

      /* Function which executes on checking error */
      // onCheckError   : async (error) => null,

      /* Function which executes on checking success */
      onCheckSuccess : async (provider, account, network) => await this.initialize(provider, account, network),

      renderDefault : () => <Loader />,

      renderErrored : error => <Err message={error.message || 'Unexpected error'} />,

      renderChecked : (provider, account, network) => <Content />
    }

    return <MetamaskChecker {...props} />
  }
}
```
