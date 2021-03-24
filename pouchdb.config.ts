export default {
  log: true,
  databases: [
    {
      name: "testLocalCouchAttrAndUrl",
      url: "http://admin:admin@127.0.0.1:3000/",
      hostname: "127.0.0.1",
      port: 5984,
      username: "admin",
      password: "admin",
      type: "COUCH",
    },
  ],
};
