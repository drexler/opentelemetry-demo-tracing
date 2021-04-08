using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace app.Entities
{
    public class Pay : BaseEntity
    {
        [BsonElement("employee_id")]
        public string EmployeeId { get; set; }

        [BsonElement("period_start_date")]
        public string PeriodStartDate { get; set; }

        [BsonElement("period_end_date")]
        public string PeriodEndDate  { get; set; }

        [BsonElement("earnings")]
        public Earnings Earnings { get; set; }

        [BsonElement("deductions")]
        public Deductions Deductions { get; set; }
    }

    public class Earnings
    {
        [BsonElement("type")]
        public string Type { get; set; }

        [BsonElement("rate")]
        public double Rate { get; set; }

        [BsonElement("hours")]
        public int Hours { get; set; }

        [BsonElement("gross_pay")]
        public AmountType GrossPay { get; set; }
    }

    [BsonIgnoreExtraElements]
    public class Deductions
    {
        [BsonElement("federal_tax")]
        public AmountType FederalTax { get; set; }

        [BsonElement("state_tax")]
        public AmountType StateTax { get; set; }

        [BsonElement("social_security")]
        public AmountType SocialSecurity { get; set; }

        [BsonElement("medicare")]
        public AmountType Medicare { get; set; }

        [BsonElement("health")]
        public AmountType Health { get; set; }

        [BsonElement("dental")]
        public AmountType Dental { get; set; }

        [BsonElement("retirement")]
        public AmountType Retirement { get; set; }
    }

    public class AmountType
    {
        [BsonElement("current_period")]
        public double CurrentPeriod { get; set; }

        [BsonElement("year_to_date")]
        public double YearToDate { get; set; }
    }
}