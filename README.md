# Portal - A Collaborative Bulletin board

To see the live site got to: [Portal - An entry to your ideas](http://inportal.space/)

This app uses a React frontend, Node express backend and a MySQL database

How to set up portal using this git repo?

### **App set up**

- navigate to the client folder and run:

```
$ npm install
$ npm start
```

- navigate to the server folder and run:

```
$ npm install
$ npm nodemon server.js
```

> NOTE: Before moving on to the next steps, ensure you have MySQL installed on you machine.

Change the configuration of the portal/server/knexfile.js to include your username and password

```
module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      user: <username>,
      password: <password>,
      database: <database_name>,
      charset: "utf8",
    },
  },
};
```

Create the database in mysql:

```
mysql> CREATE DATABASE <database_name>;
```

Setting up the database:

```
$ npx knex migrate:latest
```

If you need to remove the portals table from your database:

```
$ npx knex migrate:rollback
```

or

```
$ npx knex migrate:down
```

Congratulations! You have your very own version Portal.

> Please note that while you have your own version of Portal, the websocket server required for Live Collaboration is run on `ws:inportal.space:1234`
>
> To make your own websocket, look into [y-websocket](https://github.com/yjs/y-websocket).
