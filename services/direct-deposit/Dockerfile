FROM rust:1.49 as builder

COPY  ./ /app/
WORKDIR /app
#Rustfmt is a dependency of tonic-build
RUN rustup component add rustfmt  
RUN cargo build --release --bin server

FROM rust:1.49 as runtime
WORKDIR /app
COPY --from=builder /app/target/release/server .
ENTRYPOINT ["./server"]


