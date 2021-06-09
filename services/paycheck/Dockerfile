FROM mcr.microsoft.com/dotnet/sdk:5.0 as builder

RUN apt-get update \
 && DEBIAN_FRONTEND=noninteractive \
    apt-get install --no-install-recommends --assume-yes \
      protobuf-compiler-grpc

ENV PROTOBUF_PROTOC=/usr/bin/protoc

WORKDIR /build
COPY . ./
RUN dotnet build "."
RUN dotnet publish "./src/paycheck.csproj" -c Release -o out/publish 
RUN dotnet build-server shutdown


FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS runtime
WORKDIR /app
COPY --from=builder /build/out/publish .
COPY . ./
ENTRYPOINT ["dotnet", "paycheck.dll"]