
let res = [
  // add paycheck items
  db.paycheck.drop(),
  db.paycheck.insert({ 
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
      }
  }),
  db.paycheck.insert({ 
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
    }
}),
db.paycheck.insert({ 
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
    }
}),
db.paycheck.insert({ 
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
    }
}),
db.paycheck.insert({ 
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
    }
}),
db.paycheck.insert({ 
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
    }
}),
]

printjson(res)