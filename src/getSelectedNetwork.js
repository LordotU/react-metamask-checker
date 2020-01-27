export class SelectedNetworkError extends Error {
  constructor (message) {
    super(message)
  }
}

const selectedNetworkError = new SelectedNetworkError(`Can't get network, cause Metamask connection problem!`)

export default async ethereum => {
  try {
    const network = parseInt((await ethereum.send('eth_chainId')).result)

    return network
  } catch (error) {
    console.log(error)

    return selectedNetworkError
  }
}
