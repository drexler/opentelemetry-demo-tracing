using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;

using app.Repositories;
using app.Entities;

namespace app.Services
{
    internal class  InternalPayService : IPayService
    {
        public readonly IPayRepository _payRepository;
        public readonly IMapper _mapper;

        public InternalPayService(IPayRepository payRepository, IMapper mapper) {
            _payRepository = payRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<Paycheck>> GetAllPaychecksAsync() 
        {
            var pays = await _payRepository.GetAllPaychecksAsync();
            var paychecks = pays.Select(pay => _mapper.Map<Paycheck>(pay));
            return paychecks;
        }

        public async Task<Paycheck> GetPaycheckAsync(string paycheckId) 
        {
            var pay = await _payRepository.GetPaycheckAsync(paycheckId);
            var paycheck = _mapper.Map<Paycheck>(pay);
            return paycheck;
        }

        public async Task<IEnumerable<Paycheck>> GetEmployeePaychecksAsync(string employeeId) 
        {
            var pays = await _payRepository.GetEmployeePaychecksAsync(employeeId);
            var paychecks = pays.Select(pay => _mapper.Map<Paycheck>(pay));
            return paychecks;
        }
    }
}