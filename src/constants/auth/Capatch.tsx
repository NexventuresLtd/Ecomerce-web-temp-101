    // Logic challenges
export // Logic challenges
const challenges = [
  // --- SEQUENCE (12) ---
  {
    type: 'sequence',
    question: 'What comes next in the sequence?',
    sequence: [3, 6, 12, 24, '?'],
    options: [36, 48, 30, 60],
    correct: 1,
    explanation: 'Each number doubles.'
  },
  {
    type: 'sequence',
    question: 'Fill the missing number:',
    sequence: [1, 1, 2, 3, 5, '?'],
    options: [7, 8, 9, 6],
    correct: 1,
    explanation: 'Fibonacci sequence: next is 8.'
  },
  {
    type: 'sequence',
    question: 'What is next?',
    sequence: [2, 4, 6, 8, '?'],
    options: [9, 10, 12, 11],
    correct: 1,
    explanation: 'Even numbers: +2 each step.'
  },
  {
    type: 'sequence',
    question: 'Find the next term:',
    sequence: [5, 10, 20, 40, '?'],
    options: [45, 60, 80, 100],
    correct: 2,
    explanation: 'Each number doubles → next is 80.'
  },
  {
    type: 'sequence',
    question: 'What comes next?',
    sequence: [10, 9, 7, 4, '?'],
    options: [0, 2, 1, 3],
    correct: 1,
    explanation: 'Subtract 1, then 2, then 3, then 4 → next is 2.'
  },
  {
    type: 'sequence',
    question: 'Which number fits?',
    sequence: [1, 4, 9, 16, '?'],
    options: [20, 25, 30, 36],
    correct: 1,
    explanation: 'Perfect squares: 1², 2², 3², 4², → 5² = 25.'
  },
  {
    type: 'sequence',
    question: 'Complete the sequence:',
    sequence: [81, 27, 9, 3, '?'],
    options: [2, 1, 0, -1],
    correct: 1,
    explanation: 'Divide by 3 each step: next is 1.'
  },
  {
    type: 'sequence',
    question: 'What is missing?',
    sequence: [2, 6, 12, 20, '?'],
    options: [28, 30, 32, 36],
    correct: 0,
    explanation: 'Pattern is n² + n: 1²+1=2, 2²+2=6, 3²+3=12 → next is 5²+5=30.'
  },
  {
    type: 'sequence',
    question: 'Fill in:',
    sequence: [13, 17, 19, 23, '?'],
    options: [25, 27, 29, 31],
    correct: 2,
    explanation: 'Prime numbers: next is 29.'
  },
  {
    type: 'sequence',
    question: 'What comes next?',
    sequence: [1, 2, 4, 8, 16, '?'],
    options: [30, 32, 34, 36],
    correct: 1,
    explanation: 'Powers of 2: next is 32.'
  },
  {
    type: 'sequence',
    question: 'Find the next number:',
    sequence: [100, 90, 80, 70, '?'],
    options: [65, 60, 75, 55],
    correct: 1,
    explanation: 'Decreasing by 10 → next is 60.'
  },
  {
    type: 'sequence',
    question: 'Complete the pattern:',
    sequence: [1, 3, 6, 10, 15, '?'],
    options: [20, 21, 22, 23],
    correct: 1,
    explanation: 'Triangular numbers: next is 21.'
  },

  // --- PATTERN (12) ---
  {
    type: 'pattern',
    question: 'Which comes next?',
    pattern: ['🔴', '🟦', '🔴', '🟦', '?'],
    options: ['🔴', '🟦', '🟨', '🟩'],
    correct: 0,
    explanation: 'Alternating red and blue.'
  },
  {
    type: 'pattern',
    question: 'Complete the sequence:',
    pattern: ['⬛', '⬜', '⬛', '⬜', '?'],
    options: ['⬛', '⬜', '🟦', '🟩'],
    correct: 0,
    explanation: 'Black and white alternate.'
  },
  {
    type: 'pattern',
    question: 'Which is next?',
    pattern: ['⭐', '⭐⭐', '⭐⭐⭐', '?'],
    options: ['⭐⭐⭐⭐', '⭐⭐', '⭐', '⭐⭐⭐⭐⭐'],
    correct: 0,
    explanation: 'Increasing stars.'
  },
  {
    type: 'pattern',
    question: 'Fill in:',
    pattern: ['⬜', '🟦', '⬜', '🟦', '?'],
    options: ['⬜', '🟦', '🟥', '🟨'],
    correct: 0,
    explanation: 'Alternating white and blue.'
  },
  {
    type: 'pattern',
    question: 'What comes next?',
    pattern: ['🔺', '🔻', '🔺', '🔻', '?'],
    options: ['🔺', '🔻', '🟨', '🟦'],
    correct: 0,
    explanation: 'Up and down triangles alternate.'
  },
  {
    type: 'pattern',
    question: 'Find the missing symbol:',
    pattern: ['⭕', '⬤', '⭕', '⬤', '?'],
    options: ['⭕', '⬤', '🔺', '🟦'],
    correct: 0,
    explanation: 'Hollow and filled alternate.'
  },
  {
    type: 'pattern',
    question: 'Which symbol fits?',
    pattern: ['🟨', '🟩', '🟦', '🟥', '?'],
    options: ['🟪', '🟧', '🟨', '⬜'],
    correct: 0,
    explanation: 'Going around rainbow colors.'
  },
  {
    type: 'pattern',
    question: 'Complete:',
    pattern: ['🔴', '🔴🔴', '🔴🔴🔴', '?'],
    options: ['🔴🔴🔴🔴', '🔴🔴', '🔴', '🔴🔴🔴🔴🔴'],
    correct: 0,
    explanation: 'Adding one more red circle each time.'
  },
  {
    type: 'pattern',
    question: 'Next in line?',
    pattern: ['🟦', '🟦🟦', '🟦🟦🟦', '?'],
    options: ['🟦🟦🟦🟦', '🟦', '🟦🟦', '🟦🟦🟦🟦🟦'],
    correct: 0,
    explanation: 'One more blue square each time.'
  },
  {
    type: 'pattern',
    question: 'Which shape fits?',
    pattern: ['⬛', '⬛⬛', '⬛⬛⬛', '?'],
    options: ['⬛⬛⬛⬛', '⬛⬛', '⬛', '⬛⬛⬛⬛⬛'],
    correct: 0,
    explanation: 'One more black square each time.'
  },
  {
    type: 'pattern',
    question: 'What comes next?',
    pattern: ['⭐', '🌙', '⭐', '🌙', '?'],
    options: ['⭐', '🌙', '☀️', '🌎'],
    correct: 0,
    explanation: 'Alternating star and moon.'
  },
  {
    type: 'pattern',
    question: 'Fill the blank:',
    pattern: ['🔺', '🔺🔺', '🔺🔺🔺', '?'],
    options: ['🔺🔺🔺🔺', '🔺', '🔺🔺', '🔺🔺🔺🔺🔺'],
    correct: 0,
    explanation: 'One more triangle each time.'
  },

  // --- MATH (12) ---
  {
    type: 'math',
    question: 'Solve:',
    equation: '12 ÷ 3 + 2 = ?',
    options: [6, 7, 8, 9],
    correct: 1,
    explanation: '12 ÷ 3 = 4, plus 2 = 6.'
  },
  {
    type: 'math',
    question: 'What is 25% of 80?',
    equation: '25% of 80 = ?',
    options: [10, 15, 20, 25],
    correct: 2,
    explanation: '25% of 80 = 20.'
  },
  {
    type: 'math',
    question: 'Solve the equation:',
    equation: '5² - 3² = ?',
    options: [12, 16, 18, 20],
    correct: 1,
    explanation: '25 - 9 = 16.'
  },
  {
    type: 'math',
    question: 'Simplify:',
    equation: '(8 × 2) + 10 ÷ 2 = ?',
    options: [20, 18, 21, 22],
    correct: 3,
    explanation: '16 + 5 = 21.'
  },
  {
    type: 'math',
    question: 'Solve:',
    equation: '(6 + 4) × 2 = ?',
    options: [18, 20, 22, 24],
    correct: 1,
    explanation: '10 × 2 = 20.'
  },
  {
    type: 'math',
    question: 'Find the result:',
    equation: '100 ÷ 25 + 7 = ?',
    options: [9, 10, 11, 12],
    correct: 2,
    explanation: '100 ÷ 25 = 4, +7 = 11.'
  },
  {
    type: 'math',
    question: 'What is √81?',
    equation: '√81 = ?',
    options: [8, 9, 10, 11],
    correct: 1,
    explanation: 'Square root of 81 is 9.'
  },
  {
    type: 'math',
    question: 'Solve:',
    equation: '15 ÷ 5 + 9 = ?',
    options: [10, 11, 12, 13],
    correct: 3,
    explanation: '15 ÷ 5 = 3, +9 = 12.'
  },
  {
    type: 'math',
    question: 'Calculate:',
    equation: '7 × 6 - 10 = ?',
    options: [32, 36, 40, 42],
    correct: 1,
    explanation: '42 - 10 = 32.'
  },
  {
    type: 'math',
    question: 'Evaluate:',
    equation: '9² ÷ 3 = ?',
    options: [25, 27, 28, 30],
    correct: 1,
    explanation: '81 ÷ 3 = 27.'
  },
  {
    type: 'math',
    question: 'Simplify:',
    equation: '(20 - 5) ÷ 3 = ?',
    options: [4, 5, 6, 7],
    correct: 1,
    explanation: '15 ÷ 3 = 5.'
  },
  {
    type: 'math',
    question: 'Find the missing value:',
    equation: '2x = 10 → x = ?',
    options: [2, 3, 4, 5],
    correct: 3,
    explanation: 'x = 5.'
  },

  // --- LOGIC (12) ---
  {
    type: 'logic',
    question: 'If all dogs are mammals and some mammals are brown, which is true?',
    statement: 'Some dogs might be brown.',
    options: ['True', 'False', 'Cannot determine', 'Invalid'],
    correct: 0,
    explanation: 'Logically possible some dogs are brown.'
  },
  {
    type: 'logic',
    question: 'If all cars need fuel and some vehicles are cars, then:',
    statement: 'Some vehicles need fuel.',
    options: ['True', 'False', 'Cannot determine', 'Invalid'],
    correct: 0,
    explanation: 'Since some vehicles are cars, they need fuel.'
  },
  {
    type: 'logic',
    question: 'If A is taller than B, and B is taller than C, then:',
    statement: 'A is taller than C.',
    options: ['True', 'False', 'Cannot determine', 'Invalid'],
    correct: 0,
    explanation: 'Transitive relation → A > B > C.'
  },
  {
    type: 'logic',
    question: 'If all birds can fly and penguins are birds, then:',
    statement: 'Penguins can fly.',
    options: ['True', 'False', 'Cannot determine', 'Invalid'],
    correct: 1,
    explanation: 'Exception: penguins cannot fly.'
  },
  {
    type: 'logic',
    question: 'If no humans are immortal and John is a human, then:',
    statement: 'John is mortal.',
    options: ['True', 'False', 'Cannot determine', 'Invalid'],
    correct: 0,
    explanation: 'Direct deduction.'
  },
  {
    type: 'logic',
    question: 'If all apples are fruits and some fruits are sweet, then:',
    statement: 'Some apples may be sweet.',
    options: ['True', 'False', 'Cannot determine', 'Invalid'],
    correct: 0,
    explanation: 'Possible scenario.'
  },
  {
    type: 'logic',
    question: 'If it rains, the ground gets wet. The ground is wet, so:',
    statement: 'It rained.',
    options: ['True', 'False', 'Cannot determine', 'Invalid'],
    correct: 2,
    explanation: 'Wet ground could be from other reasons.'
  },
  {
    type: 'logic',
    question: 'If some cats are black and all cats are animals, then:',
    statement: 'Some animals are black.',
    options: ['True', 'False', 'Cannot determine', 'Invalid'],
    correct: 0,
    explanation: 'Because some cats (animals) are black.'
  },
  {
    type: 'logic',
    question: 'If all squares are rectangles, and some rectangles are large, then:',
    statement: 'Some squares may be large.',
    options: ['True', 'False', 'Cannot determine', 'Invalid'],
    correct: 0,
    explanation: 'Possible case.'
  },
  {
    type: 'logic',
    question: 'If no fish can walk and salmon is a fish, then:',
    statement: 'Salmon cannot walk.',
    options: ['True', 'False', 'Cannot determine', 'Invalid'],
    correct: 0,
    explanation: 'Direct deduction.'
  },
  {
    type: 'logic',
    question: 'If all teachers are educated and Sarah is a teacher, then:',
    statement: 'Sarah is educated.',
    options: ['True', 'False', 'Cannot determine', 'Invalid'],
    correct: 0,
    explanation: 'Direct conclusion.'
  },
  {
    type: 'logic',
    question: 'If all flowers need sunlight and roses are flowers, then:',
    statement: 'Roses need sunlight.',
    options: ['True', 'False', 'Cannot determine', 'Invalid'],
    correct: 0,
    explanation: 'Direct deduction.'
  },

  // --- SPATIAL (12) ---
  {
    type: 'spatial',
    question: 'How many cubes are stacked?',
    visual: '🔳🔳\n🔳🔳🔳\n🔳',
    options: [6, 7, 8, 5],
    correct: 0,
    explanation: 'Count each cube: 6 total.'
  },
  {
    type: 'spatial',
    question: 'How many squares in a 2x2 grid?',
    visual: '⬜⬜\n⬜⬜',
    options: [4, 5, 6, 8],
    correct: 1,
    explanation: '4 small + 1 big = 5.'
  },
  {
    type: 'spatial',
    question: 'How many triangles are in a square divided diagonally?',
    visual: '▢ with diagonal',
    options: [2, 3, 4, 5],
    correct: 0,
    explanation: 'Diagonal splits square into 2 triangles.'
  },
  {
    type: 'spatial',
    question: 'How many rectangles in 3x1 grid?',
    visual: '⬜⬜⬜',
    options: [3, 4, 5, 6],
    correct: 1,
    explanation: '3 singles + 2 doubles + 1 triple = 6.'
  },
  {
    type: 'spatial',
    question: 'How many faces does a cube have?',
    options: [4, 5, 6, 8],
    correct: 2,
    explanation: 'Cube has 6 faces.'
  },
  {
    type: 'spatial',
    question: 'Count shapes:',
    visual: '🔺🔺\n🔺',
    options: [2, 3, 4, 5],
    correct: 1,
    explanation: '3 total triangles.'
  },
  {
    type: 'spatial',
    question: 'How many edges in a cube?',
    options: [10, 12, 14, 16],
    correct: 1,
    explanation: 'Cube has 12 edges.'
  },
  {
    type: 'spatial',
    question: 'How many vertices in a cube?',
    options: [6, 8, 10, 12],
    correct: 1,
    explanation: 'Cube has 8 vertices.'
  },
  {
    type: 'spatial',
    question: 'How many diagonals in a square?',
    options: [1, 2, 3, 4],
    correct: 1,
    explanation: '2 diagonals.'
  },
  {
    type: 'spatial',
    question: 'How many small triangles in a star (⭐)?',
    options: [5, 10, 15, 20],
    correct: 1,
    explanation: 'A 5-pointed star has 10 small triangles.'
  },
  {
    type: 'spatial',
    question: 'How many lines intersect in “X”?',
    options: [1, 2, 3, 4],
    correct: 1,
    explanation: 'Two lines intersect once.'
  },
  {
    type: 'spatial',
    question: 'How many squares in 3x3 grid?',
    options: [9, 14, 16, 18],
    correct: 1,
    explanation: '9 singles + 4 (2x2) + 1 (3x3) = 14.'
  }
];
