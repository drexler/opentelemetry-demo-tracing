using System;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using Serilog.Events;

namespace app
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Information()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
                .Enrich.FromLogContext()
                .WriteTo.Console(
                    outputTemplate: "[{Level:u3}] {Message:lj} {NewLine}{Exception}")
                .CreateLogger();

               Log.Logger.Information("Creating Host");

            try
            {
               var hb = new HostBuilder()
                .ConfigureWebHostDefaults(DependencyInjection.ConfigureWebApplication)
                .ConfigureAppConfiguration(DependencyInjection.ConfigureConfiguration)
                .ConfigureServices(DependencyInjection.ConfigureServices)
                .ConfigureServices(DependencyInjection.ConfigureTracing)
                .UseSerilog()
                .Build();

                hb.Services.GetRequiredService<ILogger<Program>>().LogInformation("Running Host");
                hb.Run();

                Log.Logger.Information("Graceful host termination");
                Environment.ExitCode = 0;

            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Oh nein, die Software ist Kaput!");
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }
    }
    
}
