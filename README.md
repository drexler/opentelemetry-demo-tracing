# opentelemetry-demo-tracing
A companion code for distributed tracing with OpenTelemetry [blog](https://drexler.github.io/opentelemetry/) post.

![OpenTelemetry Tracing Demo](/otel-demo-tracing.png)


###### Prerequisites
* A working installation of [Docker](https://www.docker.com/)

###### Usage
* Build & start services: `$ docker-compose up --build -d`
* Stopping services: `$docker-compose down`

APIs will be available at `http://localhost:55050`
###### Sample APIs
API | Description |
--- | --- |
POST */employees* | Create an employee record |
GET */employees* | List all employees |
GET */employees/{employeeId}* | Get a specific employee|
GET */employees/{employeeId}/paychecks* | List all paychecks for an employee |
GET */employees/{employeeId}/direct-deposits* | List direct deposits associated with an employee |
GET */paychecks* | List all paychecks |
GET */paychecks/{paycheckId}* | Get a specific paycheck |


###### Viewing Telemetry Data
This demo includes two instances for analyzing trace telemetry data: [Jaeger] and [Zipkin].

Trace data for analyzing calls can be viewed with either at: 
* Jaeger: `http://localhost:16686/`
  ![Jaeger Tracing](/jaeger-tracing.png)

* Zipkin:  `http://localhost:9411/zipkin/`
  ![Zipkin Tracing](/zipkin-tracing.png)


[Jaeger]: https://www.jaegertracing.io/
[Zipkin]: https://zipkin.io/
