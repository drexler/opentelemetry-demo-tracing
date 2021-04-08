using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MongoDB.Driver;
using AutoMapper;

using app.Services;
using app.Repositories;
using app.Profiles;

namespace app
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddGrpc();
            services.AddSingleton<IPayService, InternalPayService>();
            services.AddSingleton<IMongoClient>(c =>
            {
                // TODO: read from environment variables.
                var login = "mongo";
                var password = "password";
                var server = "localhost"; //"pay-db";

                return new MongoClient($"mongodb://{login}:{password}@{server}:27017/?authSource=admin&readPreference=primary&ssl=false");
            });

            services.AddTransient(c => c.GetService<IMongoClient>().StartSession());
            services.AddTransient<IPayRepository, PayRepository>();

            services.AddSingleton(provider => new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new PayProfile());
            }).CreateMapper());

        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
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
        }
    }
}
