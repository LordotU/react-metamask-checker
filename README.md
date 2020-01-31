# React Metamask Checker

[![License](https://img.shields.io/badge/License-MIT-000000.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/LordotU/react-metamask-checker.svg?branch=master)](https://travis-ci.org/LordotU/react-metamask-checker)
[![Coverage Status](https://coveralls.io/repos/github/LordotU/react-metamask-checker/badge.svg)](https://coveralls.io/github/LordotU/react-metamask-checker)

## [Live demo](https://react-metamask-checker-demo-with-parcel.lordotu.now.sh)

## Description

React component which uses [Render Props](https://reactjs.org/docs/render-props.html) approach for checking [Metamask](https://metamask.io/) inpage provider object.

**Note**: since v2.0.0 only new version of Metamask API is supported. Related links:
  * https://medium.com/metamask/breaking-changes-to-the-metamask-inpage-provider-b4dde069dd0a
  * https://metamask.github.io/metamask-docs/API_Reference/Ethereum_Provider#new-api

## Installation

```bash
yarn add @metamask-checker/react

# or

npm install --save @metamask-checker/react
```

## Testing

```bash
yarn test:jest # Runs Jest with coverage collection
yarn test:coverage # Sends coverage to .coveralls.io
yarn test # yarn test:jest && yarn test:coverage

# or

npm run test:jest
npm run test:coverage
npm test
```

## Usage

```javascript
// ./containers/App.js

import React, { Component } from 'react'
import MetamaskChecker from '@metamask-checker/react'

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
