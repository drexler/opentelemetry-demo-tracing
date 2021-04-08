using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Grpc.Core;
using Microsoft.Extensions.Logging;
using Google.Protobuf.WellKnownTypes;

using app.Services;
namespace app
{
    public class PaycheckService : PayService.PayServiceBase
    {
        private readonly ILogger<PaycheckService> _logger;
        private readonly IPayService _payService;

        public PaycheckService(ILogger<PaycheckService> logger, IPayService payService)
        {
            _logger = logger;
            _payService = payService;
        }

        public async override Task<GetAllPaychecksResponse> GetAllPaychecks(Empty request, ServerCallContext context)
        {
            var paychecks = await _payService.GetAllPaychecksAsync();
            var response = new GetAllPaychecksResponse { };
            response.Paychecks.AddRange(paychecks.ToList());
            return response;
        }

        public async override Task<GetPaycheckResponse> GetPaycheck(GetPaycheckRequest request, ServerCallContext context)
        {
            var paycheck = await _payService.GetPaycheckAsync(request.PaycheckId);
            var response = new GetPaycheckResponse {}; 
            response.Paycheck = paycheck; 
            return response;
        }

        public async override Task<GetEmployeePaychecksResponse> GetEmployeePaychecks(GetEmployeePaychecksRequest request, ServerCallContext context)
        {
            var paychecks = await _payService.GetEmployeePaychecksAsync(request.EmployeeId);
            var response = new GetEmployeePaychecksResponse { };
            response.Paychecks.AddRange(paychecks.ToList());
            return response;
        }
    }
}
