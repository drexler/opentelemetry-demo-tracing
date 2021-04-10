using System.Collections.Generic;
using AutoMapper;


namespace app.Profiles
{
    public class PayProfile : Profile
    {
        public PayProfile()
        {
            SourceMemberNamingConvention = new PascalCaseNamingConvention();
            DestinationMemberNamingConvention = new PascalCaseNamingConvention();

            CreateMap<Entities.Pay, app.Paycheck>();
            CreateMap<Entities.Earnings, app.Earnings>();
            CreateMap<Entities.Deductions, app.Deductions>();
            CreateMap<Entities.AmountType, app.PayAmount>();
        }
    }
}