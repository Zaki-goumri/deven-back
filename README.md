
# Deven Backend

This is the **backend repository** for the Deven platform. It is built using the [NestJS](https://nestjs.com/) framework and follows a clean, modular architecture to ensure scalability, maintainability, and developer productivity, and the starter template is provided by [Mouloud]("https://github.com/mouloud240/") under repo name **nestJS-starter**.

## Features

* **NestJS Starter** base project structure.
* Modular architecture for easy feature extension.
* Environment-based configuration management.
* Integrated authentication and authorization.
* RESTful APIs Support
* Centralized logging and error handling.
* Docker-ready for containerized deployments.

## Getting Started

### Prerequisites

* Node.js (v18+)
*  npm or pnpm
* Docker (optional, for containerization)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd deven-backend

# Install dependencies
pnpm install
```

### Running the Application

```bash
# Start in development mode
pnpm run  start:dev

# Start in production mode
pnpm run  build && pnpm run start:prod
```

### Running with Docker

```bash
docker compose up --build
```

## Configuration

All environment variables are defined in the `.env` file. You can refer to `.env.example` for required variables.

## Scripts

* `pnpm start:dev` – Start in watch mode for development.
* `pnpm run  start:prod` – Start compiled code in production.
* `pnpm run  test` – Run unit tests.
* `pnpm run  lint` – Run linter.

## Project Structure

```
src/
├── modules/        # Feature modules
├── common/         # Shared utilities, filters, interceptors
├── config/         # Configuration files
├── main.ts         # Application entry point
└── app.module.ts   # Root module
```

## License

This project is **All Rights Reserved**. Unauthorized copying, modification, or distribution of this project is prohibited.
[LICENSE](./LICENSE.md)

