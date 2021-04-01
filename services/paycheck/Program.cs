using System.Runtime.InteropServices;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Serilog;
namespace OTeL.Demo.PayCheck
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
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
