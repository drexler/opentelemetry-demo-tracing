using System.Threading.Tasks;
using Grpc.Core;
using Microsoft.Extensions.Logging;
using Google.Protobuf.WellKnownTypes;

namespace OTeL.Demo.PayCheck
{
    public class PaycheckService : PayService.PayServiceBase
    {
        private readonly ILogger<PaycheckService> _logger;
        public PaycheckService(ILogger<PaycheckService> logger)
        {
            _logger = logger;
        }

         public override Task<GetAllPaychecksResponse> GetAllPaychecks(Empty request, ServerCallContext context)
        { 
            // PLACEHOLDER
            return Task.FromResult(new GetAllPaychecksResponse {});
        }

        public override Task<GetPaycheckResponse> GetPaycheck(GetPaycheckRequest request, ServerCallContext context)
        {
            //PLACEHOLDER
            return Task.FromResult(new GetPaycheckResponse {});
        }

        public override Task<GetEmployeePaychecksResponse> GetEmployeePaychecks(GetEmployeePaychecksRequest request, ServerCallContext context)
        {
            // PLACEHOLDER
            return Task.FromResult(new GetEmployeePaychecksResponse {});
        }
    }
}
