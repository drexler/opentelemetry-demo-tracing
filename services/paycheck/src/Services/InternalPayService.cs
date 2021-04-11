using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using AutoMapper;

using app.Repositories;
using app.Exceptions;

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
            try
            {
                var pay = await _payRepository.GetPaycheckAsync(paycheckId);
                if (pay == null)
                {
                    throw new PaycheckNotFoundException($"paycheck with id: {paycheckId} not found");
                }

                var paycheck = _mapper.Map<Paycheck>(pay);
                return paycheck;
            }
            catch(FormatException ex) 
            {
                throw new InvalidParameterException(ex.Message);
            }
            catch(PaycheckNotFoundException)
            {
                throw;
            }
            catch(Exception ex)
            {
                throw new DatabaseConnectionException(ex.Message);
            }
        }

        public async Task<IEnumerable<Paycheck>> GetEmployeePaychecksAsync(string employeeId) 
        {
            var pays = await _payRepository.GetEmployeePaychecksAsync(employeeId);
            var paychecks = pays.Select(pay => _mapper.Map<Paycheck>(pay));
            return paychecks;
        }
    }
}