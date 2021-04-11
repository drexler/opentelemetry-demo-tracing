using System;
using System.Runtime.InteropServices;

using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MongoDB.Driver;
using OpenTelemetry;
using OpenTelemetry.Trace;
using OpenTelemetry.Resources;

using app.Profiles;
using app.Repositories;
using app.Services;

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
                var username = Environment.GetEnvironmentVariable("DATABASE_USER");
                var password = Environment.GetEnvironmentVariable("DATABASE_USER_PASSWORD");
                var server = Environment.GetEnvironmentVariable("DATABASE_SERVER_HOSTNAME");
                var authDbName = "admin";
                var authMechanism = "SCRAM-SHA-1";

                var identity = new MongoInternalIdentity(authDbName, username);
                var evidence = new PasswordEvidence(password);
                var credential = new MongoCredential(authMechanism, identity, evidence);

                var mongoClientSettings = new MongoClientSettings
                {
                    Server = new MongoServerAddress(server),
                    ServerSelectionTimeout = TimeSpan.FromSeconds(5),
                    ReadPreference = ReadPreference.Primary,
                    UseTls = false,
                    Credential = credential
                };

                return new MongoClient(mongoClientSettings);

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
                .AddSource("paycheck-db-conn")
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
            var port = Environment.GetEnvironmentVariable("SERVICE_PORT") ?? "5000";
            var servicePort = int.Parse(port);

            // Setup a HTTP/2 endpoint without TLS.
            cfg.ConfigureKestrel(options =>
            {
                // https://docs.microsoft.com/en-us/aspnet/core/grpc/troubleshoot?view=aspnetcore-5.0#unable-to-start-aspnet-core-grpc-app-on-macos
                if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
                {
                    options.ListenLocalhost(servicePort, o => o.Protocols = HttpProtocols.Http2);
                }
                else
                {
                    options.ListenAnyIP(servicePort, o => o.Protocols = HttpProtocols.Http2);
                }
            });

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