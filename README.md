# Task Management System

## Overview
The Task Management System is a web application built with Node.js, Express.js, TypeScript, and Prisma that helps users manage their tasks efficiently. It provides features for creating tasks, creating subtasks, updating task status, and more. The application also includes cron job functionalities for automatically updating task priorities based on due dates and making voice calls using Twilio for task reminders.

## Features
- **Task Management**: Users can create tasks with titles, descriptions, and due dates. Tasks can be updated with new due dates and statuses.
- **Subtask Management**: Users can create subtasks within tasks and update their statuses.
- **Priority Management**: Cron jobs automatically update task priorities based on due dates.
- **Twilio Integration**: Cron jobs make voice calls using Twilio to remind users of tasks with overdue due dates.
- **User Authentication**: Authentication middleware ensures secure access to user-specific functionalities.

## Technologies Used
- Node.js
- Express.js
- TypeScript
- Prisma
- Twilio
- Cron Jobs (node-cron)

## Installation
1. Clone the repository: `git clone https://github.com/AnkitNayan83/Task-Management-System.git`
2. Install dependencies: `npm install`
3. Set up environment variables (e.g., Twilio credentials, database connection)
4. Start the server: `npm start`
5. Access the application at `http://localhost:3000`

## Usage
1. Create a new task by providing a title, description, and due date.
2. Add subtasks to tasks and update their statuses as needed.
3. Task priorities are automatically updated based on due dates.
4. Twilio voice calls are made for overdue tasks, reminding users of pending tasks.

## Contributing
Contributions are welcome! Feel free to submit pull requests for new features, bug fixes, or improvements. Please follow the existing code style and ensure that tests are passing before submitting your changes.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
