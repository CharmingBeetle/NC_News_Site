const {
  convertTimestampToDate
} = require("../db/seeds/utils");

const { createLookupObject } = require("../db/seeds/utils")

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});


describe('createLookupObject', () => {
    test('Returns an object when passed an array of multiple objects', () => {
        // Assign
        const input =
        [
            {
              park_id: 1,
              park_name: 'Park One',
              year_opened: 2000,
              annual_attendance: 180000
            },
            {
              park_id: 2,
              park_name: 'Park Two',
              year_opened: 2001,
              annual_attendance: 280000
            },
            {
              park_id: 3,
              park_name: 'Park Three',
              year_opened: 2010,
              annual_attendance: 380000
            },
            {
              park_id: 4,
              park_name: 'Park Four',
              year_opened: 1998,
              annual_attendance: 480000
            }
          ]
        
        const expected =   { 
          'Park One': 1, 
          'Park Two': 2, 
          'Park Three': 3, 
          'Park Four': 4 
        }
        // Act
        const actual =  createLookupObject(input)
        // Assert
        expect(actual).toEqual(expected)
    });
  })

