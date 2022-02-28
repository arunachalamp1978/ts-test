import { getArnieQuotes } from './get-arnie-quotes';
import * as httpService from './mock-http-interface'

const urls = [
  'http://www.smokeballdev.com/arnie0',
  'http://www.smokeballdev.com/arnie1',
  'http://www.smokeballdev.com/arnie2',
  'http://www.smokeballdev.com/arnie3',
]

describe(__filename, () => {
  let spyHttpGet: jest.SpyInstance;

  beforeEach(() => {
    spyHttpGet = jest.spyOn(httpService, 'httpGet')
  })

  afterEach(jest.restoreAllMocks)

  describe('failure handling', () => {
    it('should throw exception when fail to make request', async () => {
      const rawError = new Error('Something went wrong')

      spyHttpGet.mockRejectedValue(rawError)
      await expect(getArnieQuotes(['http://www.smokeballdev.com/arnie0']))
        .rejects.toMatchObject(rawError)
    })

    it('should throw exception when not receiving response', async () => {
      spyHttpGet.mockResolvedValue(null as any)
      await expect(getArnieQuotes(['http://www.smokeballdev.com/arnie0']))
        .rejects.toMatchObject({
          message: 'Invalid response'
        })
    })

    it('should throw exception when receiving response with no body', async () => {
      spyHttpGet.mockResolvedValue({
        status: 200,
        body: null as any
      })
      await expect(getArnieQuotes(['http://www.smokeballdev.com/arnie0']))
        .rejects.toMatchObject({
          message: 'Invalid response'
        })
    })

    it('should throw exception when receiving response with no status', async () => {
      spyHttpGet.mockResolvedValue({
        body: ''
      } as any)
      await expect(getArnieQuotes(['http://www.smokeballdev.com/arnie0']))
        .rejects.toMatchObject({
          message: 'Invalid response'
        })
    })

    it('should throw exception when receiving response invalid body json', async () => {
      spyHttpGet.mockResolvedValue({
        status: 200,
        body: 'Arun is the best'
      })
      await expect(getArnieQuotes(['http://www.smokeballdev.com/arnie0']))
        .rejects.toMatchObject({
          message: expect.stringMatching(/Error when making request/)
        })
    })

    it('should throw exception when status is not supported', async () => {
      const rawResponse = {
        status: 404,
        body: JSON.stringify({ message: 'Arnie is the best' })
      }

      spyHttpGet.mockResolvedValue(rawResponse)
      await expect(getArnieQuotes(['http://www.smokeballdev.com/arnie0']))
        .rejects.toMatchObject({
          message: `Unknown error with status ${rawResponse.status} and body ${rawResponse.body}`
        })
    })
  })

  it('should return valid response', async () => {
    await expect(getArnieQuotes(urls)).resolves.toEqual([
      {
        'Arnie Quote': 'Get to the chopper'
      },
      {
        'Arnie Quote': 'MY NAME IS NOT QUAID'
      },
      {
        'Arnie Quote': `What's wrong with Wolfie?`,
      },
      {
        FAILURE: 'Your request has been terminated',
      }
    ])
    expect(spyHttpGet).toHaveBeenCalledTimes(4)
  })

  it('code to be executed in less than 400ms', async () => {
    expect.assertions(2);

    const startTime = process.hrtime();
    await getArnieQuotes(urls);
    const [seconds, nanos] = process.hrtime(startTime);

    expect(seconds).toBe(0);
    expect(nanos / 1000 / 1000).toBeLessThan(400);
  });

const urls = [
  'http://www.smokeballdev.com/arnie0',
  'http://www.smokeballdev.com/arnie1',
  'http://www.smokeballdev.com/arnie2',
  'http://www.smokeballdev.com/arnie3',
];

test('expect no throws', () => {
  expect.assertions(1);
  expect(async () => await getArnieQuotes(urls)).not.toThrow(); 
});

test('responses to be correct', async () => {
  expect.assertions(5);

  const results = await getArnieQuotes(urls);
  
  expect(results.length).toBe(4);

  expect(results[0]).toEqual({ 'Arnie Quote': 'Get to the chopper' });
  expect(results[1]).toEqual({ 'Arnie Quote': 'MY NAME IS NOT QUAID' });
  expect(results[2]).toEqual({ 'Arnie Quote': `What's wrong with Wolfie?` });
  expect(results[3]).toEqual({ 'FAILURE': 'Your request has been terminated' });
});


})



