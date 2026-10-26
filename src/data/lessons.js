export const lessons = [
  {
    id: 'why-js',
    title: 'Why JavaScript Exists',
    description: 'Understand the origin story and purpose of JavaScript',
    icon: 'Lightbulb',
    xp: 50,
    duration: '10 min',
    difficulty: 'Beginner',
    color: '#f59e0b',
    content: {
      sections: [
        {
          type: 'intro',
          title: 'The Web Before JavaScript',
          body: 'In the early 1990s, the World Wide Web was a very quiet, static place. Web pages were essentially electronic brochures. HTML could display formatted text and load images, but it was a strictly one-way street. Users could click links to go to another page, but that was it. There was no animation, no instant feedback, and no interactive logic.'
        },
        {
          type: 'concept',
          title: 'The Static Web Problem',
          body: 'Without clientside script execution, even the simplest actions required sending a full request to a remote server. For instance, if you filled out a long form and made a single typo, you had to submit the form, wait for the server to process it, and wait for it to send back a fresh page indicating the error.',
          analogy: 'Imagine a library where all the books are glued shut. You can look at the covers and read a page if it is open, but you cannot search, turn pages, or interact with anything without asking the librarian to bring you a new copy.'
        },
        {
          type: 'concept',
          title: 'The Solution: Netscape & Brendan Eich',
          body: 'In 1995, Netscape hired Brendan Eich to design and implement a programming language that could run directly inside their Netscape Navigator browser. Eich famously created the first version of the language in just 10 days! Initially named Mocha, then LiveScript, it was eventually renamed JavaScript to ride the wave of Java\'s popularity at the time.',
          analogy: 'JavaScript is like giving the books in the library a brain. Now, a book can open itself, rearrange its pages, double check the form input you write, and update itself live.'
        },
        {
          type: 'codeExample',
          title: 'Your First Interactive Script',
          language: 'javascript',
          code: `// Select a button element and listen for clicks
const button = document.querySelector('button');
button.addEventListener('click', () => {
  // Directly change the web page content without a reload
  document.body.style.backgroundColor = '#1e1b4b';
  alert('Welcome to the interactive web!');
});`,
          explanation: 'This code listens for a click event on a button and dynamically updates the document\'s background color. This happens completely within the user\'s browser.'
        },
        {
          type: 'funFact',
          body: 'JavaScript has very little in common with Java. The name was chosen primarily as a marketing stunt by Netscape and Sun Microsystems. To this day, the trademark is owned by Oracle!'
        },
        {
          type: 'realWorld',
          title: 'Where JavaScript Runs Today',
          body: 'Originally confined to browsers, JavaScript is now run virtually everywhere. Thanks to Node.js (and modern engines like V8), it is used on backend servers, mobile devices (React Native), desktop applications (Electron), smart appliances, and even IoT devices.'
        },
        {
          type: 'summary',
          points: [
            'JavaScript was created in 1995 by Brendan Eich in just 10 days.',
            'Its primary purpose was to make static HTML pages interactive and responsive.',
            'It runs natively in every web browser and doesn\'t require a server roundtrip for basic logic.',
            'Today, it is a universal programming language powering both frontend and backend systems.'
          ]
        }
      ],
      estimatedReadTime: '8 min'
    },
    quiz: [
      {
        question: 'Why was JavaScript originally created?',
        options: ['To replace HTML', 'To make web pages interactive', 'To build mobile apps', 'To manage databases'],
        correct: 1,
        explanation: 'JavaScript was created in 1995 to add dynamic interactivity to static HTML web pages.'
      },
      {
        question: 'Where does JavaScript run today?',
        options: ['Only in browsers', 'Only on servers', 'Everywhere — browsers, servers, mobile, desktop', 'Only on Windows'],
        correct: 2,
        explanation: 'Thanks to Node.js, React Native, and modern JS engines, JavaScript now runs on browsers, servers, mobile, and desktop.'
      },
      {
        question: 'Who is the creator of JavaScript?',
        options: ['Bill Gates', 'Brendan Eich', 'Linus Torvalds', 'Tim Berners-Lee'],
        correct: 1,
        explanation: 'Brendan Eich created JavaScript in 1995 while working at Netscape.'
      },
      {
        question: 'How many days did it take to create the first version of JavaScript?',
        options: ['10 days', '30 days', '6 months', '1 year'],
        correct: 0,
        explanation: 'Brendan Eich designed and built the first prototype of JavaScript in just 10 days in May 1995.'
      },
      {
        question: 'What was the original name of JavaScript when it was first created?',
        options: ['LiveScript', 'Mocha', 'ECMAScript', 'JavaLite'],
        correct: 1,
        explanation: 'The project was initially codenamed Mocha, then renamed LiveScript, and finally launched as JavaScript.'
      }
    ]
  },
  {
    id: 'variables',
    title: 'Variables',
    description: 'Learn how to store and manage data',
    icon: 'Package',
    xp: 75,
    duration: '15 min',
    difficulty: 'Beginner',
    color: '#3b82f6',
    content: {
      sections: [
        {
          type: 'intro',
          title: 'Storing Information',
          body: 'Programs need to remember things. Whether it\'s a user\'s name, their high score, or the items in their shopping cart, programs must store and update data. In programming, we do this using variables.'
        },
        {
          type: 'concept',
          title: 'What is a Variable?',
          body: 'A variable is a named container for storing a data value. You declare a variable, give it a name (identifier), and put a value in it. Later, you can refer to that name to read or change the value.',
          analogy: 'Variables are like labeled jars in a kitchen. The label is the variable name, and what\'s inside is the value. `let sugar = "sweet"` — you labeled a jar "sugar" and put the word "sweet" inside.'
        },
        {
          type: 'concept',
          title: 'let vs const vs var',
          body: 'Modern JavaScript gives us two primary ways to declare variables: `let` and `const`. `let` is used for variables whose values can change (reassigned). `const` (short for constant) is used for variables whose values will never change. `var` is the legacy keyword which has issues with scoping and hoisting; it should be avoided in modern code.',
          analogy: '`const` is like writing with a permanent marker — once written, it stays. `let` is like writing with a pencil — you can erase and write something else. `var` is like writing on a whiteboard in a busy hallway — it can be read or modified by unexpected passes.'
        },
        {
          type: 'codeExample',
          title: 'Declaring and Reassigning Variables',
          language: 'javascript',
          code: `const username = 'Alice'; // Constant value, cannot be reassigned
let userScore = 100;     // Variable value, can change

userScore = 120; // Reassignment is allowed for let
// username = 'Bob'; // ERROR! TypeError: Assignment to constant variable.`,
          explanation: 'Use const by default for safety. Only use let when you explicitly plan to change the value of the variable.'
        },
        {
          type: 'warning',
          body: 'Using const does NOT make objects or arrays immutable. It only prevents you from reassigning the variable itself. You can still modify the keys of a const object or elements of a const array!'
        },
        {
          type: 'commonMistake',
          title: 'Invalid Variable Naming',
          wrong: 'let 1stPlace = "Winner";\nlet user-name = "Bob";',
          right: 'let firstPlace = "Winner";\nlet userName = "Bob";',
          explanation: 'Variable names cannot start with numbers and cannot contain hyphens. In JS, camelCase is the standard naming convention.'
        },
        {
          type: 'summary',
          points: [
            'Variables store data values under a labeled name.',
            'Always default to using const for variables that shouldn\'t change.',
            'Use let when you need to overwrite or reassign a variable.',
            'Avoid var in modern JavaScript due to its scoping quirks.',
            'Variable names must start with a letter, _, or $, and are case-sensitive.'
          ]
        }
      ],
      estimatedReadTime: '10 min'
    },
    quiz: [
      {
        question: 'What is the main difference between let and const?',
        options: ['let is scoped to functions, const is global', 'let can be reassigned, const cannot', 'const is only for numbers', 'let cannot be declared inside loops'],
        correct: 1,
        explanation: 'Variables declared with let can be reassigned to new values, while const variables are read-only after assignment.'
      },
      {
        question: 'Which of the following is an INVALID variable name?',
        options: ['_temp', '$total', '99players', 'playerScore'],
        correct: 2,
        explanation: 'Variable names cannot start with a number. "99players" is invalid.'
      },
      {
        question: 'What happens when you try to reassign a variable declared with const?',
        options: ['It silently does nothing', 'It throws a TypeError', 'It creates a new variable', 'It changes it to a let variable'],
        correct: 1,
        explanation: 'Attempting to reassign a const variable throws a TypeError: Assignment to constant variable.'
      },
      {
        question: 'What is the scope of variables declared with let and const?',
        options: ['Function scope', 'Global scope only', 'Block scope', 'They have no scope'],
        correct: 2,
        explanation: 'Both let and const are block-scoped, meaning they only exist inside the pair of curly braces {} they were defined in.'
      },
      {
        question: 'Which keyword should be avoided in modern JavaScript variable declarations?',
        options: ['const', 'let', 'var', 'define'],
        correct: 2,
        explanation: '`var` should be avoided because it is function-scoped rather than block-scoped and undergoes hoisting, which can lead to bugs.'
      }
    ]
  },
  {
    id: 'data-types',
    title: 'Data Types',
    description: 'Explore the 8 data types in JavaScript',
    icon: 'Dna',
    xp: 100,
    duration: '20 min',
    difficulty: 'Beginner',
    color: '#8b5cf6',
    content: {
      sections: [
        {
          type: 'intro',
          title: 'Understanding Values',
          body: 'In JavaScript, values can be of different types depending on what kind of information they represent. JavaScript is a dynamically-typed language, meaning variables don\'t have fixed types; instead, the values stored in them do.'
        },
        {
          type: 'concept',
          title: 'Primitives vs Objects',
          body: 'Values are divided into two main categories: Primitives and Objects. Primitives are simple, single values like numbers or strings, and they are immutable (cannot be changed). Objects are collections of values (key-value pairs) or lists, and they are mutable.',
          analogy: 'Primitives are like individual sticky notes — they hold one simple value. If you want to change it, you write a new note. Objects are like notebooks — you can add pages, cross out lines, and change details, but the address of the notebook stays the same.'
        },
        {
          type: 'concept',
          title: 'The 7 Primitive Types',
          body: 'JavaScript has 7 primitive types: String (text), Number (integers/decimals), Boolean (true/false), undefined (declared but no value), null (intentional empty value), Symbol (unique identifier), and BigInt (extremely large integers).',
          analogy: 'Undefined is like a box that is completely empty. Null is like a box that was intentionally set to have nothing in it. They look similar, but their meaning is different.'
        },
        {
          type: 'codeExample',
          title: 'Working with typeof',
          language: 'javascript',
          code: `console.log(typeof "Hello"); // "string"
console.log(typeof 42);      // "number"
console.log(typeof true);    // "boolean"
console.log(typeof undefined); // "undefined"

console.log(typeof null);    // "object" <- FAMOUS BUG!
console.log(typeof [1, 2]);   // "object"`,
          explanation: 'The typeof operator returns a string representing the type. Note that typeof null returns "object", which is a historical bug in the language.'
        },
        {
          type: 'warning',
          body: 'Since arrays are technically specialized objects under the hood, `typeof []` will return "object". To correctly check if a value is an array, use `Array.isArray(value)`.'
        },
        {
          type: 'summary',
          points: [
            'JavaScript has 8 data types: 7 primitives and 1 object type.',
            'Primitives (String, Number, Boolean, null, undefined, Symbol, BigInt) are immutable and stored by value.',
            'Objects (including Arrays and Functions) are stored by reference in memory.',
            'typeof is a built-in operator used to check value types.',
            'typeof null returning "object" is a well-known legacy bug.'
          ]
        }
      ],
      estimatedReadTime: '12 min'
    },
    quiz: [
      {
        question: 'What does the typeof operator return for null?',
        options: ['"null"', '"undefined"', '"object"', '"boolean"'],
        correct: 2,
        explanation: 'Due to a historical design quirk in the first version of JS, typeof null returns "object".'
      },
      {
        question: 'How many primitive data types exist in JavaScript?',
        options: ['5', '6', '7', '8'],
        correct: 2,
        explanation: 'JavaScript has 7 primitives: String, Number, Boolean, undefined, null, Symbol, and BigInt.'
      },
      {
        question: 'Which of the following is NOT a primitive data type?',
        options: ['Boolean', 'Number', 'Array', 'BigInt'],
        correct: 2,
        explanation: 'An Array is a type of Object, not a primitive.'
      },
      {
        question: 'What is the result of typeof typeof 100?',
        options: ['"number"', '"string"', '"undefined"', '"object"'],
        correct: 1,
        explanation: 'typeof 100 evaluates to the string "number". Then typeof "number" evaluates to "string".'
      },
      {
        question: 'How are objects stored and copied in variables?',
        options: ['By value', 'By reference', 'As plain text', 'They cannot be copied'],
        correct: 1,
        explanation: 'Objects are stored by reference. When you copy an object variable, you copy the reference (address) in memory, not the object itself.'
      }
    ]
  },
  {
    id: 'operators',
    title: 'Operators',
    description: 'Master equality, comparison, and logical operators',
    icon: 'Settings',
    xp: 75,
    duration: '15 min',
    difficulty: 'Beginner',
    color: '#ef4444',
    content: {
      sections: [
        {
          type: 'intro',
          title: 'Comparing and Combining',
          body: 'Operators allow us to perform calculations, compare values, and make decisions in our code. They are the gears and levers that process data.'
        },
        {
          type: 'concept',
          title: 'Loose vs Strict Equality',
          body: 'JavaScript has two equality operators: `==` (loose equality) and `===` (strict equality). Loose equality tries to perform type coercion (converting types) before comparing. Strict equality compares both the value AND the type without converting them.',
          analogy: 'Loose equality is like asking: "Do these look similar?" Strict equality is like asking: "Are these identical?" A $5 bill and 5 metal coins represent the same value (==), but they are not the same physical medium (===).'
        },
        {
          type: 'concept',
          title: 'Logical Operators & Short Circuiting',
          body: 'Logical operators `&&` (AND), `||` (OR), and `!` (NOT) help combine Boolean conditions. In JavaScript, `&&` and `||` short-circuit: they evaluate from left to right and stop as soon as the outcome is determined. They return the actual value that stopped the evaluation.',
          analogy: 'AND (&&) is like a double-lock door. If the first key fails, you don\'t even try the second. OR (||) is like two doors side-by-side. If the first door is open, you walk right in without checking the second.'
        },
        {
          type: 'codeExample',
          title: 'Short Circuit Examples',
          language: 'javascript',
          code: `const userName = '';
const displayName = userName || 'Guest'; // 'Guest' (short circuits at 'Guest')

console.log("5" == 5);  // true (type coerced string to number)
console.log("5" === 5); // false (different types: string vs number)`,
          explanation: 'Use strict equality (===) in 99% of cases to avoid type coercion bugs. Logical OR (||) is useful for fallback values.'
        },
        {
          type: 'tip',
          body: 'Modern JavaScript also has the Nullish Coalescing Operator `??`. Unlike `||`, it only falls back if the left value is null or undefined (allowing empty strings and 0 to pass through).'
        },
        {
          type: 'summary',
          points: [
            'Strict equality (===) checks both value and type, preventing type coercion.',
            'Loose equality (==) coerces types, which can lead to unpredictable bugs.',
            'Logical AND (&&) returns the first falsy value or the last value.',
            'Logical OR (||) returns the first truthy value or the last value.',
            'Nullish coalescing (??) is ideal for fallbacks since it only triggers for null and undefined.'
          ]
        }
      ],
      estimatedReadTime: '9 min'
    },
    quiz: [
      {
        question: 'What is the value of "5" == 5?',
        options: ['true', 'false', 'undefined', 'TypeError'],
        correct: 0,
        explanation: 'Loose equality (==) coerces the string "5" into the number 5, making the comparison evaluate to true.'
      },
      {
        question: 'What is the value of "5" === 5?',
        options: ['true', 'false', 'undefined', 'TypeError'],
        correct: 1,
        explanation: 'Strict equality (===) checks both value and type. Since string "5" has a different type than number 5, it returns false.'
      },
      {
        question: 'What does the logical expression: false || "hello" evaluate to?',
        options: ['true', 'false', '"hello"', 'undefined'],
        correct: 2,
        explanation: 'The OR operator (||) evaluates left to right. Since the first value is falsy, it continues and returns the second value, which is "hello".'
      },
      {
        question: 'What does short-circuiting mean in logical operations?',
        options: ['The program crashes immediately', 'Evaluation stops as soon as the final result is guaranteed', 'Numbers are converted to binary', 'All variables are set to true'],
        correct: 1,
        explanation: 'Short-circuiting means the evaluation of a logical expression stops as soon as the result is determined, skipping any remaining checks.'
      },
      {
        question: 'Which operator checks only for null or undefined values?',
        options: ['||', '&&', '??', '==='],
        correct: 2,
        explanation: 'The nullish coalescing operator (??) only falls back if the left-hand side is null or undefined.'
      }
    ]
  },
  {
    id: 'loops',
    title: 'Loops',
    description: 'Repeat actions with for, while, and do-while',
    icon: 'RefreshCw',
    xp: 100,
    duration: '20 min',
    difficulty: 'Beginner',
    color: '#22c55e',
    content: {
      sections: [
        {
          type: 'intro',
          title: 'Automating Repetition',
          body: 'Computers excel at repeating tasks. Rather than copy-pasting the same line of code 100 times, we use loops to repeat actions until a specific condition is met.'
        },
        {
          type: 'concept',
          title: 'The classic for Loop',
          body: 'The `for` loop is ideal when you know how many times you want to iterate. It has three parts: initialization (create counter), condition (keep going if true), and update (increment counter).',
          analogy: 'A for loop is like running laps around a track. You set a goal (5 laps), start at lap 0, add 1 lap every time you cross the line, and stop when you hit your target.'
        },
        {
          type: 'concept',
          title: 'while vs do...while',
          body: 'A `while` loop checks the condition first and executes the body as long as it is true. A `do...while` loop executes the body first, and then checks the condition. This means a do...while loop is guaranteed to run at least once.',
          analogy: 'A while loop is like checking if you have gas before driving. If you don\'t, you never start. A do...while loop is like taking a bite of a cookie, and then checking if you want another bite.'
        },
        {
          type: 'codeExample',
          title: 'Loop Implementations',
          language: 'javascript',
          code: `// For loop
for (let i = 0; i < 3; i++) {
  console.log('Lap:', i);
}

// While loop
let count = 0;
while (count < 3) {
  console.log('Count:', count);
  count++;
}`,
          explanation: 'Both blocks will log 3 times. Be careful: always update the counter in a while loop, or you will cause an infinite loop!'
        },
        {
          type: 'warning',
          body: 'An infinite loop occurs when the condition never evaluates to false. This will lock up the browser\'s thread, making the page completely freeze and require a tab close!'
        },
        {
          type: 'summary',
          points: [
            'Loops execute a block of code repeatedly.',
            'Use a for loop when you know the number of iterations in advance.',
            'Use a while loop when iterating based on a changing condition.',
            'A do...while loop always executes its code block at least once.',
            'Always ensure the loop has a termination condition to prevent freezing.'
          ]
        }
      ],
      estimatedReadTime: '10 min'
    },
    quiz: [
      {
        question: 'Which loop is guaranteed to run at least once?',
        options: ['for', 'while', 'do...while', 'for...in'],
        correct: 2,
        explanation: 'A do...while loop evaluates the condition at the end of the loop body, guaranteeing at least one execution.'
      },
      {
        question: 'Which statement is used to terminate a loop prematurely?',
        options: ['continue', 'break', 'return', 'exit'],
        correct: 1,
        explanation: 'The `break` statement immediately exits the loop block, skipping all remaining iterations.'
      },
      {
        question: 'Which statement skips the current iteration and jumps to the next one?',
        options: ['continue', 'break', 'skip', 'next'],
        correct: 0,
        explanation: 'The `continue` statement stops the current iteration and jumps immediately to the loop\'s update/condition step.'
      },
      {
        question: 'What causes an infinite loop?',
        options: ['Not declaring variables', 'A condition that is always true', 'Using const instead of let', 'Dividing by zero'],
        correct: 1,
        explanation: 'If the loop condition never becomes false, the loop runs infinitely, which causes the page to crash.'
      },
      {
        question: 'Which loop is best suited for looping through the keys of an object?',
        options: ['for...in', 'for...of', 'while', 'do...while'],
        correct: 0,
        explanation: 'The `for...in` loop is specifically designed to iterate over all enumerable property keys of an object.'
      }
    ]
  },
  {
    id: 'numbers',
    title: 'Numbers',
    description: 'Understand JavaScript\'s number system and its quirks',
    icon: 'Hash',
    xp: 75,
    duration: '15 min',
    difficulty: 'Beginner',
    color: '#06b6d4',
    content: {
      sections: [
        {
          type: 'intro',
          title: 'JavaScript Numbers',
          body: 'Numbers in JavaScript are simple on the surface, but they hide some fascinating quirks. Unlike many other programming languages, JavaScript doesn\'t distinguish between integers and decimal numbers.'
        },
        {
          type: 'concept',
          title: 'The Double-Precision Float',
          body: 'All numbers in JavaScript are stored as 64-bit floating point numbers (IEEE 754). This means there is no separate "int" or "float" type. Whether you write 5 or 5.5, the computer processes it using decimal representation.',
          analogy: 'Imagine a parking lot where every spot is the same size — whether you are parking a bicycle or a massive SUV, it takes up a full standard slot.'
        },
        {
          type: 'concept',
          title: 'Floating Point Precision (0.1 + 0.2)',
          body: 'Computers store numbers in binary (zeros and ones). Certain decimal fractions like 0.1 or 0.2 cannot be represented precisely in binary, leading to rounding errors. As a result, `0.1 + 0.2` actually equals `0.30000000000000004`.',
          analogy: 'It is like trying to write the fraction 1/3 as a decimal number: you get 0.333333... repeating forever. You must round it off eventually, losing absolute precision.'
        },
        {
          type: 'codeExample',
          title: 'Working with Precision',
          language: 'javascript',
          code: `console.log(0.1 + 0.2 === 0.3); // false

// How to safely compare floats:
const result = 0.1 + 0.2;
const isCloseEnough = Math.abs(result - 0.3) < Number.EPSILON;
console.log(isCloseEnough); // true`,
          explanation: 'Number.EPSILON represents the smallest difference between 1 and the next floating point number, making it ideal for checking close comparisons.'
        },
        {
          type: 'funFact',
          body: 'NaN stands for "Not a Number", but checking its type with typeof yields "number". NaN represents an invalid mathematical result, such as trying to compute 0 / 0 or parsing "hello" as a number.'
        },
        {
          type: 'summary',
          points: [
            'All numbers in JavaScript are double-precision 64-bit floats.',
            'There is no separate integer type in standard JavaScript.',
            'Rounding errors occur in binary representation (e.g. 0.1 + 0.2).',
            'Use Math.abs(a - b) < Number.EPSILON to compare floats safely.',
            'NaN is mathematically invalid, but its type is still "number".'
          ]
        }
      ],
      estimatedReadTime: '10 min'
    },
    quiz: [
      {
        question: 'What is the return value of: 0.1 + 0.2 === 0.3?',
        options: ['true', 'false', 'undefined', 'NaN'],
        correct: 1,
        explanation: 'Due to floating-point rounding errors in binary, 0.1 + 0.2 evaluates to 0.30000000000000004, which is not equal to 0.3.'
      },
      {
        question: 'What is the type of JavaScript\'s numbers?',
        options: ['32-bit Integer', '64-bit Floating Point', '8-bit Decimal', 'Complex Float'],
        correct: 1,
        explanation: 'JavaScript stores all numbers as double-precision 64-bit floating point format (IEEE 754).'
      },
      {
        question: 'What does typeof NaN return?',
        options: ['"NaN"', '"undefined"', '"number"', '"null"'],
        correct: 2,
        explanation: 'NaN stands for "Not a Number", but in the JS type system, it represents a numeric value that is invalid, so typeof NaN is "number".'
      },
      {
        question: 'How do you check if a calculation is safely equal to a float?',
        options: ['Using ==', 'Using ===', 'Using Number.EPSILON', 'Using Math.floor()'],
        correct: 2,
        explanation: 'Compare the absolute difference of the numbers to Number.EPSILON. If it is smaller, they are practically equal.'
      },
      {
        question: 'What is the result of dividing a positive number by 0 in JavaScript?',
        options: ['Throws a DivisionByZero error', 'Infinity', 'NaN', '0'],
        correct: 1,
        explanation: 'Unlike other languages that crash, dividing a non-zero number by zero returns the special value Infinity.'
      }
    ]
  },
  {
    id: 'strings',
    title: 'Strings',
    description: 'Work with text in JavaScript',
    icon: 'FileText',
    xp: 75,
    duration: '15 min',
    difficulty: 'Beginner',
    color: '#ec4899',
    content: {
      sections: [
        {
          type: 'intro',
          title: 'Text in Programming',
          body: 'Strings are sequences of characters used to represent text. In JavaScript, there are multiple ways to construct and manipulate strings, enabling rich text formatting and layout.'
        },
        {
          type: 'concept',
          title: 'Quotes vs Backticks',
          body: 'You can define strings using single quotes (\'\'), double quotes (""), or backticks (``). Backticks (called template literals) are powerful because they allow you to write multi-line strings and embed variables directly using \${expression}.',
          analogy: 'Single and double quotes are like simple text messages. Backticks are like template letters where you can fill in variables dynamically.'
        },
        {
          type: 'concept',
          title: 'Strings are Immutable',
          body: 'Once a string is created, it cannot be modified. If you try to rewrite a single letter, like `str[0] = "X"`, the operation silently fails. All string operations return a brand NEW string instead.',
          analogy: 'Strings are like printed newspapers. You can\'t go in and erase a typo on page 1 of the printed edition; you have to print a completely revised version instead.'
        },
        {
          type: 'codeExample',
          title: 'Template Literals and Methods',
          language: 'javascript',
          code: `const name = 'Alice';
const greeting = \`Hello, \${name}!\`; // Template literal

const original = 'hello';
const modified = original.toUpperCase(); // 'HELLO'
console.log(original); // 'hello' (unchanged!)`,
          explanation: 'Backticks allow expressions inside \${}. Notice that calling methods like toUpperCase() does not change the original variable.'
        },
        {
          type: 'tip',
          body: 'Common string methods include `.slice(start, end)` to get parts of a string, `.split(separator)` to cut it into an array, and `.includes(search)` to check if a word exists in it.'
        },
        {
          type: 'summary',
          points: [
            'Strings store characters and can be declared with quotes or backticks.',
            'Template literals (backticks) support string interpolation and multi-line layouts.',
            'Strings are immutable; methods return new strings rather than mutating.',
            'Use helper methods like slice, split, trim, and includes for common edits.'
          ]
        }
      ],
      estimatedReadTime: '8 min'
    },
    quiz: [
      {
        question: 'What is the outcome of: let str = "Cat"; str[0] = "B";?',
        options: ['str becomes "Bat"', 'It throws an error', 'str remains "Cat" (fails silently)', 'str becomes "B"'],
        correct: 2,
        explanation: 'Strings are immutable. You cannot modify individual characters of an existing string; it fails silently unless in strict mode, where it throws.'
      },
      {
        question: 'Which string declaration style supports embedding expressions?',
        options: ['Single Quotes (\'\')', 'Double Quotes ("")', 'Backticks (``)', 'All of them'],
        correct: 2,
        explanation: 'Backticks (template literals) allow variables and expressions inside `${expression}`.'
      },
      {
        question: 'What does "JavaScript".slice(4, 10) return?',
        options: ['"Java"', '"Script"', '"Scripta"', '"JavaS"'],
        correct: 1,
        explanation: '.slice(4, 10) extracts characters from index 4 up to (but not including) index 10, resulting in "Script".'
      },
      {
        question: 'How do you convert a string "a-b-c" into the array ["a", "b", "c"]?',
        options: ['split("-")', 'slice("-")', 'join("-")', 'concat("-")'],
        correct: 0,
        explanation: 'The `.split(separator)` method splits a string into an array of substrings based on a specified separator.'
      },
      {
        question: 'Which method should you use to check if a string contains a specific word?',
        options: ['searchFor()', 'find()', 'includes()', 'has()'],
        correct: 2,
        explanation: 'The `.includes()` method returns true if a string contains the specified characters, and false otherwise.'
      }
    ]
  }
];
