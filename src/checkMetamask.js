import getSelectedAccount, { SelectedAccountError } from './getSelectedAccount'
import getSelectedNetwork, { SelectedNetworkError } from './getSelectedNetwork'


export class MetamaskNotFoundError extends Error {
  constructor (message) {
    super(message)
  }
}

export default async (ethereum, network = null, account = null) => {

  if (typeof ethereum !== 'object' || ethereum === null || ! ethereum.isMetaMask) {

    throw new MetamaskNotFoundError(`Can't find ethereum provider object!`)

  }

  const selectedNetwork = await getSelectedNetwork(ethereum)
  const selectedAccount = await getSelectedAccount(ethereum)

  if (
    ! [undefined, null, false].includes(network) &&
    selectedNetwork !== network
  ) {

      throw new SelectedNetworkError(`Metamask's selected network is not the same as given (${network})!`)

  } else if (
    ! [undefined, null, false].includes(account) &&
    selectedAccount !== account
  ) {

      throw new SelectedAccountError(`Metamask's selected account is not the same as given (${account})!`)

  }

  return {
    selectedNetwork,
    selectedAccount,
  }
}
