import { hasSignedCLA } from './check.ts';
import signers from './signers.json' with { type: 'json' };
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

describe('hasSignedCLA', () => {
  test('knows a signer, whatever the case', () => {
    assert.equal(hasSignedCLA('cb1kenobi'), true);
    assert.equal(hasSignedCLA('Hansemannn'), true);
    assert.equal(hasSignedCLA(' m1ga '), true);
  });

  test('does not know anybody else', () => {
    assert.equal(hasSignedCLA('octocat'), false);
    assert.equal(hasSignedCLA(''), false);
    assert.equal(hasSignedCLA('constructor'), false);
  });
});

describe('signers.json', () => {
  // A capital letter or a duplicate would never match, because lookups are
  // lowercased, and the miss would only show up as a failed check on somebody's
  // pull request.
  test('is lowercase, unique and sorted', () => {
    for (const name of signers) assert.equal(name, name.trim().toLowerCase(), name);
    assert.equal(new Set(signers).size, signers.length);
    assert.deepEqual([...signers].sort(), signers);
  });

  // Names only. The records behind them carry email addresses, and this
  // repository is public.
  test('holds usernames and nothing else', () => {
    for (const name of signers) assert.match(name, /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/, name);
  });
});
