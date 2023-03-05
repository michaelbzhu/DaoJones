export type Delegate = {
  account: {
    address: string
  }
}

export type Governor = {
  id: string
  name: string
  delegates: Delegate[]
}
