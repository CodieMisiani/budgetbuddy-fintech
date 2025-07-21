import { categorize } from "../utils/categorizer.js";

describe('categorize', () => {
  it('detects groceries', () => {
    expect(categorize('Spent Ksh 1000 at Naivas')).toBe('Groceries');
  });
  it('detects transport', () => {
    expect(categorize('Uber ride')).toBe('Transport');
  });
  it('detects mobile money', () => {
    expect(categorize('Sent via MPESA')).toBe('Mobile Money');
  });
  it('defaults to Other', () => {
    expect(categorize('Random text')).toBe('Other');
  });
});
