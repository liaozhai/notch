# notch
## Why?
The reason behind this small project is that I needed a simple and fast library management application with minimalistic UI. The sample data contain a small part of my personal library. Despite being simple and straight-forward, this app gives an example of using state machines to implement a complex logic. Did I succeed? Well, it's not for me to judge. See for yourself.
## Pre-requisites
The only prerequisite is Docker environment installed on the host machine.
## Installation
The installation procedure is as simple as it can be
1. Clone the repository.
2. Add password.txt file containing the database password (choose whatever you like) to the root directory.
3. Add .env file with the following content, where `<port>` is a desired application port number, for example 8000:
```
PORT=<port>
```
4. Run the following commands in the project root directory:
```
docker compose build
docker compose up -d
```
