
# mpouchdb-config
![Awesome Badges](https://img.shields.io/badge/advice-dont_use_it_now-orange.svg)
![Awesome Badges](https://img.shields.io/badge/cause-still_in_development-blue.svg)
![PouchDB Logo](https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmiro.medium.com%2Fmax%2F1280%2F1*z6xxDAhcYb3qG5E61ArbhA.png)

![Maintained][maintained-badge]
[![Git Build Status][build-badge]][build]
[![License](http://img.shields.io/badge/Licence-MIT-brightgreen.svg)](LICENSE.md)

[![Watch on GitHub][github-watch-badge]][github-watch][![Star on GitHub][github-star-badge]][github-star]

# Introduction

Initialize your pouchdb databases easily with a configuration file

Currently runs with:

- pouchdb v7.2.2
- pouchorm v1.3.0

With this lib, you can :

- Easily configure pouchdb databases 

## Getting Started

Install library using :  

``` bash
npm i @npmineral/pouchdb-config
```

## Configuration file

You can setup your configuration in several ways :
 - in `mconfig.config.js` or `mconfig.config.ts`
 - in `package.json` under `mpouch` attribute
 - indicate the config file path when running the program
``` bash
 mpouchdb --config "path-to-file"
```

## Usage

Set your configuration file with those attributes :

```typescript
interface IDatabaseConfiguration {
  id?: string;
  name?: string;
  url?: string;
  protocol?: string;
  hostname?: string;
  port?: string | number;
  username?: string;
  password?: string;
  type?: POUCH_DB_TYPE;
}
```
You can create  `validate` method returns an array of `ValidationError` objects. Each `ValidationError` is:
Create a config file  **in a terminal window**

``` bash
cat > pouchdb.config.js
```

## Database types

It is possible to create all pouchdb database types

- IndexedDB
- WebSQL
- HTTP (CouchDB)
- LevelDB

Using one a these type
```typescript
enum POUCH_DB_TYPE {
  HTTP,
  LEVEL,
  INDEXED,
  WEBSQL,
}
```
> Note: you can create local or remote databases.

#### Local

You have to indicate at least the `name` attribute

#### Remote

You have to indicate at least the `url` attribute or all others.
If you indicate both `url` and others, others will be considered
For example :
```json
{
  "url": "http://db-hostname:5984.com/db-name",
  "name": "my-db-name"
}
```
The name of the database will be `"my-db-name"`

[build-badge]: https://github.com/FlitHub/local-storage-api.svg?branch=master&style=style=flat-square

[build]: https://github.com/FlitHub/local-storage-api

[license-badge]: https://img.shields.io/badge/license-Apache2-blue.svg?style=style=flat-square

[license]: https://github.com/FlitHub/local-storage-api/blob/master/LICENSE.md

[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square

[prs]: http://makeapullrequest.com

[github-watch-badge]: https://img.shields.io/github/watchers/FlitHub/local-storage-api.svg?style=social

[github-watch]: https://github.com/FlitHub/local-storage-api/watchers

[github-star-badge]: https://img.shields.io/github/stars/FlitHub/local-storage-api.svg?style=social

[github-star]: https://github.com/FlitHub/local-storage-api/stargazers

[maintained-badge]: https://img.shields.io/badge/maintained-yes-brightgreen
