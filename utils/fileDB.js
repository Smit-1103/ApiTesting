const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '..', 'users.json');

function getUsers() {
  const data = fs.readFileSync(dataPath);
  return JSON.parse(data);
}

function saveUsers(users) {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
}

module.exports = { getUsers, saveUsers };
