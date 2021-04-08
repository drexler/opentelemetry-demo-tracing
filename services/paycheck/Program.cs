// using System.Runtime.InteropServices;
// using Microsoft.AspNetCore.Hosting;
// using Microsoft.Extensions.Hosting;
// using Microsoft.AspNetCore.Server.Kestrel.Core;
// using Serilog;

using System;
using System.Runtime.InteropServices;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
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

            try
            {
                Log.Information("Starting web host");
                CreateHostBuilder(args).Build().Run();
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Host terminated unexpectedly");
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
             Host.CreateDefaultBuilder(args)
                 .ConfigureWebHostDefaults(webBuilder =>
                 {
                    // MacOS doesn't support ALPN. See https://docs.microsoft.com/en-us/aspnet/core/grpc/troubleshoot?view=aspnetcore-3.1#unable-to-start-aspnet-core-grpc-app-on-macos
                    if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
                    {
                         webBuilder.ConfigureKestrel(options =>
                         {
                            // Setup a HTTP/2 endpoint without TLS.
                            options.ListenLocalhost(5000, o => o.Protocols = HttpProtocols.Http2);
                         });
                    }
                    else
                    {
                        webBuilder.ConfigureKestrel(options =>
                         {
                             // TODO: Use another port (5001) and https
                            options.ListenAnyIP(5000, o =>
                            {
                                o.Protocols = HttpProtocols.Http2;
                            });
                         });
                    }

                    webBuilder.UseStartup<Startup>();
                 }).UseSerilog();
    }
    
}
