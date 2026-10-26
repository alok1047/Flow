export const challengeTopics = [
  {
    id: 'type-coercion',
    name: 'Type Coercion',
    icon: 'RefreshCw',
    color: '#f59e0b',
    description: 'Master how JavaScript converts between types',
    questions: [
      // 3 easy (xp: 10 each)
      { id: 1, difficulty: 'easy', xp: 10, code: '1 + "2"', options: ['"12"', '3', 'NaN', 'Error'], correct: 0, explanation: 'The + operator with a string converts the other operand to a string. 1 becomes "1", then "1" + "2" = "12".' },
      { id: 2, difficulty: 'easy', xp: 10, code: 'true + true', options: ['2', '"truetrue"', 'true', 'NaN'], correct: 0, explanation: 'Booleans coerce to numbers. true is 1, so 1 + 1 = 2.' },
      { id: 3, difficulty: 'easy', xp: 10, code: '"5" - 3', options: ['2', '"53"', 'NaN', '"2"'], correct: 0, explanation: 'The minus operator only works with numbers, so "5" becomes 5. 5 - 3 = 2.' },
      // 4 medium (xp: 20 each)
      { id: 4, difficulty: 'medium', xp: 20, code: '[] + []', options: ['""', '0', 'NaN', '[]'], correct: 0, explanation: 'Both arrays convert to empty strings. "" + "" = "".' },
      { id: 5, difficulty: 'medium', xp: 20, code: '[] + {}', options: ['"[object Object]"', 'NaN', '{}', '0'], correct: 0, explanation: '[] becomes "" and {} becomes "[object Object]". Concatenated gives "[object Object]".' },
      { id: 6, difficulty: 'medium', xp: 20, code: '"" == false', options: ['true', 'false', 'TypeError', 'undefined'], correct: 0, explanation: 'Both coerce to 0. 0 == 0 is true.' },
      { id: 7, difficulty: 'medium', xp: 20, code: '"\\n" == 0', options: ['true', 'false', 'NaN', 'Error'], correct: 0, explanation: 'Whitespace-only strings coerce to 0. 0 == 0 is true.' },
      // 3 hard (xp: 30 each)
      { id: 8, difficulty: 'hard', xp: 30, code: '(!+[]+[]+![]).length', options: ['9', '5', '10', 'NaN'], correct: 0, explanation: '!+[] is true (string), +[] is "" → !""=true, concat: "truefalse" → length 9.' },
      { id: 9, difficulty: 'hard', xp: 30, code: '[,,,].length', options: ['3', '4', '0', 'NaN'], correct: 0, explanation: 'Trailing commas create holes. [,,,] has 3 empty slots, length is 3.' },
      { id: 10, difficulty: 'hard', xp: 30, code: '+"Infinity"', options: ['Infinity', 'NaN', '0', 'Error'], correct: 0, explanation: 'The unary + converts the string "Infinity" to the number Infinity.' },
    ],
  },
  {
    id: 'equality-gotchas',
    name: 'Equality Gotchas',
    icon: 'Scale',
    color: '#3b82f6',
    description: 'Tricky == vs === comparisons',
    questions: [
      // 3 easy
      { id: 1, difficulty: 'easy', xp: 10, code: '0 == false', options: ['true', 'false'], correct: 0, explanation: '== coerces false to 0. 0 == 0 is true.' },
      { id: 2, difficulty: 'easy', xp: 10, code: '0 === false', options: ['false', 'true'], correct: 0, explanation: '=== checks type. Number vs Boolean → false.' },
      { id: 3, difficulty: 'easy', xp: 10, code: '1 == "1"', options: ['true', 'false'], correct: 0, explanation: '== coerces "1" to 1. 1 == 1 is true.' },
      // 4 medium
      { id: 4, difficulty: 'medium', xp: 20, code: 'null == undefined', options: ['true', 'false'], correct: 0, explanation: 'null and undefined are loosely equal to each other and nothing else.' },
      { id: 5, difficulty: 'medium', xp: 20, code: 'null === undefined', options: ['false', 'true'], correct: 0, explanation: 'Different types (object vs undefined) → false with strict equality.' },
      { id: 6, difficulty: 'medium', xp: 20, code: 'NaN == NaN', options: ['false', 'true'], correct: 0, explanation: 'NaN is not equal to anything, including itself!' },
      { id: 7, difficulty: 'medium', xp: 20, code: 'null == 0', options: ['false', 'true'], correct: 0, explanation: 'null only loosely equals undefined, not 0.' },
      // 3 hard
      { id: 8, difficulty: 'hard', xp: 30, code: '[] == ![]', options: ['true', 'false'], correct: 0, explanation: '![] is false. [] converts to 0, false converts to 0. 0 == 0 is true!' },
      { id: 9, difficulty: 'hard', xp: 30, code: '"" == []', options: ['true', 'false'], correct: 0, explanation: '[] converts to "". "" == "" is true.' },
      { id: 10, difficulty: 'hard', xp: 30, code: '[null] == ""', options: ['true', 'false'], correct: 0, explanation: '[null].toString() is "", so "" == "" is true.' },
    ],
  },
  {
    id: 'scope-closures',
    name: 'Scope & Closures',
    icon: 'Lock',
    color: '#8b5cf6',
    description: 'var vs let, hoisting, and closure traps',
    questions: [
      // 3 easy
      { id: 1, difficulty: 'easy', xp: 10, code: 'var x = 1;\nif (true) { var x = 2; }\nconsole.log(x);', options: ['2', '1', 'undefined', 'Error'], correct: 0, explanation: 'var is function-scoped, not block-scoped. The inner var x overwrites the outer one.' },
      { id: 2, difficulty: 'easy', xp: 10, code: 'let x = 1;\nif (true) { let x = 2; }\nconsole.log(x);', options: ['1', '2', 'undefined', 'Error'], correct: 0, explanation: 'let is block-scoped. The inner x is a different variable confined to the if block.' },
      { id: 3, difficulty: 'easy', xp: 10, code: 'console.log(a);\nvar a = 5;', options: ['undefined', '5', 'Error', 'null'], correct: 0, explanation: 'var declarations are hoisted, but not assignments. a is undefined at that point.' },
      // 4 medium
      { id: 4, difficulty: 'medium', xp: 20, code: 'console.log(b);\nlet b = 5;', options: ['ReferenceError', 'undefined', '5', 'null'], correct: 0, explanation: 'let/const have a temporal dead zone — accessing before declaration throws ReferenceError.' },
      { id: 5, difficulty: 'medium', xp: 20, code: 'function foo() {\n  return a;\n  var a = 1;\n}\nfoo();', options: ['undefined', '1', 'Error', 'null'], correct: 0, explanation: 'var a is hoisted to top of function, but assignment happens after return. Returns undefined.' },
      { id: 6, difficulty: 'medium', xp: 20, code: 'for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}', options: ['3, 3, 3', '0, 1, 2', '0, 0, 0', 'undefined x3'], correct: 0, explanation: 'var is function-scoped. By the time callbacks run, i is 3. All see the same i.' },
      { id: 7, difficulty: 'medium', xp: 20, code: 'for (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}', options: ['0, 1, 2', '3, 3, 3', '0, 0, 0', 'Error'], correct: 0, explanation: 'let creates a new binding per iteration. Each callback captures its own i value.' },
      // 3 hard
      { id: 8, difficulty: 'hard', xp: 30, code: 'function make() {\n  let n = 0;\n  return { inc: () => ++n, get: () => n };\n}\nconst c = make();\nc.inc(); c.inc();\nc.get();', options: ['2', '1', '0', 'NaN'], correct: 0, explanation: 'inc() increments the closed-over n each time. After 2 calls, n is 2.' },
      { id: 9, difficulty: 'hard', xp: 30, code: 'var f = [];\nfor (var i = 0; i < 3; i++) {\n  f.push(((j) => () => j)(i));\n}\nf[0]();', options: ['0', '3', 'undefined', 'Error'], correct: 0, explanation: 'The IIFE captures i as j at each iteration. f[0] captured j=0.' },
      { id: 10, difficulty: 'hard', xp: 30, code: 'const a = {};\nconst b = { key: "b" };\nconst c = { key: "c" };\na[b] = 123;\na[c] = 456;\nconsole.log(a[b]);', options: ['456', '123', 'undefined', 'Error'], correct: 0, explanation: 'Object keys are strings. Both b and c convert to "[object Object]", so a[b] gets overwritten by a[c].' },
    ],
  },
  {
    id: 'arrays-objects',
    name: 'Arrays & Objects',
    icon: 'Package',
    color: '#22c55e',
    description: 'Reference types, mutations, and gotchas',
    questions: [
      // 3 easy
      { id: 1, difficulty: 'easy', xp: 10, code: 'typeof []', options: ['"object"', '"array"', '"undefined"', '"list"'], correct: 0, explanation: 'Arrays are objects in JavaScript. typeof [] returns "object".' },
      { id: 2, difficulty: 'easy', xp: 10, code: '[1,2,3].length', options: ['3', '2', '4', 'undefined'], correct: 0, explanation: 'The array has 3 elements, so .length is 3.' },
      { id: 3, difficulty: 'easy', xp: 10, code: 'typeof typeof 1', options: ['"string"', '"number"', '"undefined"', '"object"'], correct: 0, explanation: 'typeof 1 returns "number" (a string). typeof "number" returns "string".' },
      // 4 medium
      { id: 4, difficulty: 'medium', xp: 20, code: 'let a = [1,2,3];\nlet b = a;\nb.push(4);\na.length;', options: ['4', '3', 'undefined', 'Error'], correct: 0, explanation: 'Arrays are reference types. b = a means both point to the same array. push(4) affects both.' },
      { id: 5, difficulty: 'medium', xp: 20, code: 'let a = {x:1};\nlet b = a;\na = {x:2};\nb.x;', options: ['1', '2', 'undefined', 'Error'], correct: 0, explanation: 'Reassigning a to a new object does not change b. b still references the original {x:1}.' },
      { id: 6, difficulty: 'medium', xp: 20, code: 'const arr = [1,2,3];\narr.push(4);\narr.length;', options: ['4', 'TypeError', '3', 'undefined'], correct: 0, explanation: 'const prevents reassignment, not mutation. You can still push to a const array.' },
      { id: 7, difficulty: 'medium', xp: 20, code: 'Object.keys({a:1, b:2, c:3}).length', options: ['3', '6', '0', 'Error'], correct: 0, explanation: 'Object.keys returns an array of own property names. 3 keys → length 3.' },
      // 3 hard
      { id: 8, difficulty: 'hard', xp: 30, code: 'const a = [1,[2,3]];\nconst b = [...a];\nb[1].push(4);\na[1].length;', options: ['3', '2', '4', 'Error'], correct: 0, explanation: 'Spread creates a shallow copy. b[1] still references the same inner array as a[1]. Push affects both.' },
      { id: 9, difficulty: 'hard', xp: 30, code: 'JSON.parse(JSON.stringify(undefined))', options: ['SyntaxError', 'null', 'undefined', '"undefined"'], correct: 0, explanation: 'JSON.stringify(undefined) returns undefined (not a string). JSON.parse(undefined) throws SyntaxError.' },
      { id: 10, difficulty: 'hard', xp: 30, code: 'const a = [1,2,3];\ndelete a[1];\na.length;', options: ['3', '2', 'undefined', 'Error'], correct: 0, explanation: 'delete removes the value but does not change array length. It leaves an empty slot.' },
    ],
  },
  {
    id: 'async-promises',
    name: 'Async & Promises',
    icon: 'Hourglass',
    color: '#ef4444',
    description: 'Event loop, setTimeout, and Promise ordering',
    questions: [
      // 3 easy
      { id: 1, difficulty: 'easy', xp: 10, code: 'console.log(1);\nsetTimeout(() => console.log(2), 0);\nconsole.log(3);', options: ['1, 3, 2', '1, 2, 3', '2, 1, 3', '3, 2, 1'], correct: 0, explanation: 'setTimeout callbacks run after the current call stack clears, even with 0ms delay.' },
      { id: 2, difficulty: 'easy', xp: 10, code: 'typeof Promise', options: ['"function"', '"object"', '"undefined"', '"promise"'], correct: 0, explanation: 'Promise is a constructor function, so typeof returns "function".' },
      { id: 3, difficulty: 'easy', xp: 10, code: 'Promise.resolve(42).then(v => console.log(v));\nconsole.log("first");', options: ['"first", 42', '42, "first"', '"first"', '42'], correct: 0, explanation: 'Promise.then callbacks are microtasks — they run after current synchronous code finishes.' },
      // 4 medium
      { id: 4, difficulty: 'medium', xp: 20, code: 'console.log("A");\nsetTimeout(() => console.log("B"), 0);\nPromise.resolve().then(() => console.log("C"));\nconsole.log("D");', options: ['A, D, C, B', 'A, B, C, D', 'A, D, B, C', 'A, C, D, B'], correct: 0, explanation: 'Sync first (A, D), then microtasks (C from Promise), then macrotasks (B from setTimeout).' },
      { id: 5, difficulty: 'medium', xp: 20, code: 'async function f() { return 1; }\ntypeof f();', options: ['"object"', '"number"', '"function"', '"promise"'], correct: 0, explanation: 'async functions always return a Promise. typeof a Promise is "object".' },
      { id: 6, difficulty: 'medium', xp: 20, code: 'const p = new Promise(r => r(1));\np.then(v => v + 1).then(v => console.log(v));', options: ['2', '1', 'undefined', 'Promise'], correct: 0, explanation: 'First .then returns 1+1=2. Second .then receives 2 and logs it.' },
      { id: 7, difficulty: 'medium', xp: 20, code: 'let x = 0;\nsetTimeout(() => { x = 1; }, 0);\nconsole.log(x);', options: ['0', '1', 'undefined', 'Error'], correct: 0, explanation: 'setTimeout is async. x is still 0 when console.log runs synchronously.' },
      // 3 hard
      { id: 8, difficulty: 'hard', xp: 30, code: 'Promise.resolve()\n  .then(() => { throw new Error("!"); })\n  .catch(e => "caught")\n  .then(v => console.log(v));', options: ['"caught"', 'Error', 'undefined', 'nothing'], correct: 0, explanation: '.catch returns a resolved promise with "caught", which flows to the next .then.' },
      { id: 9, difficulty: 'hard', xp: 30, code: 'async function f() {\n  let a = await Promise.resolve(1);\n  let b = await Promise.resolve(2);\n  return a + b;\n}\nf().then(console.log);', options: ['3', '12', 'undefined', 'Promise'], correct: 0, explanation: 'await pauses until each Promise resolves. a=1, b=2, returns 3.' },
      { id: 10, difficulty: 'hard', xp: 30, code: 'setTimeout(() => console.log(1), 0);\nsetImmediate?.(() => console.log(2));\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);', options: ['4, 3, 1', '4, 3, 2, 1', '1, 2, 3, 4', '4, 1, 3'], correct: 0, explanation: 'Sync (4) first, then microtask (3 from Promise), then macrotask (1 from setTimeout). setImmediate is Node-only.' },
    ],
  },
];
