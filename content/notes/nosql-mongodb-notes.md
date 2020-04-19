+++
title = "MongoDB and NoSQL Databases"
author = ["Shreyas Ragavan"]
lastmod = 2019-07-06T12:12:19-06:00
tags = ["NoSQL", "Data-Science", "mongoDB"]
categories = ["programming", "database", "NoSQL"]
draft = false
linktitle = "NoSQL / mongoDB notes"
toc = true
[menu.docs]
  identifier = "mongodb-and-nosql-databases"
  weight = 2001
+++

## Introduction {#introduction}

These are my notes on NoSQL databases and the prime differences between them and SQL databases. The notes are mostly based off the Udemy course [Introduction to MongoDB](https://www.udemy.com/introduction-to-mongodb/), and therefore primarily focused on using MongoDB at the moment.


### Methodology and Tools {#methodology-and-tools}


## Installing Mongodb {#installing-mongodb}

The instructions are available in the [mongoDB manual](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/). This is for the Community edition, and on a Mac as welll as Linux machine (Antergos)


### Mac {#mac}

If never installed before, tap the resource first.

```shell
brew tap mongodb/brew
```

Actual installation:
Note the version being specified. This could change in the future. It may be possible that specifying `mongodb-community` along is sufficient to get the latest version, otherwise a specific version shellould be specified.

```shell
brew install mongodb-community@4.0
```

To know the packages available, a search could be performed using brew. However, the latest package 4.0 is not listed in the search.

```shell
brew search mongodb-community
```


### Antergos (Linux) {#antergos--linux}

Mongodb and Compass are available in AUR. The development and beta versions of these packages are also available. _Note: the Arch wiki clearly states that the mongodb package builds from source and will take several hours to complete. The pre-compiled bin package is the better choice._

Searching for relevant Packages:

```shell
yaourt -Ss mongodb
```

Installing packages:

```shell
yaourt -S mongodb-bin
yaourt -S mongodb-compass-community
```

_Note that mongodb-compass does not install mongodb as a requirement or dependency. There also seem to be a lot of python 2 dependencies for mongodb. This can be viewed during the build process._


### Configuration files and paths {#configuration-files-and-paths}

The following directories and files are created during the installation:

-   the configuration file (/usr/local/etc/mongod.Conf)
-   the log directory path (/usr/local/var/log/Mongodb)
-   the data directory path (/usr/local/var/mongodb)


## Running mongoDB {#running-mongodb}

It appears that the config file cannot be set without activating mongoDB as a service or a daemon first, the config file cannot be set.

As a service via brew:

```shell
brew services start mongodb-community@4.0
```

Setting the configuration file:

```shell
mongod --config /usr/local/etc/mongod.conf
```

Check whether mongoDB is Running

```shell
mongod
```

Running the above shows an error that the socket is already in use, which prevents mongodb from starting. I wonder if this is because of the earlier hugo server running at the same IP as specified in the config file.

Perhaps a restart will help? This would not mean the process using the 27017 port woult magically stop.

Error shell output:

```text
#+name: name2019-03-29T11:12:12.579-0600 I CONTROL  [main] Automatically disabling TLS 1.0, to force-enable TLS 1.0 specify --sslDisabledProtocols 'none'
2019-03-29T11:12:12.590-0600 I CONTROL  [initandlisten] MongoDB starting : pid=7885 port=27017 dbpath=/data/db 64-bit host=Shreyass-MacBook-Pro-2.local
2019-03-29T11:12:12.590-0600 I CONTROL  [initandlisten] db version v4.0.7
2019-03-29T11:12:12.590-0600 I CONTROL  [initandlisten] git version: 1b82c812a9c0bbf6dc79d5400de9ea99e6ffa025
2019-03-29T11:12:12.590-0600 I CONTROL  [initandlisten] allocator: system
2019-03-29T11:12:12.590-0600 I CONTROL  [initandlisten] modules: none
2019-03-29T11:12:12.590-0600 I CONTROL  [initandlisten] build environment:
2019-03-29T11:12:12.590-0600 I CONTROL  [initandlisten]     distarch: x86_64
2019-03-29T11:12:12.590-0600 I CONTROL  [initandlisten]     target_arch: x86_64
2019-03-29T11:12:12.590-0600 I CONTROL  [initandlisten] options: {}
2019-03-29T11:12:12.591-0600 E STORAGE  [initandlisten] Failed to set up listener: SocketException: Address already in use
2019-03-29T11:12:12.611-0600 I CONTROL  [initandlisten] now exiting
2019-03-29T11:12:12.611-0600 I CONTROL  [initandlisten] shutting down with code:48
```

One solution for this has been to change the port number while launching mongod Server. Since the port 2717 is busy, the subsequent (or an arbitrary) port number can be used.

```shell
mongod --port 27018
```

This brought up a new error related to the path of the database. This can be seen below with dbpath = /data/db which does not exist.

```text
2019-03-29T21:01:31.704-0600 I CONTROL  [main] Automatically disabling TLS 1.0, to force-enable TLS 1.0 specify --sslDisabledProtocols 'none'
2019-03-29T21:01:31.714-0600 I CONTROL  [initandlisten] MongoDB starting : pid=2791 port=27018 dbpath=/data/db 64-bit host=Shreyass-MacBook-Pro-2.local
2019-03-29T21:01:31.714-0600 I CONTROL  [initandlisten] db version v4.0.7
2019-03-29T21:01:31.714-0600 I CONTROL  [initandlisten] git version: 1b82c812a9c0bbf6dc79d5400de9ea99e6ffa025
2019-03-29T21:01:31.714-0600 I CONTROL  [initandlisten] allocator: system
2019-03-29T21:01:31.714-0600 I CONTROL  [initandlisten] modules: none
2019-03-29T21:01:31.714-0600 I CONTROL  [initandlisten] build environment:
2019-03-29T21:01:31.714-0600 I CONTROL  [initandlisten]     distarch: x86_64
2019-03-29T21:01:31.714-0600 I CONTROL  [initandlisten]     target_arch: x86_64
2019-03-29T21:01:31.714-0600 I CONTROL  [initandlisten] options: { net: { port: 27018 } }
2019-03-29T21:01:31.714-0600 I STORAGE  [initandlisten] exception in initAndListen: NonExistentPath: Data directory /data/db not found., terminating
2019-03-29T21:01:31.714-0600 I NETWORK  [initandlisten] shutdown: going to close listening sockets...
2019-03-29T21:01:31.741-0600 I NETWORK  [initandlisten] removing socket file: /tmp/mongodb-27018.sock
2019-03-29T21:01:31.741-0600 I CONTROL  [initandlisten] now exiting
2019-03-29T21:01:31.742-0600 I CONTROL  [initandlisten] shutting down with code:100
```

Stack Overflow discussions indicate that there are atleast 2 possible ways to resolve this as shown below.

-   Create the /data/db folder and assign the user read and write permission for the same.

```shell
sudo mkdir /data/db/
sudo chmod 600 /data/db
```

-   Start the mongod process in a specified directory.

```shell
mongod --port 27018 --dbpath ~/temp/
```

I have followed the latter approach to begin with, as the port number and path can always be changed.


## General exploration of mongo Shell {#general-exploration-of-mongo-shell}

Type in `mongo` in the terminal to enter the mongo shell.

```shell
mongo
```

Showing a list of the available dbs. The admin, config and local dbs are created by default during installation.

```shell
mongo
show dbs
```

The `use` command can be employed to switch to db's, or create dbs.

```shell
mongo
use test
```

Collection: similar to the concept of a bunch of tables in Sql. `db.createCollection('<name>')`. Existing collections can be viewed with `show connections`

```shell
mongo
use test
db.createCollection('test1')
show collections
```

_Note that the name of the collection should be enclosed within single quotes and not double quotes._


## Inserting values in a Database or collection {#inserting-values-in-a-database-or-collection}

The Insert method can be used to fill in entries that in a combination of keyword name pairs.

```shell
mongo
show dbs
db.user.insert({'name' : 'shreyas', 'height': 154})
```

Adding a few more users with a name and an Age.

```shell
mongo
db.user.insert({'name': 'joe', 'age' : 22})
db.user.insert({'name': 'sam', 'age' : 56})
db.user.insert({'name': 'siri', 'age' : 87, 'height' : 145})
db.user.insert({'name': 'pitt', 'age' : 60})
```


## Manipulating collections {#manipulating-collections}

Listing all the entries in the `use` collection can done with the find method.

```shell
mongo
db.user.find()
```

Remove method to remove an Entry (document?)

```shell
mongo
db.user.remove({'name' : 'joe'})
db.user.find()
```

Alternate specification to remove age above 60

```shell
mongo
db.user.remove({'age' : 60})
db.user.find()
```

Other than manually entering entries, there is no way to recover entries that are removed.

If no arguments are specifiedd in remove, then all the collections are Removed, as shown below.

```shell
mongo
db.users.remove({})
```


## Queries using Find {#queries-using-find}

```shell
mongo
show dbs
db.user.find()
```

The Objectid is added by mongoDB. This is a unique key generated for each document.

Grabbing just one user from the Collection/:

```shell
mongo
db.user.find({'name': 'sam'})
```

Specifying a Condition, will match all the documents that match the condition specified

```shell
mongo
db.user.find({"name":"siri"})
```

_Note: 2 entries and object ID's are being returned even when one document is present. This needs to be Checked._

Considering multiple search criterion. For example, not all the documents have the height parameter entered in. The `null` parameter can be used to filter documents with empty attributes.

```shell
mongo
db.user.insert({"name": "goldstone", "age": 50})
db.user.find({'height' : null})
```

Finding documents or users with age greater than 40. `{$gt  : 40}`. Similarly, use `$lt` for lesser than.

```shell
mongo
db.user.find({'age' : {$gt: 40}})
```

```shell
mongo
db.user.find({"age": {$lt : 60}})
```


## Updating users already inserted into the collection {#updating-users-already-inserted-into-the-collection}

Adding the height for Goldston, using `db.user.update()`. The document to be updated has to be specified first, and then the updated entry has to be keyed in.

```shell
mongo
db.user.update({"name" : "goldstone"}, {"name": "goldstone", "height" : 167})
db.user.find({"name" : "goldstone"})
db.user.find({"height" : null})
db.user.update({"name" : "sam"}, {"name" : "sam", "height" : 189})
db.user.find({"height" : null})
```


## Data Types {#data-types}

String: enclosed within quotes.
Integer: Whole number. Can be positive, negative or zero.
Float: positive or negative. Does not have to be a whole number.
Boolean: true or false. Quotes are not to be used with Booleans, otherwise it would be converted to a string.


## Primary Key {#primary-key}

-   Unique for all documents in a collection
-   Cannot have null values.
-   Additional custom keys can be created and should be for easier filtering of the data.


## Establishing Relationships {#establishing-relationships}

-   useful to create relationships between documents.
-   One to one
-   One to many
-   many to one

Example of one to many : where the same user id is the connecting property across multiple documents.

```shell
mongo
use test2
db.createCollection("one2onecoll1")
db.createCollection("one2onecoll2")
```

```shell
mongo
db.one2onecoll1.insert({
                          "user_id" : 3173,
                          "name" : "helen",
                          "age" : 24})
db.one2onecoll1.insert({
                          "user_id" : 4545,
                          "name" : "jack",
                          "age" : 45,
                      })

db.one2onecoll1.insert({
                          "user_id" : 67866,
                          "name" : "joe",
                          "age" : 65,
                          "about" : "Lorem ipsum dolor sit amet"
                      })
```

```shell
mongo
db.one2onecoll1.find()
```


## Embedded documents {#embedded-documents}

Example of using arrays to establish Relationships. Example, a friend list in a social media network. Similarly, blog posts or comments can be stored as a list of parameters.

```text
"_id" : ObjectID("Sdinaskdas123fds"),
"name" : "Lydia",
"user_id" : 78787
"friend_ids" : [ 6767, 78788, 99899, 12109 ]

```


## Embedded documents versus collections {#embedded-documents-versus-collections}

This depends on the data characteristics and should be designed such that all the necessary data could be accessed with a single query.

Thinking Examples:

-   Facebook: Homepage is accessing only a specific amount of information.
-   Reddit: Comments are not loaded unless the post is opened. So the comments could be stored as separate documents, so they are not loaded only when the posts are loaded.

Think about how to mimimise the unnecessary loading of data.


## MongoDB compass {#mongodb-compass}

MongoDB compass is a GUI for MongoDB. It helps with the visualisation of data. [Download link](https://www.mongodb.com/download-center/compass?jmp=hero). _Note: the community edition should be downloaded_.

Depending on the setup, the mongod (daemon?) has to be successfully running so that compass can connect to that instance.
