using System;

namespace app.Exceptions
{
    public class DatabaseConnectionException : Exception
    {
        public DatabaseConnectionException()
        {
        }

        public DatabaseConnectionException(string message)
            : base(message)
        {
        }

        public DatabaseConnectionException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}