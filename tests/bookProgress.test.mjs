import { beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { getCurrentPage } from '../src/utils/bookProgress.ts';

const book = { id: 1, status: 'reading', pages: 100, currentPage: 12 };
let stored;
beforeEach(() => {
  stored = null;
  globalThis.localStorage = { getItem: () => stored };
});

test('completed books show the last page even with old progress', () => {
  stored = '1';
  assert.equal(getCurrentPage({ ...book, status: 'completed' }), 100);
});
test('uses persisted book progress before the first reading session', () => {
  assert.equal(getCurrentPage(book), 12);
});
test('keeps zero as valid progress rather than falling back to the old page', () => {
  stored = '0';
  assert.equal(getCurrentPage(book), 0);
});
test('clamps cached progress after reducing the page count', () => {
  stored = '90';
  assert.equal(getCurrentPage({ ...book, pages: 20 }), 20);
});
test('invalid or negative cached progress does not escape the book bounds', () => {
  stored = 'invalid';
  assert.equal(getCurrentPage(book), 12);
  stored = '-4';
  assert.equal(getCurrentPage(book), 0);
});
test('falls back to the book if browser storage is unavailable', () => {
  globalThis.localStorage.getItem = () => { throw new Error('Storage unavailable'); };
  assert.equal(getCurrentPage(book), 12);
});
