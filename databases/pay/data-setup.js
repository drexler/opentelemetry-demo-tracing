
let paychecks = [
  db.paychecks.drop(),
  db.paychecks.insert({ 
      employee_id: 'f34656d4-2b7a-4a26-952d-12e0e56624d8',
      period_start_date: '2016-01-01T00:01:06.000Z',
      period_end_date: '2016-01-14T00:01:06.000Z',
      earnings: {
          type: 'Regular',
          rate: 1400,
          hours: 80,
          gross_pay: {
              current_period: 1400,
              year_to_date: 13400
          }
      },
      deductions: {
        federal_tax: {
            current_period: 12.13,
            year_to_date: 78.19,
        },
        state_tax: {
            current_period: 9.13,
            year_to_date: 48.18,
        },
        social_security: {
            current_period: 8.13,
            year_to_date: 84.19,
        },
        medicare: {
            current_period: 6.13,
            year_to_date: 784.19,
        },
        health: {
            current_period: 123.12, 
            year_to_date: 400.74
        },
        dental: {
            current_period: 12.12, 
            year_to_date: 100.45
        } 
    },
    payment_mode: {
        type: 'DIRECT_DEPOSIT',
        id: '5bd761dcae323e45a93ccff2' 
    }
  }),
  db.paychecks.insert({ 
    employee_id: '54d2176f-72ac-4d3f-b51c-3335af2eb4cc',
    period_start_date: '2016-01-01T00:01:06.000Z',
    period_end_date: '2016-01-14T00:01:06.000Z',
    earnings: {
        type: 'Regular',
        rate: 1000,
        hours: 80,
        gross_pay: {
            current_period: 1000,
            year_to_date: 11200
        }
    },
    deductions: {
        federal_tax: {
            current_period: 34.18,
            year_to_date: 800.18,
        },
        state_tax: {
            current_period: 89.17,
            year_to_date: 546.08,
        },
        social_security: {
            current_period: 90.13,
            year_to_date: 881.19,
        },
        medicare: {
            current_period: 93.13,
            year_to_date: 784.19,
        },
    },
    payment_mode: {
        type: 'COLD_HARD_CASH',
        id: 'f1207446-2c47-451d-ab83-0b7ff37bedb1' 
    }
}),
db.paychecks.insert({ 
    employee_id: 'e31ed5a2-85b3-47ab-bccb-25bb96f3feb7',
    period_start_date: '2016-01-01T00:01:06.000Z',
    period_end_date: '2016-01-14T00:01:06.000Z',
    earnings: {
        type: 'Regular',
        rate: 900,
        hours: 80,
        gross_pay: {
            current_period: 900,
            year_to_date: 10100
        }
    },
    deductions: {
        federal_tax: {
            current_period: 12.13,
            year_to_date: 78.19,
        },
        state_tax: {
            current_period: 98.13,
            year_to_date: 784.19,
        },
        social_security: {
            current_period: 98.13,
            year_to_date: 784.19,
        },
        medicare: {
            current_period: 98.13,
            year_to_date: 784.19,
        },
    },
    payment_mode: {
        type: 'CRYPTO',
        id: 'd7d68776-0ea2-45fd-82d4-4f212b339227' 
    }
}),
db.paychecks.insert({ 
    employee_id: '185907ee-5989-41dc-98ee-6c5bd4f92340',
    period_start_date: '2016-01-01T00:01:06.000Z',
    period_end_date: '2016-01-14T00:01:06.000Z',
    earnings: {
        type: 'Regular',
        rate: 900,
        hours: 80,
        gross_pay: {
            current_period: 900,
            year_to_date: 10100
        }
    },
    deductions: {
        federal_tax: {
            current_period: 12.13,
            year_to_date: 78.19,
        },
        state_tax: {
            current_period: 98.13,
            year_to_date: 784.19,
        },
        social_security: {
            current_period: 98.13,
            year_to_date: 784.19,
        },
        medicare: {
            current_period: 98.13,
            year_to_date: 784.19,
        },
        retirement: {
            current_period: 300.00, 
            year_to_date: 2400.00
        }
    },
    payment_mode: {
        type: 'DIRECT_DEPOSIT',
        id: '5bd761dcae323e45a93ccff2' 
    }
}),
db.paychecks.insert({ 
    employee_id: 'dc0ca5c5-2239-42ec-8860-c367a78a6b63',
    period_start_date: '2016-01-01T00:01:06.000Z',
    period_end_date: '2016-01-14T00:01:06.000Z',
    earnings: {
        type: 'Regular',
        rate: 900,
        hours: 80,
        gross_pay: {
            current_period: 900,
            year_to_date: 10100
        }
    },
    deductions: {
        federal_tax: {
            current_period: 12.13,
            year_to_date: 78.19,
        },
        state_tax: {
            current_period: 98.13,
            year_to_date: 784.19,
        },
        social_security: {
            current_period: 98.13,
            year_to_date: 784.19,
        },
        medicare: {
            current_period: 98.13,
            year_to_date: 784.19,
        },
    },
    payment_mode: {
        type: 'CRYPTO',
        id: 'e9ee53b1-9b9d-4642-810e-971e92ae1c8a' 
    }
}),
db.paychecks.insert({ 
    employee_id: 'ed8f1274-7a2f-45d1-86da-0bdf3e4e0055',
    period_start_date: '2016-01-01T00:01:06.000Z',
    period_end_date: '2016-01-14T00:01:06.000Z',
    earnings: {
        type: 'Regular',
        rate: 900,
        hours: 80,
        gross_pay: {
            current_period: 900,
            year_to_date: 10100
        }
    },
    deductions: {
        federal_tax: {
            current_period: 12.13,
            year_to_date: 78.19,
        },
        state_tax: {
            current_period: 98.13,
            year_to_date: 784.19,
        },
        social_security: {
            current_period: 98.13,
            year_to_date: 784.19,
        },
        medicare: {
            current_period: 98.13,
            year_to_date: 784.19,
        },
    },
    payment_mode: {
        type: 'DIRECT_DEPOSIT',
        id: '5bd761dcae323e45a93cd073' 
    }
}),
]


let direct_deposits = [
    db.direct_deposits.drop(),
    db.direct_deposits.insert({
        _id: ObjectId('5bd761dcae323e45a93ccff2'),
        employee_id: 'f34656d4-2b7a-4a26-952d-12e0e56624d8',
        account_type: 'Checking',
        account_number: '112233445566778899',
        routing_number: '001234598765132436',
        prenote: true,
    }),
    db.direct_deposits.insert({
        _id: ObjectId('5bd761dcae323e45a93cd073'), 
        employee_id: 'ed8f1274-7a2f-45d1-86da-0bdf3e4e0055',
        account_type: 'MoneyMarket',
        account_number: '1111111111111',
        routing_number: '001234598765132436',
        prenote: false
    }),
]

// Add paychecks & direct deposits
printjson(paychecks)
printjson(direct_deposits)
