# Quizify

A quiz site that can be used to create and host live quiz sessions

[Click on this link to go to the repo for the original v1 of this project. It got complicated with React and CORS issues.](https://github.com/saivishnu725/quizify)

## Pre-requisites

1. [NodeJS](https://nodejs.org/en)
2. [NPM](https://npmjs.com)
3. [Web Browser](https://www.mozilla.org/en-US/firefox/new/)

## Resources

1. [ER Diagram](https://drawsql.app/teams/the-unconcerned-apes-team/diagrams/quizify)
2. [ChatGPT describing the DataBase schema](https://chatgpt.com/share/61dda5b1-02e1-4393-965e-abb2cd1f7f04)

## How to run it locally

1. Install node dependencies

   ```bash
   npm i
   ```

2. Create the local .env file

   ```bash
      NODE_ENV=development
      MONGO_URI=mongodb://mongodb:27017/quizify
      DB_PASSWORD=your_mongo_pass
      PORT=4000
      DB_HOST=::
      DB_PASSWORD=your_mariadb_pass
      DB_NAME=quizify
      DB_USER=your_mariadb_username
      JWT_SECRET=your_jwt_secret
   ```

3. Run the Server

   ```bash
      npm run dev
   ```

4. Open the website that is running on [http://localhost:4000](http://localhost:4000)

   ```bash
      firefox http://localhost:4000 # for firefox users
      google-chrome-stable http://localhost:4000 # chrome users
      echo "any other browser (except maybe Brave) should be banned"
   ```

## Collaborators

Due to the nature of this project (individual project to present as the final project to receive this BCA degree), I have to work on it alone. Do provide insights and suggestions, if any.

## Developers Notes

1. Access the mariadb

   ```bash
         mariadb -u root -p
   ```

2. If you get an error that mariadb that stopped the server from accessing mariadb, even if the credentials and port number are correct, you should try to allow mariadb to be bound from ipv6

   ```bash
      sudo nvim /etc/mysql/mariadb.conf.d/50-server.cnf
      #replace `bind-address = 127.0.0.1` with `bind-address = ::`
      sudo systemctl restart mariadb.service
   ```

## License

[GNU General Public License v2.0](https://choosealicense.com/licenses/gpl-2.0/)
