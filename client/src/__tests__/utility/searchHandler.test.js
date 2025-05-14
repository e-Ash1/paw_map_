// 1. Import the Utility Function that's up for testing:
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { formatSearchType, sanitizeString } from '../../utils/searchHandler';
import { fetchRecentSearches } from '../../utils/searchHandler';
import { getUserId } from "../../utils/userSession";

// 2. Set a describe function that defines which utility is being tested:
describe('formatSearchType', () => {
    // 2a. Define the functionality of the utility:
    it('Formats the underscore of strings correctly', () => {
        // 2b. Characterize the expectant results of the utility test:
        expect(formatSearchType('Veterinary_care')).toBe('Veterinary Care')
    });

    it('Capitalizes each word in the string', () => {
        expect(formatSearchType('dog_park')).toBe('Dog Park')
    });

    it("Returns 'Unknown Type' if an empty string is passed", () => {
        expect(formatSearchType('')).toBe('Unknown Type')
    });

    it("Returns 'Unknown Type' if a null string is passed", () => {
        expect(formatSearchType(null)).toBe('Unknown Type')
    });

});

describe('sanitizeString', () => {

    it('Removes extra white space from a string', () => {
        expect(sanitizeString('     hello     ')).toBe('hello')
    });

    it('Returns on the fallback value if falsey', () => {
        expect(sanitizeString(null, 'N/A')).toBe('N/A')
    });

    it('Returns on the fallback value if an empty str', () => {
        expect(sanitizeString('', 'N/A')).toBe('N/A')
    });

    it('Preserves correctly sanitized strs', () => {
        expect(sanitizeString('Hello World!')).toBe('Hello World!')
    });

});

// Mock API test for getUserId() to return a fake ID
jest.mock("../../utils/userSession", () => ({
    getUserId: jest.fn(() => "fake-user-id"),
  }));
  
  describe("fetchRecentSearches", () => {
    let mock;
  
    beforeEach(() => {
      mock = new MockAdapter(axios);
    });
  
    afterEach(() => {
      mock.restore();
    });
  
    it("Returns the most recent search data when API call is successful", async () => {
      const mockData = [
        { id: 1, searchType: "pet_store", location: { string: { from: "NYC", to: "Brooklyn" } } },
      ];
  
      mock.onGet("/api/queries/recent", { params: { userId: "fake-user-id" } }).reply(200, mockData);
  
      const result = await fetchRecentSearches();
      expect(result).toEqual(mockData);
    });
  
    it("Returns an empty array if API call fails", async () => {
      mock.onGet("/api/queries/recent").networkError();
  
      const result = await fetchRecentSearches();
      expect(result).toEqual([]);
    });
  });

