import db from './firebaseUtils';
import dbConstants from '../constants/databaseConstants';
import localConst from '../constants/localStorageConstants';

/* Name of the users collection in the database */
const USER_COLLECTION = dbConstants.collections.USERS;

/**
 * Authenticates user by finding if a document with this email and password
 * exists in the database's "users" collection.
 */
const authenticateUser = (form) => {
  const email = form.email || '';
  const password = form.password || '';

  return db.collection(USER_COLLECTION)
    .where('email', '==', email)
    .where('password', '==', password)
    .get()
    .then((querySnapshot) => {

      /* If user not found in database, throw an error.
       * Otherwise, store user data in the local storage and return it to the calling function. */
      if (querySnapshot.empty) {
        throw new Error('Invalid email or password!');
      } else {
        const userId = querySnapshot.docs[0].id;
        const userDetails = querySnapshot.docs[0].data();

        console.log('User details: ', userDetails);

        storeUserDetails(userId, userDetails);

        return userDetails;
      }
  });
};

/**
 * Creates a user (used for register) when email is not in the database yet.
 * Otherwise, throw an error for creating a user with duplicate email.
 */
const createUser = (user) => {
  const address = user.address || '';
  const contactNumber = user.contactNumber || '';
  const email = user.email || '';
  const name= user.name || '';
  const password = user.password || '';

  return findUserWithEmail(email)
    .then((userNotFound) => {
      if (!userNotFound) {
        throw new Error('User with this email already exists!');
      }
    })
    .then(() => {
      return db.collection(USER_COLLECTION).add({
        address: address,
        contactNumber: contactNumber,
        email: email,
        name: name,
        password: password
      });
    })
};

/**
 * Finds user with a certain email in the database
 */
const findUserWithEmail = (email) => {
  return db.collection('users')
    .where('email', '==', email)
    .get()
    .then((querySnapshot) => {
      return querySnapshot.empty;
    });
};

/**
 * Finds user with a certain id in the database
 */
const findUserWithId = (id) => {
  return db.collection('users')
    .doc(id)
    .get()
    .then((querySnapshot) => {
      return querySnapshot.data();
    });
};

/**
 * Stores user ID and user details in the local storage
 */
const storeUserDetails = (userId, userDetails) => {
  localStorage.setItem(localConst.USER_ID, userId);
  localStorage.setItem(localConst.USER, JSON.stringify(userDetails)); // when storing objects, need to store as string
  console.log('Stored user details');
};

const updateUser = (userId, userDetails) => {
  const isAdmin = JSON.parse(localStorage.getItem(localConst.USER)).isAdmin || false;

  return db.collection(USER_COLLECTION)
    .doc(userId)
    .set({
      address: userDetails.address,
      contactNumber: userDetails.contactNumber,
      email: userDetails.email,
      name: userDetails.name,
      password: userDetails.password,
      isAdmin: isAdmin
    })
    .then(() => {
      return findUserWithId(userId);
    });
};

export default {
  authenticateUser: authenticateUser,
  createUser: createUser,
  findUserWithEmail: findUserWithEmail,
  findUserWithId: findUserWithId,
  updateUser: updateUser,
  storeUserDetails: storeUserDetails
};
