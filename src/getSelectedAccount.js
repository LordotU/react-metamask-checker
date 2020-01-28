export class SelectedAccountError extends Error {
  constructor (message) {
    super(message)
  }
}

const selectedAccountsError = new SelectedAccountError(`Can't get accounts, cause Metamask connection problem!`)

export default async ethereum => {
  try {
    let accounts = (await ethereum.send('eth_accounts')).result

    if (accounts.length === 0) {
      accounts = (await ethereum.send('eth_requestAccounts')).result

      if (accounts.length === 0) {
        throw selectedAccountsError
      }
    }

    return accounts[0]
  } catch (error) {
    if (! (error instanceof SelectedAccountError)) {
      console.error(error)
    }

    throw selectedAccountsError
  }
}
