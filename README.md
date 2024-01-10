# Rate Shield

## Overview

Rate Shield is a robust rate-limiting project designed for Node.js applications, utilizing the NestJS framework and Redis. It is built to protect APIs from excessive use and to prevent abuse, ensuring fair resource usage across all users.

## Key Features

- **Rate Limiting:** Enforces request limits per hour based on IP address for public routes and user tokens for private routes.
- **Concurrency Handling:** Efficiently handles multiple concurrent requests, ensuring stability and reliability even under high traffic.
- **Scalable Architecture:** Can work with multiple instances of the application, allowing for horizontal scaling.

## Technologies Used

- **NestJS**
- **Redis**
- **TypeScript**

## Usage

### Installation

Clone the repository

```sh
git clone https://github.com/thebozturk/rate-shield.git
```

Go to the project directory

```sh
cd rate-shield
```

Install dependencies

```sh
npm install
```
Run the application

```sh
npm start
```

### Testing

Run unit tests

```sh
npm run test
```

### Handling Requests

**Private Routes**: Limits are enforced based on user tokens. If the limit is exceeded, the server responds with a 429 Too Many Requests status code and a message indicating when to try again.
**Public Routes**: Limits are enforced based on IP addresses with similar response behavior as private routes.

### Examples

**Exceeding Rate Limit**

```json
{
  "message": "Rate limit exceeded",
  "error": "Too Many Requests",
  "Try_Again_After": "5 minutes"
}
```