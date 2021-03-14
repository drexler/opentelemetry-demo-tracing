FROM rust:1.49 as builder

COPY  ./ /app/
WORKDIR /app
#Rustfmt is a dependency of tonic-build
RUN rustup component add rustfmt  
RUN cargo build --release

ENTRYPOINT ["./target/release/server"]


