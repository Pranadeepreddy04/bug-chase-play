export interface CodingChallenge {
  id: number;
  title: string;
  description: string;
  initialCode: string;
  initialTests: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const codingChallenges: CodingChallenge[] = [
  {
    id: 1,
    title: "Basic Math Operations",
    description: "Implement basic arithmetic functions",
    difficulty: "easy",
    initialCode: `function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}

function isEven(num) {
  return num % 2 === 0;
}

return { add, multiply, divide, isEven };`,
    initialTests: `function testAddition() {
  assertEqual(add(2, 3), 5, "2 + 3 should equal 5");
  assertEqual(add(-1, 1), 0, "(-1) + 1 should equal 0");
}

function testMultiplication() {
  assertEqual(multiply(3, 4), 12, "3 × 4 should equal 12");
  assertEqual(multiply(-2, 5), -10, "(-2) × 5 should equal -10");
}`
  },
  {
    id: 2,
    title: "Palindrome Checker",
    description: "Check if a string is a palindrome",
    difficulty: "easy",
    initialCode: `function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

return { isPalindrome };`,
    initialTests: `function testPalindrome() {
  assertTrue(isPalindrome("racecar"), "racecar is a palindrome");
  assertTrue(isPalindrome("A man a plan a canal Panama"), "Should ignore case and spaces");
  assertFalse(isPalindrome("hello"), "hello is not a palindrome");
}`
  },
  {
    id: 3,
    title: "Array Sum",
    description: "Calculate sum of array elements",
    difficulty: "easy",
    initialCode: `function arraySum(arr) {
  return arr.reduce((sum, num) => sum + num, 0);
}

function arrayAverage(arr) {
  if (arr.length === 0) return 0;
  return arraySum(arr) / arr.length;
}

return { arraySum, arrayAverage };`,
    initialTests: `function testArraySum() {
  assertEqual(arraySum([1, 2, 3, 4]), 10, "Sum of [1,2,3,4] should be 10");
  assertEqual(arraySum([]), 0, "Sum of empty array should be 0");
}

function testArrayAverage() {
  assertEqual(arrayAverage([2, 4, 6]), 4, "Average of [2,4,6] should be 4");
}`
  },
  {
    id: 4,
    title: "Fibonacci Sequence",
    description: "Generate Fibonacci numbers",
    difficulty: "medium",
    initialCode: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

function fibonacciSequence(count) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(fibonacci(i));
  }
  return result;
}

return { fibonacci, fibonacciSequence };`,
    initialTests: `function testFibonacci() {
  assertEqual(fibonacci(0), 0, "fib(0) should be 0");
  assertEqual(fibonacci(1), 1, "fib(1) should be 1");
  assertEqual(fibonacci(5), 5, "fib(5) should be 5");
}`
  },
  {
    id: 5,
    title: "String Reversal",
    description: "Reverse a string",
    difficulty: "easy",
    initialCode: `function reverseString(str) {
  return str.split('').reverse().join('');
}

function reverseWords(str) {
  return str.split(' ').reverse().join(' ');
}

return { reverseString, reverseWords };`,
    initialTests: `function testReverseString() {
  assertEqual(reverseString("hello"), "olleh", "Should reverse hello");
  assertEqual(reverseString(""), "", "Should handle empty string");
}

function testReverseWords() {
  assertEqual(reverseWords("hello world"), "world hello", "Should reverse words");
}`
  },
  {
    id: 6,
    title: "Prime Number Checker",
    description: "Check if a number is prime",
    difficulty: "medium",
    initialCode: `function isPrime(num) {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
}

return { isPrime };`,
    initialTests: `function testPrime() {
  assertTrue(isPrime(2), "2 is prime");
  assertTrue(isPrime(7), "7 is prime");
  assertFalse(isPrime(4), "4 is not prime");
  assertFalse(isPrime(1), "1 is not prime");
}`
  },
  {
    id: 7,
    title: "Factorial Calculator",
    description: "Calculate factorial of a number",
    difficulty: "easy",
    initialCode: `function factorial(n) {
  if (n < 0) throw new Error("Negative numbers not allowed");
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

return { factorial };`,
    initialTests: `function testFactorial() {
  assertEqual(factorial(0), 1, "0! should be 1");
  assertEqual(factorial(5), 120, "5! should be 120");
  assertEqual(factorial(3), 6, "3! should be 6");
}`
  },
  {
    id: 8,
    title: "Find Maximum",
    description: "Find the maximum number in an array",
    difficulty: "easy",
    initialCode: `function findMax(arr) {
  if (arr.length === 0) throw new Error("Array is empty");
  return Math.max(...arr);
}

function findMin(arr) {
  if (arr.length === 0) throw new Error("Array is empty");
  return Math.min(...arr);
}

return { findMax, findMin };`,
    initialTests: `function testFindMax() {
  assertEqual(findMax([1, 5, 3, 9, 2]), 9, "Max should be 9");
  assertEqual(findMax([-1, -5, -3]), -1, "Max of negatives");
}

function testFindMin() {
  assertEqual(findMin([1, 5, 3, 9, 2]), 1, "Min should be 1");
}`
  },
  {
    id: 9,
    title: "Count Vowels",
    description: "Count vowels in a string",
    difficulty: "easy",
    initialCode: `function countVowels(str) {
  const vowels = 'aeiouAEIOU';
  let count = 0;
  for (let char of str) {
    if (vowels.includes(char)) count++;
  }
  return count;
}

return { countVowels };`,
    initialTests: `function testCountVowels() {
  assertEqual(countVowels("hello"), 2, "hello has 2 vowels");
  assertEqual(countVowels("AEIOU"), 5, "All vowels");
  assertEqual(countVowels("xyz"), 0, "No vowels");
}`
  },
  {
    id: 10,
    title: "Array Duplicates",
    description: "Remove duplicates from array",
    difficulty: "medium",
    initialCode: `function removeDuplicates(arr) {
  return [...new Set(arr)];
}

function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();
  
  for (let item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    }
    seen.add(item);
  }
  return Array.from(duplicates);
}

return { removeDuplicates, findDuplicates };`,
    initialTests: `function testRemoveDuplicates() {
  const result = removeDuplicates([1, 2, 2, 3, 4, 4]);
  assertEqual(result.length, 4, "Should have 4 unique items");
}

function testFindDuplicates() {
  const result = findDuplicates([1, 2, 2, 3, 3, 4]);
  assertTrue(result.includes(2), "Should find 2 as duplicate");
}`
  },
  {
    id: 11,
    title: "String Capitalization",
    description: "Capitalize first letter of each word",
    difficulty: "easy",
    initialCode: `function capitalize(str) {
  return str.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

return { capitalize };`,
    initialTests: `function testCapitalize() {
  assertEqual(capitalize("hello world"), "Hello World", "Should capitalize each word");
  assertEqual(capitalize("javaScript"), "Javascript", "Should lowercase rest");
}`
  },
  {
    id: 12,
    title: "Binary Search",
    description: "Implement binary search algorithm",
    difficulty: "medium",
    initialCode: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

return { binarySearch };`,
    initialTests: `function testBinarySearch() {
  const arr = [1, 3, 5, 7, 9];
  assertEqual(binarySearch(arr, 5), 2, "Should find 5 at index 2");
  assertEqual(binarySearch(arr, 10), -1, "Should return -1 for not found");
}`
  },
  {
    id: 13,
    title: "Anagram Checker",
    description: "Check if two strings are anagrams",
    difficulty: "medium",
    initialCode: `function isAnagram(str1, str2) {
  const sorted1 = str1.toLowerCase().split('').sort().join('');
  const sorted2 = str2.toLowerCase().split('').sort().join('');
  return sorted1 === sorted2;
}

return { isAnagram };`,
    initialTests: `function testAnagram() {
  assertTrue(isAnagram("listen", "silent"), "listen and silent are anagrams");
  assertFalse(isAnagram("hello", "world"), "hello and world are not anagrams");
}`
  },
  {
    id: 14,
    title: "Chunk Array",
    description: "Split array into chunks of given size",
    difficulty: "medium",
    initialCode: `function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

return { chunkArray };`,
    initialTests: `function testChunkArray() {
  const result = chunkArray([1, 2, 3, 4, 5], 2);
  assertEqual(result.length, 3, "Should have 3 chunks");
  assertEqual(result[0].length, 2, "First chunk should have 2 items");
}`
  },
  {
    id: 15,
    title: "Flatten Array",
    description: "Flatten nested arrays",
    difficulty: "medium",
    initialCode: `function flattenArray(arr) {
  return arr.reduce((flat, item) => {
    return flat.concat(Array.isArray(item) ? flattenArray(item) : item);
  }, []);
}

return { flattenArray };`,
    initialTests: `function testFlattenArray() {
  const nested = [1, [2, [3, 4], 5]];
  const result = flattenArray(nested);
  assertEqual(result.length, 5, "Should flatten to 5 items");
  assertEqual(result[2], 3, "Third item should be 3");
}`
  },
  {
    id: 16,
    title: "Longest Word",
    description: "Find the longest word in a string",
    difficulty: "easy",
    initialCode: `function longestWord(str) {
  const words = str.split(' ');
  return words.reduce((longest, current) => 
    current.length > longest.length ? current : longest
  , '');
}

return { longestWord };`,
    initialTests: `function testLongestWord() {
  assertEqual(longestWord("The quick brown fox"), "quick", "Should find 'quick'");
  assertEqual(longestWord("a bb ccc"), "ccc", "Should find 'ccc'");
}`
  },
  {
    id: 17,
    title: "Two Sum",
    description: "Find two numbers that add up to target",
    difficulty: "medium",
    initialCode: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return null;
}

return { twoSum };`,
    initialTests: `function testTwoSum() {
  const result = twoSum([2, 7, 11, 15], 9);
  assertTrue(result !== null, "Should find a pair");
  assertEqual(result[0], 0, "First index should be 0");
}`
  },
  {
    id: 18,
    title: "Range Generator",
    description: "Generate array of numbers in range",
    difficulty: "easy",
    initialCode: `function range(start, end, step = 1) {
  const result = [];
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  return result;
}

return { range };`,
    initialTests: `function testRange() {
  const result = range(1, 5);
  assertEqual(result.length, 5, "Should have 5 numbers");
  assertEqual(result[0], 1, "Should start at 1");
  assertEqual(result[4], 5, "Should end at 5");
}`
  },
  {
    id: 19,
    title: "Power Function",
    description: "Calculate power of a number",
    difficulty: "easy",
    initialCode: `function power(base, exponent) {
  if (exponent === 0) return 1;
  if (exponent < 0) return 1 / power(base, -exponent);
  return base * power(base, exponent - 1);
}

return { power };`,
    initialTests: `function testPower() {
  assertEqual(power(2, 3), 8, "2^3 should be 8");
  assertEqual(power(5, 0), 1, "5^0 should be 1");
  assertEqual(power(2, -2), 0.25, "2^-2 should be 0.25");
}`
  },
  {
    id: 20,
    title: "Character Frequency",
    description: "Count character occurrences in string",
    difficulty: "easy",
    initialCode: `function charFrequency(str) {
  const freq = {};
  for (let char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }
  return freq;
}

return { charFrequency };`,
    initialTests: `function testCharFrequency() {
  const result = charFrequency("hello");
  assertEqual(result['l'], 2, "Letter 'l' appears twice");
  assertEqual(result['h'], 1, "Letter 'h' appears once");
}`
  },
  {
    id: 21,
    title: "Merge Sorted Arrays",
    description: "Merge two sorted arrays",
    difficulty: "medium",
    initialCode: `function mergeSorted(arr1, arr2) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] < arr2[j]) {
      result.push(arr1[i++]);
    } else {
      result.push(arr2[j++]);
    }
  }
  
  return result.concat(arr1.slice(i)).concat(arr2.slice(j));
}

return { mergeSorted };`,
    initialTests: `function testMergeSorted() {
  const result = mergeSorted([1, 3, 5], [2, 4, 6]);
  assertEqual(result.length, 6, "Should have 6 elements");
  assertEqual(result[0], 1, "First should be 1");
}`
  },
  {
    id: 22,
    title: "Leap Year",
    description: "Check if a year is a leap year",
    difficulty: "easy",
    initialCode: `function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

return { isLeapYear };`,
    initialTests: `function testLeapYear() {
  assertTrue(isLeapYear(2020), "2020 is a leap year");
  assertFalse(isLeapYear(2021), "2021 is not a leap year");
  assertTrue(isLeapYear(2000), "2000 is a leap year");
}`
  },
  {
    id: 23,
    title: "Deep Clone",
    description: "Deep clone an object",
    difficulty: "hard",
    initialCode: `function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  
  const clone = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key]);
    }
  }
  return clone;
}

return { deepClone };`,
    initialTests: `function testDeepClone() {
  const obj = { a: 1, b: { c: 2 } };
  const clone = deepClone(obj);
  clone.b.c = 3;
  assertEqual(obj.b.c, 2, "Original should not change");
}`
  },
  {
    id: 24,
    title: "Valid Parentheses",
    description: "Check if parentheses are balanced",
    difficulty: "medium",
    initialCode: `function isValidParentheses(str) {
  const stack = [];
  const pairs = { '(': ')', '[': ']', '{': '}' };
  
  for (let char of str) {
    if (char in pairs) {
      stack.push(char);
    } else if (Object.values(pairs).includes(char)) {
      if (stack.length === 0 || pairs[stack.pop()] !== char) {
        return false;
      }
    }
  }
  return stack.length === 0;
}

return { isValidParentheses };`,
    initialTests: `function testValidParentheses() {
  assertTrue(isValidParentheses("()[]{}"), "Should be valid");
  assertFalse(isValidParentheses("(]"), "Should be invalid");
  assertTrue(isValidParentheses("{[]}"), "Nested should be valid");
}`
  },
  {
    id: 25,
    title: "String Compression",
    description: "Compress repeated characters",
    difficulty: "medium",
    initialCode: `function compressString(str) {
  if (str.length === 0) return '';
  
  let compressed = '';
  let count = 1;
  
  for (let i = 1; i < str.length; i++) {
    if (str[i] === str[i - 1]) {
      count++;
    } else {
      compressed += str[i - 1] + (count > 1 ? count : '');
      count = 1;
    }
  }
  compressed += str[str.length - 1] + (count > 1 ? count : '');
  
  return compressed.length < str.length ? compressed : str;
}

return { compressString };`,
    initialTests: `function testCompressString() {
  assertEqual(compressString("aabcccccaaa"), "a2bc5a3", "Should compress");
  assertEqual(compressString("abc"), "abc", "Should not compress short strings");
}`
  },
  {
    id: 26,
    title: "Rotate Array",
    description: "Rotate array by k positions",
    difficulty: "medium",
    initialCode: `function rotateArray(arr, k) {
  k = k % arr.length;
  return arr.slice(-k).concat(arr.slice(0, -k));
}

return { rotateArray };`,
    initialTests: `function testRotateArray() {
  const result = rotateArray([1, 2, 3, 4, 5], 2);
  assertEqual(result[0], 4, "First element should be 4");
  assertEqual(result[4], 3, "Last element should be 3");
}`
  },
  {
    id: 27,
    title: "Common Elements",
    description: "Find common elements in two arrays",
    difficulty: "easy",
    initialCode: `function commonElements(arr1, arr2) {
  const set1 = new Set(arr1);
  return arr2.filter(item => set1.has(item));
}

return { commonElements };`,
    initialTests: `function testCommonElements() {
  const result = commonElements([1, 2, 3], [2, 3, 4]);
  assertTrue(result.includes(2), "Should include 2");
  assertTrue(result.includes(3), "Should include 3");
}`
  },
  {
    id: 28,
    title: "Matrix Transpose",
    description: "Transpose a 2D matrix",
    difficulty: "medium",
    initialCode: `function transpose(matrix) {
  return matrix[0].map((_, colIndex) => 
    matrix.map(row => row[colIndex])
  );
}

return { transpose };`,
    initialTests: `function testTranspose() {
  const matrix = [[1, 2], [3, 4]];
  const result = transpose(matrix);
  assertEqual(result[0][1], 3, "Element [0][1] should be 3");
}`
  },
  {
    id: 29,
    title: "GCD Calculator",
    description: "Calculate Greatest Common Divisor",
    difficulty: "medium",
    initialCode: `function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

return { gcd, lcm };`,
    initialTests: `function testGCD() {
  assertEqual(gcd(48, 18), 6, "GCD of 48 and 18 is 6");
  assertEqual(gcd(100, 50), 50, "GCD of 100 and 50 is 50");
}`
  },
  {
    id: 30,
    title: "Unique Characters",
    description: "Check if string has all unique characters",
    difficulty: "easy",
    initialCode: `function hasUniqueChars(str) {
  return new Set(str).size === str.length;
}

return { hasUniqueChars };`,
    initialTests: `function testUniqueChars() {
  assertTrue(hasUniqueChars("abcdef"), "Should have unique chars");
  assertFalse(hasUniqueChars("hello"), "Should not have unique chars");
}`
  },
  {
    id: 31,
    title: "Caesar Cipher",
    description: "Implement Caesar cipher encryption",
    difficulty: "medium",
    initialCode: `function caesarCipher(str, shift) {
  return str.replace(/[a-z]/gi, char => {
    const code = char.charCodeAt(0);
    const base = code >= 97 ? 97 : 65;
    return String.fromCharCode(((code - base + shift) % 26) + base);
  });
}

return { caesarCipher };`,
    initialTests: `function testCaesarCipher() {
  assertEqual(caesarCipher("abc", 1), "bcd", "Should shift by 1");
  assertEqual(caesarCipher("xyz", 3), "abc", "Should wrap around");
}`
  },
  {
    id: 32,
    title: "Array Intersection",
    description: "Find intersection of multiple arrays",
    difficulty: "medium",
    initialCode: `function arrayIntersection(...arrays) {
  if (arrays.length === 0) return [];
  return arrays.reduce((acc, arr) => 
    acc.filter(item => arr.includes(item))
  );
}

return { arrayIntersection };`,
    initialTests: `function testArrayIntersection() {
  const result = arrayIntersection([1, 2, 3], [2, 3, 4], [3, 4, 5]);
  assertEqual(result.length, 1, "Should have 1 common element");
  assertEqual(result[0], 3, "Common element should be 3");
}`
  },
  {
    id: 33,
    title: "Debounce Function",
    description: "Implement debounce utility",
    difficulty: "hard",
    initialCode: `function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

return { debounce };`,
    initialTests: `function testDebounce() {
  let count = 0;
  const increment = debounce(() => count++, 100);
  increment();
  increment();
  assertEqual(count, 0, "Should not execute immediately");
}`
  },
  {
    id: 34,
    title: "Title Case",
    description: "Convert string to title case",
    difficulty: "easy",
    initialCode: `function toTitleCase(str) {
  return str.toLowerCase().split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

return { toTitleCase };`,
    initialTests: `function testTitleCase() {
  assertEqual(toTitleCase("hello world"), "Hello World", "Should title case");
  assertEqual(toTitleCase("LOUD TEXT"), "Loud Text", "Should handle uppercase");
}`
  },
  {
    id: 35,
    title: "Sum of Digits",
    description: "Calculate sum of digits in a number",
    difficulty: "easy",
    initialCode: `function sumOfDigits(num) {
  return Math.abs(num).toString().split('')
    .reduce((sum, digit) => sum + parseInt(digit), 0);
}

return { sumOfDigits };`,
    initialTests: `function testSumOfDigits() {
  assertEqual(sumOfDigits(123), 6, "1+2+3 should be 6");
  assertEqual(sumOfDigits(-456), 15, "Should handle negative");
}`
  },
  {
    id: 36,
    title: "Missing Number",
    description: "Find missing number in sequence",
    difficulty: "medium",
    initialCode: `function findMissingNumber(arr) {
  const n = arr.length + 1;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = arr.reduce((sum, num) => sum + num, 0);
  return expectedSum - actualSum;
}

return { findMissingNumber };`,
    initialTests: `function testMissingNumber() {
  assertEqual(findMissingNumber([1, 2, 4, 5]), 3, "Missing number is 3");
  assertEqual(findMissingNumber([1, 2, 3, 4, 6]), 5, "Missing number is 5");
}`
  },
  {
    id: 37,
    title: "Memoization",
    description: "Implement memoization function",
    difficulty: "hard",
    initialCode: `function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

return { memoize };`,
    initialTests: `function testMemoize() {
  let callCount = 0;
  const expensive = (n) => { callCount++; return n * 2; };
  const memoized = memoize(expensive);
  memoized(5);
  memoized(5);
  assertEqual(callCount, 1, "Should only call once for same input");
}`
  },
  {
    id: 38,
    title: "Shuffle Array",
    description: "Randomly shuffle an array",
    difficulty: "medium",
    initialCode: `function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

return { shuffleArray };`,
    initialTests: `function testShuffleArray() {
  const arr = [1, 2, 3, 4, 5];
  const shuffled = shuffleArray(arr);
  assertEqual(shuffled.length, 5, "Should maintain length");
  assertTrue(shuffled.includes(1), "Should contain all elements");
}`
  },
  {
    id: 39,
    title: "Pascal's Triangle",
    description: "Generate Pascal's triangle",
    difficulty: "medium",
    initialCode: `function pascalsTriangle(rows) {
  const triangle = [[1]];
  for (let i = 1; i < rows; i++) {
    const prevRow = triangle[i - 1];
    const newRow = [1];
    for (let j = 1; j < prevRow.length; j++) {
      newRow.push(prevRow[j - 1] + prevRow[j]);
    }
    newRow.push(1);
    triangle.push(newRow);
  }
  return triangle;
}

return { pascalsTriangle };`,
    initialTests: `function testPascalsTriangle() {
  const result = pascalsTriangle(4);
  assertEqual(result.length, 4, "Should have 4 rows");
  assertEqual(result[3][1], 3, "Fourth row second element should be 3");
}`
  },
  {
    id: 40,
    title: "Hamming Distance",
    description: "Calculate Hamming distance between strings",
    difficulty: "medium",
    initialCode: `function hammingDistance(str1, str2) {
  if (str1.length !== str2.length) {
    throw new Error("Strings must be equal length");
  }
  let distance = 0;
  for (let i = 0; i < str1.length; i++) {
    if (str1[i] !== str2[i]) distance++;
  }
  return distance;
}

return { hammingDistance };`,
    initialTests: `function testHammingDistance() {
  assertEqual(hammingDistance("karolin", "kathrin"), 3, "Distance should be 3");
  assertEqual(hammingDistance("hello", "hello"), 0, "Same strings have distance 0");
}`
  },
  {
    id: 41,
    title: "Longest Common Prefix",
    description: "Find longest common prefix in strings",
    difficulty: "medium",
    initialCode: `function longestCommonPrefix(strs) {
  if (strs.length === 0) return '';
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1);
      if (prefix === '') return '';
    }
  }
  return prefix;
}

return { longestCommonPrefix };`,
    initialTests: `function testLongestCommonPrefix() {
  assertEqual(longestCommonPrefix(["flower", "flow", "flight"]), "fl", "Prefix is fl");
  assertEqual(longestCommonPrefix(["dog", "racecar", "car"]), "", "No common prefix");
}`
  },
  {
    id: 42,
    title: "Roman Numerals",
    description: "Convert integer to Roman numerals",
    difficulty: "medium",
    initialCode: `function intToRoman(num) {
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const symbols = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  
  let result = '';
  for (let i = 0; i < values.length; i++) {
    while (num >= values[i]) {
      result += symbols[i];
      num -= values[i];
    }
  }
  return result;
}

return { intToRoman };`,
    initialTests: `function testIntToRoman() {
  assertEqual(intToRoman(3), "III", "3 is III");
  assertEqual(intToRoman(9), "IX", "9 is IX");
  assertEqual(intToRoman(58), "LVIII", "58 is LVIII");
}`
  },
  {
    id: 43,
    title: "ZigZag Conversion",
    description: "Convert string to zigzag pattern",
    difficulty: "hard",
    initialCode: `function zigzagConvert(str, numRows) {
  if (numRows === 1 || numRows >= str.length) return str;
  
  const rows = Array(numRows).fill('');
  let currentRow = 0;
  let goingDown = false;
  
  for (let char of str) {
    rows[currentRow] += char;
    if (currentRow === 0 || currentRow === numRows - 1) {
      goingDown = !goingDown;
    }
    currentRow += goingDown ? 1 : -1;
  }
  
  return rows.join('');
}

return { zigzagConvert };`,
    initialTests: `function testZigzagConvert() {
  assertEqual(zigzagConvert("PAYPALISHIRING", 3), "PAHNAPLSIIGYIR", "Should convert to zigzag");
}`
  },
  {
    id: 44,
    title: "Median of Arrays",
    description: "Find median of two sorted arrays",
    difficulty: "hard",
    initialCode: `function findMedian(arr1, arr2) {
  const merged = [...arr1, ...arr2].sort((a, b) => a - b);
  const mid = Math.floor(merged.length / 2);
  
  if (merged.length % 2 === 0) {
    return (merged[mid - 1] + merged[mid]) / 2;
  }
  return merged[mid];
}

return { findMedian };`,
    initialTests: `function testFindMedian() {
  assertEqual(findMedian([1, 3], [2]), 2, "Median of [1,2,3] is 2");
  assertEqual(findMedian([1, 2], [3, 4]), 2.5, "Median of [1,2,3,4] is 2.5");
}`
  },
  {
    id: 45,
    title: "Run Length Encoding",
    description: "Encode string with run length",
    difficulty: "medium",
    initialCode: `function runLengthEncode(str) {
  if (!str) return '';
  let encoded = '';
  let count = 1;
  
  for (let i = 1; i <= str.length; i++) {
    if (i < str.length && str[i] === str[i - 1]) {
      count++;
    } else {
      encoded += count + str[i - 1];
      count = 1;
    }
  }
  return encoded;
}

return { runLengthEncode };`,
    initialTests: `function testRunLengthEncode() {
  assertEqual(runLengthEncode("aaabbc"), "3a2b1c", "Should encode runs");
  assertEqual(runLengthEncode("abc"), "1a1b1c", "Should handle single chars");
}`
  },
  {
    id: 46,
    title: "Product Except Self",
    description: "Array product except current element",
    difficulty: "medium",
    initialCode: `function productExceptSelf(nums) {
  const n = nums.length;
  const result = new Array(n).fill(1);
  
  let leftProduct = 1;
  for (let i = 0; i < n; i++) {
    result[i] = leftProduct;
    leftProduct *= nums[i];
  }
  
  let rightProduct = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= rightProduct;
    rightProduct *= nums[i];
  }
  
  return result;
}

return { productExceptSelf };`,
    initialTests: `function testProductExceptSelf() {
  const result = productExceptSelf([1, 2, 3, 4]);
  assertEqual(result[0], 24, "Product except 1 is 24");
  assertEqual(result[1], 12, "Product except 2 is 12");
}`
  },
  {
    id: 47,
    title: "Sliding Window Max",
    description: "Find maximum in sliding window",
    difficulty: "hard",
    initialCode: `function maxSlidingWindow(nums, k) {
  const result = [];
  for (let i = 0; i <= nums.length - k; i++) {
    const window = nums.slice(i, i + k);
    result.push(Math.max(...window));
  }
  return result;
}

return { maxSlidingWindow };`,
    initialTests: `function testMaxSlidingWindow() {
  const result = maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3);
  assertEqual(result[0], 3, "First window max is 3");
  assertEqual(result.length, 6, "Should have 6 windows");
}`
  },
  {
    id: 48,
    title: "Permutations",
    description: "Generate all permutations of array",
    difficulty: "hard",
    initialCode: `function permutations(arr) {
  if (arr.length <= 1) return [arr];
  
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
    const remainingPerms = permutations(remaining);
    
    for (let perm of remainingPerms) {
      result.push([current].concat(perm));
    }
  }
  return result;
}

return { permutations };`,
    initialTests: `function testPermutations() {
  const result = permutations([1, 2, 3]);
  assertEqual(result.length, 6, "3! = 6 permutations");
  assertTrue(result.some(p => p[0] === 1 && p[1] === 2), "Should contain [1,2,3]");
}`
  },
  {
    id: 49,
    title: "Sudoku Validator",
    description: "Validate Sudoku board",
    difficulty: "hard",
    initialCode: `function isValidSudoku(board) {
  const seen = new Set();
  
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const num = board[i][j];
      if (num !== '.') {
        const rowKey = \`row\${i}-\${num}\`;
        const colKey = \`col\${j}-\${num}\`;
        const boxKey = \`box\${Math.floor(i/3)}\${Math.floor(j/3)}-\${num}\`;
        
        if (seen.has(rowKey) || seen.has(colKey) || seen.has(boxKey)) {
          return false;
        }
        seen.add(rowKey);
        seen.add(colKey);
        seen.add(boxKey);
      }
    }
  }
  return true;
}

return { isValidSudoku };`,
    initialTests: `function testValidSudoku() {
  const validBoard = [
    ["5","3",".",".","7",".",".",".","."],
    ["6",".",".","1","9","5",".",".","."],
    [".","9","8",".",".",".",".","6","."],
    ["8",".",".",".","6",".",".",".","3"],
    ["4",".",".","8",".","3",".",".","1"],
    ["7",".",".",".","2",".",".",".","6"],
    [".","6",".",".",".",".","2","8","."],
    [".",".",".","4","1","9",".",".","5"],
    [".",".",".",".","8",".",".","7","9"]
  ];
  assertTrue(isValidSudoku(validBoard), "Should be valid");
}`
  },
  {
    id: 50,
    title: "Longest Palindrome Substring",
    description: "Find longest palindromic substring",
    difficulty: "hard",
    initialCode: `function longestPalindrome(s) {
  if (s.length < 2) return s;
  
  let start = 0, maxLen = 0;
  
  function expandAroundCenter(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      const len = right - left + 1;
      if (len > maxLen) {
        start = left;
        maxLen = len;
      }
      left--;
      right++;
    }
  }
  
  for (let i = 0; i < s.length; i++) {
    expandAroundCenter(i, i);       // odd length
    expandAroundCenter(i, i + 1);   // even length
  }
  
  return s.substring(start, start + maxLen);
}

return { longestPalindrome };`,
    initialTests: `function testLongestPalindrome() {
  assertEqual(longestPalindrome("babad"), "bab", "bab or aba are valid");
  assertEqual(longestPalindrome("cbbd"), "bb", "Should find bb");
}`
  }
];