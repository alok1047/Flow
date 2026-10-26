export const arenaQuestions = {
  javascript: {
    history: [
      {
        question: "Who is the creator of the JavaScript programming language?",
        code: null,
        options: ["James Gosling", "Brendan Eich", "Dennis Ritchie", "Bjarne Stroustrup"],
        correct: 1,
        explanation: "Brendan Eich created JavaScript in May 1995 while working at Netscape Communications."
      },
      {
        question: "How many days did it take to develop the first version of JavaScript (Mocha)?",
        code: null,
        options: ["10 days", "30 days", "100 days", "6 months"],
        correct: 0,
        explanation: "Brendan Eich wrote the prototype of Mocha (later JavaScript) in just 10 days in May 1995."
      },
      {
        question: "Which trademark agreement led to Netscape naming the language 'JavaScript'?",
        code: null,
        options: ["Agreement with Sun Microsystems", "Agreement with Microsoft", "Agreement with ECMA", "Agreement with Apple"],
        correct: 0,
        explanation: "Netscape partnered with Sun Microsystems (owners of Java) to rename LiveScript to JavaScript as a marketing move."
      }
    ],
    variables: [
      {
        question: "What is the output of the following hoisting code snippet?",
        code: "console.log(x);\nvar x = 100;",
        options: ["undefined", "100", "ReferenceError", "NaN"],
        correct: 0,
        explanation: "Declarations using 'var' are hoisted but not their initializations, making it evaluate to undefined."
      },
      {
        question: "Which declaration keyword has block scope and throws a ReferenceError if accessed before its declaration?",
        code: "console.log(y);\nlet y = 200;",
        options: ["var", "let", "global", "module"],
        correct: 1,
        explanation: "'let' and 'const' variables reside in a Temporal Dead Zone until their line of declaration is executed."
      }
    ],
    'data types': [
      {
        question: "What is the output of evaluating 'typeof null' in JavaScript?",
        code: "typeof null",
        options: ["'null'", "'undefined'", "'object'", "'symbol'"],
        correct: 2,
        explanation: "In JavaScript, 'typeof null' returns 'object'. This is a historical bug in the original language design."
      },
      {
        question: "Which data type is primitive, immutable, and represents unique identifiers?",
        code: "const id1 = Symbol('id');\nconst id2 = Symbol('id');\nconsole.log(id1 === id2);",
        options: ["String", "Symbol", "Object", "Boolean"],
        correct: 1,
        explanation: "Symbols are unique, immutable primitives often used as private object keys."
      }
    ],
    operators: [
      {
        question: "What does the expression '[] + []' coerce to in JavaScript?",
        code: "[] + []",
        options: ["'[]'", "0", "'' (empty string)", "undefined"],
        correct: 2,
        explanation: "Empty arrays are coerced to empty strings. Concatenating two empty strings yields an empty string."
      },
      {
        question: "What is the result of the following loose vs strict comparison?",
        code: "console.log('5' == 5, '5' === 5);",
        options: ["true true", "true false", "false true", "false false"],
        correct: 1,
        explanation: "Loose equality (==) coerces types first, making '5' equal to 5. Strict equality (===) checks types and yields false."
      }
    ],
    loops: [
      {
        question: "Which loop guarantees execution of its body block at least once before testing condition?",
        code: null,
        options: ["for loop", "while loop", "do...while loop", "for...in loop"],
        correct: 2,
        explanation: "do...while loops evaluate the code block first, then check the condition."
      }
    ],
    numbers: [
      {
        question: "What is the result of the following floating-point expression due to IEEE 754 precision errors?",
        code: "0.1 + 0.2 === 0.3",
        options: ["true", "false", "undefined", "TypeError"],
        correct: 1,
        explanation: "0.1 + 0.2 equals 0.30000000000000004 in IEEE 754 binary arithmetic, which is loosely/strictly unequal to 0.3."
      }
    ],
    strings: [
      {
        question: "What is the value of 'str' after attempting modification?",
        code: "let str = 'Hello';\nstr[0] = 'M';\nconsole.log(str);",
        options: ["'Mello'", "'Hello'", "TypeError", "'M'"],
        correct: 1,
        explanation: "JavaScript strings are immutable. Attempting to assign directly to a character index fails silently."
      }
    ]
  },
  react: {
    components: [
      {
        question: "Why must React component names start with an uppercase letter?",
        code: null,
        options: ["To distinguish them from HTML elements", "Required by ES6 standards", "Required by Node bundlers", "To allow component styling"],
        correct: 0,
        explanation: "React relies on capitalization (e.g. <Card /> vs <div />) to differentiate custom components from standard DOM tags in JSX."
      }
    ],
    props: [
      {
        question: "Are component props mutable or read-only inside the component?",
        code: null,
        options: ["Mutable", "Read-only (Immutable)", "Mutable only via hooks", "Depends on state"],
        correct: 1,
        explanation: "React props are strictly read-only. Components must act as pure functions with respect to their props."
      }
    ],
    state: [
      {
        question: "Is state updates via useState synchronous or asynchronous?",
        code: "const [val, setVal] = useState(0);\nconst click = () => {\n  setVal(val + 1);\n  console.log(val); // What is printed?\n}",
        options: ["Synchronous (prints updated val)", "Asynchronous (prints old val)", "Instantaneous", "Depends on server latency"],
        correct: 1,
        explanation: "React state updates are batched and scheduled asynchronously. Accessing state immediately after setVal returns the old value."
      }
    ],
    hooks: [
      {
        question: "Which hook should you use to execute side effects like fetching data or direct DOM manipulations?",
        code: null,
        options: ["useState", "useMemo", "useEffect", "useRef"],
        correct: 2,
        explanation: "The useEffect hook is designed to run side effects in functional components after rendering."
      }
    ]
  },
  backend: {
    apis: [
      {
        question: "What HTTP method should be used for creating a resource under RESTful routing conventions?",
        code: null,
        options: ["GET", "POST", "PUT", "DELETE"],
        correct: 1,
        explanation: "POST requests submit entity data to create new resources on the server."
      }
    ],
    express: [
      {
        question: "How do you apply middleware globally across all routes in an Express application?",
        code: "const express = require('express');\nconst app = express();",
        options: ["app.use(middleware)", "app.get(middleware)", "app.global(middleware)", "app.all(middleware)"],
        correct: 0,
        explanation: "app.use() registers middlewares globally in the application execution pipeline."
      }
    ],
    authentication: [
      {
        question: "What does JWT stand for in token-based user authentication systems?",
        code: null,
        options: ["JSON Web Token", "Java Web Template", "Javascript Working Task", "Joint Web Transport"],
        correct: 0,
        explanation: "JWT stands for JSON Web Token, which securely transmits user claims as a JSON object."
      }
    ],
    databases: [
      {
        question: "In relational databases, what is an 'index' primarily used for?",
        code: null,
        options: ["To encrypt sensitive table data", "To speed up data retrieval queries", "To establish parent-child primary keys", "To backup transactions automatically"],
        correct: 1,
        explanation: "Indexes speed up data lookups by mapping search keys to physical disk addresses, at the cost of disk space and write speed."
      }
    ]
  }
};

export function getArenaQuestions(subject, topic) {
  // Normalize parameters
  const subjKey = subject?.toLowerCase() || 'javascript';
  const topicKey = topic?.toLowerCase() || 'history';

  const subjObj = arenaQuestions[subjKey] || arenaQuestions.javascript;
  
  // Try to find exact topic matching
  let list = subjObj[topicKey];
  if (!list) {
    // If not found, try to look up loosely
    const keys = Object.keys(subjObj);
    const matchedKey = keys.find(k => k.includes(topicKey) || topicKey.includes(k));
    list = matchedKey ? subjObj[matchedKey] : subjObj[keys[0]];
  }
  
  return list || [];
}
