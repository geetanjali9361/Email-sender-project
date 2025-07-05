# Email Service Project

## Description
A robust and lightweight email service built with Node.js, designed to automate email delivery to clients with a built-in failover mechanism between SendGrid and Nodemailer. The system ensures reliable communication through effective error handling, logging, and retry logic. Ideal for B2B/B2C businesses where efficient and dependable client communication is crucial.



---

## Installation

```bash
npm install
```

---

## Usage

Start the application:

```bash
npm start
```

---

## Sequelize Setup

### Install Sequelize CLI

```bash
npm install --save-dev sequelize-cli
```

### Initialize Project

```bash
npx sequelize-cli init
```

This will create the following folders:
- `config/`: Configuration for database connections
- `models/`: Database models
- `migrations/`: Migration scripts
- `seeders/`: Seed data

### Common Commands

- Run migrations:
  ```bash
  npx sequelize-cli db:migrate
  ```

- Undo last migration:
  ```bash
  npx sequelize-cli db:migrate:undo
  ```

- Run all seeders:
  ```bash
  npx sequelize-cli db:seed:all
  ```

- Undo most recent seeder:
  ```bash
  npx sequelize-cli db:seed:undo
  ```

- Undo specific seeder:
  ```bash
  npx sequelize-cli db:seed:undo --seed name-of-seed-as-in-data
  ```

- Undo all seeders:
  ```bash
  npx sequelize-cli db:seed:undo:all
  ```

---

## Database Configuration

The database config is located in `config/config.json`. It is auto-generated when you initialize Sequelize CLI.

```json
{
  "development": {
    "username": "root",
    "password": "your_pass(if any)",
    "database": "your_db_name",
    "host": "your_host",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "your_pass(if any)",
    "database": "your_db_name",
    "host": "your_host",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": "your_pass",
    "database": "your_db_name",
    "host": "your_host",
    "dialect": "mysql"
  }
}
```

---

## Configuration

Set up the following environment variables:

### SendGrid Configuration

```
SENDGRID_API_KEY=your_sendgrid_api_key  
SENDGRID_FROM_EMAIL=your_verified_sender_email
```

### Nodemailer Configuration

```
GMAIL_USER=your_user  
GMAIL_APP_PASSWORD=your_app_password
```

---

## Error Handling

The application uses an automatic failover strategy:

- **Primary**: SendGrid is used first.
- **Fallback**: If SendGrid fails, Nodemailer is automatically used as a backup.

All attempts and errors are logged for monitoring and debugging.

---

## Features

- Dual email provider support (SendGrid and Nodemailer)
- Automatic failover mechanism
- Database integration with Sequelize ORM
- Environment-based configuration
- Error logging and monitoring
