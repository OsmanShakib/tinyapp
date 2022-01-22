const getUserByEmail = function (userEmail, database) {
    for (const id in database) {
      if (database[id].email === userEmail) {
        return database[id].id;
      }
    }
  };
  function urlsForUser(id, urlDatabase) {
    const filteredUrl = {};
  
    for (let shortUrl in urlDatabase) {
      if (urlDatabase[shortUrl].userID === id) {
        filteredUrl[shortUrl] = urlDatabase[shortUrl];
      }
    }
    return filteredUrl;
  }

  function getUsers(user_id, users) {
    return users[user_id];
  }
  function generateRandomString() {
    return Math.random().toString(36).substr(2, 6);
  }
  function checkEmail(email, users) {
    for (key in users) {
      if (email === users[key].email) {
        return key;
      }
    }
  }

  module.exports = { getUserByEmail,getUsers,urlsForUser,generateRandomString,checkEmail}