using System;
using System.Runtime.InteropServices;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

using MongoDB.Driver;
using AutoMapper;
using OpenTelemetry;
using OpenTelemetry.Trace;
using OpenTelemetry.Resources;

using app.Services;
using app.Repositories;
using app.Profiles;

namespace app
{
    internal static class DependencyInjection
    {
        public static void ConfigureServices(IServiceCollection services)
        {
            services.AddGrpc();
            services.AddSingleton<IPayService, InternalPayService>();
            services.AddSingleton<IMongoClient>(c =>
            {
                var databaseUri = Environment.GetEnvironmentVariable("DATABASE_URL"); 
                if (databaseUri == null)
                {
                    var username = "mongo";
                    var password = "password";
                    var server = "localhost";
                    databaseUri = $"mongodb://{username}:{password}@{server}:27017"; 
                }

                return new MongoClient($"{databaseUri}/?authSource=admin&readPreference=primary&ssl=false");
            });

            services.AddTransient(c => c.GetService<IMongoClient>().StartSession());
            services.AddTransient<IPayRepository, PayRepository>();

            services.AddSingleton(provider => new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new PayProfile());
            }).CreateMapper());
        }

        public static void ConfigureConfiguration(IConfigurationBuilder configBuilder)
        {
            configBuilder.AddEnvironmentVariables();
        }

        public static void ConfigureTracing(IServiceCollection services)
        {
            // Necessary for OpenTelemetry Collector communication since traffic is unencrypted for demo purposes
            AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport", true);

            services.AddOpenTelemetryTracing((builder) => builder
                .AddAspNetCoreInstrumentation()
                .SetResourceBuilder(ResourceBuilder.CreateDefault().AddService("paycheck-service"))
                .AddOtlpExporter(options =>
                {
                    var otelCollectorUri = Environment.GetEnvironmentVariable("OTEL_COLLECTOR_URI") ?? "http://localhost:4317";
                    options.ExportProcessorType = ExportProcessorType.Batch;
                    options.Endpoint = new Uri(otelCollectorUri);
                }));
        }

        public static void ConfigureWebApplication(IWebHostBuilder cfg)
        {
            // MacOS doesn't support ALPN. See https://docs.microsoft.com/en-us/aspnet/core/grpc/troubleshoot?view=aspnetcore-3.1#unable-to-start-aspnet-core-grpc-app-on-macos
            if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
            {
                cfg.ConfigureKestrel(options =>
                {
                        // Setup a HTTP/2 endpoint without TLS.
                        options.ListenLocalhost(5000, o => o.Protocols = HttpProtocols.Http2);
                });
            }
            else
            {
                cfg.ConfigureKestrel(options =>
                    {
                        // TODO: Use another port (5001) and https
                        options.ListenAnyIP(5000, o =>
                        {
                            o.Protocols = HttpProtocols.Http2;
                        });
                    });
            }

            cfg.Configure((ctx, app) =>
            {
                if (ctx.HostingEnvironment.IsDevelopment())
                {
                    app.UseDeveloperExceptionPage();
                }

                app.UseRouting();

                app.UseEndpoints(endpoints =>
                {
                    endpoints.MapGrpcService<PaycheckService>();

                    endpoints.MapGet("/", async context =>
                     {
                       await context.Response.WriteAsync("Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");
                   });
                });
            });
        }
    }
}