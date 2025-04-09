# Use the latest stable release of Rust
FROM rust:latest

# Create app directory for the source code
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Build the binary application
RUN cargo install --path .

# Expose port
EXPOSE 8080

# Run the application
# Replace with actual service binary name
CMD ["zksnark_service"]