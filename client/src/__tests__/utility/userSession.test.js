global.crypto = {
    randomUUID: () => 'mock-id-1234',
  };
import { getUserId } from "../../utils/userSession";

describe('getUserId', () => {

    beforeEach(() =>{
        localStorage.clear()
    });

    test('Retrieve userId from localStorage', () => {
        localStorage.setItem('tempUserId', '123abc');
        expect(getUserId()).toBe('123abc');
    });

    test('Return "fallback-id" if UserId is not found', () => {
        expect(getUserId()).toBe('fallback-id');
    });

})