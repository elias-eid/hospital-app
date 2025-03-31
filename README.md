# Hospital App

## Description 
This repository contains a sample dockerized React app for nurse management. The application allows the user to create,
update and delete wards and nurses. 

Wards have the following attributes:
- Name
- Color

Nurses have the following attributes:
- First Name
- Last Name
- Ward 
- Employee ID
- Email 

Wards can be managed from the "Wards" directory, accessible by clicking the "Wards" link in the navigation bar. Similarly,
Wards can be managed from the "Nurses" directory, which can be accessed by clicking the "Nurses" link in the navigation bar.

In both directories, the FAB (Floating Action Button) with the + sign allows the user to create a new entity. The pencil
icon denotes the Edit button and the trash can icon denotes the delete button.

Both the Wards and Nurse DataGrids allow for sorting and filtering on all visible fields and support pagination with a
customizable number of rows per page.

## Deployment

You will need to have Docker installed on your local machine to run this application.

1. Clone this repository to your local machine.
2. Copy the `.env.sample` file to `.env` and fill in the values.
3. Open a new terminal window and cd into the root directory:
    ```bash
       cd hospital-app
    ```
4. Build the start containers:
    ```bash
       docker-compose up --build
    ```
5. Once the backend server is up (`Server running on port 5000` will be shown in the logs), run the migrations in another terminal window:
    ```bash
        cd hospital-app
        docker-compose exec backend npx knex migrate:latest
    ```
6. The application will be accessible by navigation to `localhost:3000` in a browser window.

Subsequently, you can bring the container down and up as needed:
```bash
    docker-compose down
```
```bash
  docker-compose compose up
```