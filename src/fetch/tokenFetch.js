// @flow


import throat from 'throat';
import _ from 'lodash';

import type { Models } from 'flowTypes';

import config from 'config';
import { allSettled } from 'lib/promise';
import fetchTokens from 'lib/services/tokens';
import createLog from 'lib/gitter';

const log = createLog('fetch');
const hr = '---------------------------------------------------';

function parseResults (results: []) {
  const flattenedResults = results.reduce((acc, result) => acc.concat(result.value), []);
  const errors = flattenedResults.filter(({ state }) => state === 'rejected');
  const successes = flattenedResults.filter(({ state }) => state === 'fulfilled');

  return {
    errors,
    successes,
  };
}

function humanifyError (error = {}): string {
  try {
    return error.status
      ? (`
[${error.status} ${error.statusText}] - ${_.get(error, 'data.text')}
[${_.get(error, 'config.method')}] ${_.get(error, 'config.url')}
${_.get(error, 'config.headers.Authorization')}
`)
    : JSON.stringify(error);
  } catch (e) {
    console.log(JSON.stringify(e));
    return 'Something bad happened';
  }
}

async function logResults (startTime: Date, { errors = [], successes = [] }) {
  const endTime = new Date();

  await log(`
${hr}
FINISHED @ ${new Date().toString()}
${hr}
  `);

  await log(`
${hr}
LOGGED ERRORS
${hr}`);

  if (errors.length) {
    await Promise.all(errors.map((error) => log(humanifyError(error.value))));
  } else {
    await log('No errors!');
  }

  await log(`
${hr}
FETCH SUMMARY
${hr}
${errors.length} errors
${successes.length} success
Duration: ${(endTime - startTime) / 1000 / 60}mins
${hr}
  `);
}

type Token = {
  token: string,
  permissions: Array<string>,
};

type Fetcher = (models: Models, token: Token) => Promise<>;

export default function fetchFactory (models: Models, fetchers: Array<Fetcher>) {
  if (!fetchers || !fetchers.length) {
    throw new Error('\n=== No fetchers available! ===\n');
  }

  async function fetch (token: Token) {
    return await allSettled(fetchers.map((fetcher) => fetcher(models, token)));
  }

  async function batchFetch () {
    const startTime = new Date();

    log(`
${hr}
STARTING @ ${startTime.toString()}!
${hr}
`);

    const tokens = await fetchTokens(models);
    const results = await allSettled(tokens.map(throat(config.fetch.concurrentCalls, fetch)));

    const parsedResults = parseResults(results);

    logResults(startTime, parsedResults);

    return parsedResults;
  }

  return {
    batchFetch,
    fetch,
  };
}
