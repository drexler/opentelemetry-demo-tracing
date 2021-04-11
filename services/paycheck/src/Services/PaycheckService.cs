using System;
using System.Threading.Tasks;
using System.Linq;

using Grpc.Core;
using Google.Protobuf.WellKnownTypes;
using Microsoft.Extensions.Logging;

using app.Exceptions;
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
            try
            {
                var paychecks = await _payService.GetAllPaychecksAsync();
                var response = new GetAllPaychecksResponse { };
                response.Paychecks.AddRange(paychecks.ToList());
                return response;
            }
            catch (Exception ex)
            {
                ConvertToRpcException(ex);
            }

            return null; // keeps Compiler quiet! 
        }

        public async override Task<GetPaycheckResponse> GetPaycheck(GetPaycheckRequest request, ServerCallContext context)
        {
            try
            {
                var paycheck = await _payService.GetPaycheckAsync(request.PaycheckId);
                var response = new GetPaycheckResponse { };
                response.Paycheck = paycheck;
                return response;
            }
            catch (Exception ex)
            {
                ConvertToRpcException(ex);
            }

            return null;  // keeps Compiler quiet!
        }

        public async override Task<GetEmployeePaychecksResponse> GetEmployeePaychecks(GetEmployeePaychecksRequest request, ServerCallContext context)
        {
            try
            {
                var paychecks = await _payService.GetEmployeePaychecksAsync(request.EmployeeId);
                var response = new GetEmployeePaychecksResponse { };
                response.Paychecks.AddRange(paychecks.ToList());
                return response;
            }
            catch (Exception ex)
            {
                ConvertToRpcException(ex);
            }

            return null;  // keeps Compiler quiet!
        }


        private void ConvertToRpcException(Exception exception)
        {
            if (exception is InvalidParameterException)
            {
                throw new RpcException(new Status(StatusCode.InvalidArgument, exception.Message));
            }

            if (exception is PaycheckNotFoundException)
            {
                throw new RpcException(new Status(StatusCode.NotFound, exception.Message));
            }

            _logger.LogCritical($"Unexpected internal error: {exception.Message}");
            throw new RpcException(new Status(StatusCode.Internal, "Internal Error"));
        }
    }
}
