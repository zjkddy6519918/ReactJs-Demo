import db from './firebaseUtils';
import dbConstants from '../constants/databaseConstants';

/* Name of the users collection in the database */
const BOOKING_COLLECTION = dbConstants.collections.BOOKINGS;

const createBooking = (booking, userId) => {
  const customer = booking.customer || '';
  const shipmentType = booking.shipmentType || '';
  const shipmentName = booking.shipmentName || '';
  const boxNumber = booking.boxNumber || '';
  const destAddress = booking.destAddress || '';
  const pickupAddress = booking.pickupAddress || '';
  const departDate = booking.departDate || '';
  const arrivalDate = booking.arrivalDate || '';
  const message = booking.message || '';

  return db.collection(BOOKING_COLLECTION).add({
    bookingRequest: {
      userId: userId,
      customer: customer,
      shipmentType: shipmentType,
      shipmentName: shipmentName,
      boxNumber: boxNumber,
      destAddress: destAddress,
      pickupAddress: pickupAddress,
      departDate: getDate(departDate),
      arrivalDate: getDate(arrivalDate),
      message: message
    },
    bookingAck: {
      status: 'To be Approved',
      hblNumber: '',
      pickupDate: null,
      pickupTime: null,
      message: ''
    }
  });
};

/**
 * Finds booker with a certain id in the database
 */
const findBookingWithId = (id) => {
  return db.collection(BOOKING_COLLECTION)
    .doc(id)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.exists) {
        let booking = querySnapshot.data();
        booking.id = querySnapshot.id;
        return booking;
      } else {
        throw(new Error('Booking is not found'))
      }
    });
};

/**
 * Finds bookings with user ID
 */
const findBookingsWithUser = (id) => {
  const bookings = [];
  return db.collection(BOOKING_COLLECTION)
    .where("bookingRequest.userId", "==", id)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let booking = doc.data();
        booking.id = doc.id;
        bookings.push(booking)
      });
      return bookings;
    })
};

const getAllBookings = () => {
  const bookings = [];
  return db.collection(BOOKING_COLLECTION)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let booking = doc.data();
        booking.id = doc.id;
        bookings.push(booking)
      });
      return bookings;
    })
};

const updateBookingAck = (bookingId, bookingAck) => {
  return db.collection(BOOKING_COLLECTION)
    .doc(bookingId)
    .update({
      bookingAck: {
        status: bookingAck.status || 'To be approved',
        hblNumber: bookingAck.hblNumber || '',
        pickupDate: getDate(bookingAck.pickupDate) || '',
        pickupTime: getTime(bookingAck.pickupTime) || '',
        message: bookingAck.message || ''
      }
    })
    .then(() => {
      return findBookingWithId(bookingId);
    })
};

const getDate = (momentObject) => {
  return momentObject ?
    momentObject.format('MM-DD-YYYY') :
    null;
};

const getTime = (momentObject) => {
  return momentObject ?
    momentObject.format('HH:mm:ss') :
    null;
};

export default {
  createBooking: createBooking,
  findBookingForUser: findBookingsWithUser,
  findBooking: findBookingWithId,
  getAllBookings: getAllBookings,
  updateBookingAck: updateBookingAck,

  getDate: getDate,
  getTime: getTime
};