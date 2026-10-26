export const jsRoadmap = [
  {
    id: 1,
    title: 'Variables & Data Types',
    step: 'Step 1',
    subtitle: 'The building blocks of every program',
    content:
      'Learn how JavaScript stores information using let, const, and var. Understand the seven primitive types — strings, numbers, booleans, null, undefined, BigInt, and Symbol — and how type coercion works behind the scenes.',
    icon: 'Box',
    color: '#22c55e',
    topics: ['let / const / var', 'Strings', 'Numbers', 'Booleans', 'null & undefined', 'typeof', 'Type Coercion'],
  },
  {
    id: 2,
    title: 'Operators & Expressions',
    step: 'Step 2',
    subtitle: 'Making decisions with math and logic',
    content:
      'Master arithmetic, comparison, logical, and assignment operators. Learn how expressions evaluate, short-circuit logic, the ternary operator, and the nuances of == vs ===.',
    icon: 'Calculator',
    color: '#3b82f6',
    topics: ['Arithmetic', 'Comparison', 'Logical (&&, ||, !)', 'Ternary', '== vs ===', 'Assignment', 'Nullish (??)'],
  },
  {
    id: 3,
    title: 'Control Flow',
    step: 'Step 3',
    subtitle: 'Directing the path your code takes',
    content:
      'Use if/else statements, switch cases, and conditional expressions to control program execution. Understand truthy and falsy values and how JavaScript decides which branch to follow.',
    icon: 'GitBranch',
    color: '#f59e0b',
    topics: ['if / else', 'else if chains', 'switch / case', 'Truthy & Falsy', 'Guard Clauses', 'Nested Conditions'],
  },
  {
    id: 4,
    title: 'Loops',
    step: 'Step 4',
    subtitle: 'Repeating actions efficiently',
    content:
      'Iterate over data with for, while, do...while, for...of, and for...in loops. Learn about break, continue, and how to avoid infinite loops. Visualize loop execution step by step.',
    icon: 'RefreshCw',
    color: '#06b6d4',
    topics: ['for loop', 'while loop', 'do...while', 'for...of', 'for...in', 'break & continue', 'Nested Loops'],
  },
  {
    id: 5,
    title: 'Functions',
    step: 'Step 5',
    subtitle: 'Reusable blocks of logic',
    content:
      'Explore function declarations, expressions, and arrow functions. Understand scope, closures, hoisting, default parameters, rest/spread operators, and how JavaScript handles the call stack.',
    icon: 'Zap',
    color: '#8b5cf6',
    topics: ['Declarations', 'Expressions', 'Arrow Functions', 'Closures', 'Scope & Hoisting', 'Callbacks', 'IIFE'],
  },
  {
    id: 6,
    title: 'Arrays',
    step: 'Step 6',
    subtitle: 'Ordered collections of data',
    content:
      'Work with JavaScript arrays using powerful built-in methods. Learn map, filter, reduce, find, forEach, and more. Master destructuring, the spread operator, and common array patterns.',
    icon: 'List',
    color: '#ec4899',
    topics: ['push / pop / shift', 'map & filter', 'reduce', 'find & includes', 'Destructuring', 'Spread / Rest', 'Sorting'],
  },
  {
    id: 7,
    title: 'Objects',
    step: 'Step 7',
    subtitle: 'Key-value pairs and prototypes',
    content:
      'Understand objects as the core data structure. Learn about properties, methods, the this keyword, computed properties, object destructuring, and the prototype chain that powers JavaScript inheritance.',
    icon: 'Layers',
    color: '#f97316',
    topics: ['Properties & Methods', 'this keyword', 'Destructuring', 'Computed Keys', 'Object.keys/values', 'Prototypes', 'Classes'],
  },
  {
    id: 8,
    title: 'DOM Manipulation',
    step: 'Step 8',
    subtitle: 'Making web pages come alive',
    content:
      'Bridge JavaScript with the browser. Select elements, handle events, modify styles and content dynamically. Understand the DOM tree, event bubbling, delegation, and how to build interactive UIs from scratch.',
    icon: 'Monitor',
    color: '#14b8a6',
    topics: ['querySelector', 'addEventListener', 'innerHTML & textContent', 'classList', 'Event Bubbling', 'Event Delegation', 'Dynamic Creation'],
  },
  {
    id: 9,
    title: 'Async JavaScript',
    step: 'Step 9',
    subtitle: 'Handling time and uncertainty',
    content:
      'Master asynchronous patterns. Start with callbacks, then Promises, and finally async/await. Understand the event loop, microtasks vs macrotasks, and how to fetch data from APIs without blocking the UI.',
    icon: 'Clock',
    color: '#a855f7',
    topics: ['Callbacks', 'Promises', 'async / await', 'fetch API', 'Event Loop', 'try / catch', 'Promise.all'],
  },
  {
    id: 10,
    title: 'ES6+ & Beyond',
    step: 'Step 10',
    subtitle: 'Modern JavaScript superpowers',
    content:
      'Explore the modern features that make JavaScript elegant: modules, template literals, optional chaining, nullish coalescing, generators, symbols, iterators, and the ever-evolving ECMAScript standard.',
    icon: 'Rocket',
    color: '#e11d48',
    topics: ['Modules (import/export)', 'Template Literals', 'Optional Chaining', 'Nullish Coalescing', 'Generators', 'Symbols', 'Proxy & Reflect'],
  },
];
