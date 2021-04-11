using System;

namespace app.Exceptions
{
    public class PaycheckNotFoundException : Exception
    {
        public PaycheckNotFoundException()
        {
        }

        public PaycheckNotFoundException(string message)
            : base(message)
        {
        }

        public PaycheckNotFoundException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}