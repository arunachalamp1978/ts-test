import { httpGet } from './mock-http-interface'

// TODO define this type properly
type TSuccess = {
  'Arnie Quote': string
}
type TFailure = {
  'FAILURE': string
}
type TResult = TSuccess | TFailure

type TResponseBody = {
  message: string
}

export const getArnieQuotes = async (urls: string[]): Promise<TResult[]> => {
  /**
   * @todo beaware of too many concurrent requests. Consider to use Bluebird or something similar
   */
  const data = await Promise.all(urls.map(url => makeRequest(url)))
  return data
}


const extractors: Record<number, (body: TResponseBody) => TResult> = {
  200: (body: TResponseBody): TSuccess => ({
    'Arnie Quote': body.message
  }),
  500: (body: TResponseBody): TFailure => ({
    'FAILURE': body.message
  })
}

const parseResponseBody = (input: string): TResponseBody => {
  let body: TResponseBody
  try {
    body = JSON.parse(input) as TResponseBody
  }
  catch (err: any) {
    throw new Error(`Error when making request ${JSON.stringify(err)}`)
  }
  return body
}

const makeRequest = async (url: string): Promise<TResult> => {
  const res = await httpGet(url)
  if (!(res && res.body && res.status)) {
    throw new Error('Invalid response')
  }

  const body = parseResponseBody(res.body)

  if (extractors[res.status]) {
    return extractors[res.status](body)
  }
  throw new Error(`Unknown error with status ${res.status} and body ${res.body}`)
}
