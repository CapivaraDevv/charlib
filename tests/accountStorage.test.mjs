import { beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { accountStorage, setStorageAccount, readAccountCache } from '../src/services/accountStorage.ts';

beforeEach(() => {
  const values = new Map();
  globalThis.localStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  };
  setStorageAccount(null);
});
test('accounts cannot read each other or implicitly inherit the legacy library', () => {
  accountStorage.setItem('last-book', '10');
  setStorageAccount('alice');
  assert.equal(accountStorage.getItem('last-book'), null);
  accountStorage.setItem('last-book', '20');
  setStorageAccount('bob');
  assert.equal(accountStorage.getItem('last-book'), null);
  setStorageAccount('alice');
  assert.equal(accountStorage.getItem('last-book'), '20');
  setStorageAccount(null);
  assert.equal(accountStorage.getItem('last-book'), '10');
});
test('pending writes survive switching away and returning to an account', () => {
  setStorageAccount('alice');
  accountStorage.setItem('book-progress-20', '3');
  setStorageAccount(null);
  setStorageAccount('alice');
  assert.deepEqual(readAccountCache('alice')['book-progress-20'], { value: '3', pending: true, revision: 0 });
});
test('deletions are queued as tombstones without deleting another account data', () => {
  setStorageAccount('alice');
  accountStorage.setItem('last-book', '20');
  accountStorage.removeItem('last-book');
  assert.equal(accountStorage.getItem('last-book'), null);
  assert.equal(readAccountCache('alice')['last-book'].pending, true);
});
