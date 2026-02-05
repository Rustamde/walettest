export const mockData = [
  {
    email: 'test@example.com',
    name: 'Test User',
    balance: 1250.50,
    currency: 'USD',
    status: 'Verified',
    avatar: 'https://ui-avatars.com/api/?name=Test+User&background=0D8ABC&color=fff',
    payments: [
      { id: 1, date: '2023-10-25', description: 'Deposit via Card', amount: 500.00, type: 'credit' },
      { id: 2, date: '2023-10-24', description: 'Netflix Subscription', amount: -15.99, type: 'debit' },
      { id: 3, date: '2023-10-22', description: 'Transfer to John', amount: -50.00, type: 'debit' },
      { id: 4, date: '2023-10-20', description: 'Payroll', amount: 2000.00, type: 'credit' }
    ],
    payouts: [
      { id: 101, date: '2023-10-15', description: 'Bank Withdrawal', amount: -1000.00, type: 'debit' },
      { id: 102, date: '2023-10-01', description: 'ATM Cash Out', amount: -200.00, type: 'debit' }
    ],
    orders: [
      { id: 'ORD-9921', date: '2023-10-26', description: 'iPhone 15 Case', amount: 29.99, type: 'debit', status: 'Delivered' },
      { id: 'ORD-8812', date: '2023-10-20', description: 'USB-C Cable', amount: 15.00, type: 'debit', status: 'In Transit' }
    ]
  },
  {
    email: 'alice@example.com',
    name: 'Alice Smith',
    balance: 3420.00,
    currency: 'EUR',
    status: 'VIP',
    avatar: 'https://ui-avatars.com/api/?name=Alice+Smith&background=6B21A8&color=fff',
    payments: [
      { id: 1, date: '2023-10-26', description: 'Consulting Fee', amount: 1200.00, type: 'credit' },
      { id: 2, date: '2023-10-25', description: 'Apple Store', amount: -999.00, type: 'debit' }
    ],
    payouts: [],
    orders: [
      { id: 'ORD-1122', date: '2023-10-25', description: 'MacBook Pro 14"', amount: 2499.00, type: 'debit', status: 'Shipped' }
    ]
  },
  {
    email: 'bob@example.com',
    name: 'Bob Jones',
    balance: 45.00,
    currency: 'USD',
    status: 'Pending',
    avatar: 'https://ui-avatars.com/api/?name=Bob+Jones&background=C2410C&color=fff',
    payments: [
      { id: 1, date: '2023-10-01', description: 'Signup Bonus', amount: 50.00, type: 'credit' },
      { id: 2, date: '2023-10-05', description: 'Coffee Shop', amount: -5.00, type: 'debit' }
    ],
    payouts: [],
    orders: []
  }
];
