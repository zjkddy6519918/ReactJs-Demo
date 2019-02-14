const nodeMailer = require('nodemailer');
const SUSANTO_BROTHER_EMAIL = 'ryioks@yahoo.com';

/**
 * Sends email to client
 */
const sendEmail = function(oldBooking, newBooking, bookingChanges, customer) {
  // console.log('Old booking: ', oldBooking);
  // console.log('New booking: ', newBooking);
  // console.log('Customer: ', customer);

  const bookingChangesMsg =
    '(Changes)\n' +
    (bookingChanges.status ? '  - Status: ' + bookingChanges.status + '\n' : '') +
    (bookingChanges.pickupDate ? '  - Pickup Date: ' + bookingChanges.pickupDate + '\n' : '') +
    (bookingChanges.pickupTime ? '  - Pickup Time: ' + bookingChanges.pickupTime + '\n' : '') +
    (bookingChanges.hblNumber ? '  - HBL Number: ' + bookingChanges.hblNumber + '\n' : '') +
    (bookingChanges.message ? '  - Message to Customer: ' + bookingChanges.message + '\n' : '')
  ;

  const newBookingMsg = `
    (New booking information)
    Booking Request:
    - Booking ID: ${newBooking.id}
    - Departure Date: ${newBooking.bookingRequest.departDate}
    - Arrival Date: ${newBooking.bookingRequest.arrivalDate}
    - Box number: ${newBooking.bookingRequest.boxNumber}
    - Shipment Name: ${newBooking.bookingRequest.shipmentName}
    - Pickup Address: ${newBooking.bookingRequest.pickupAddress}
    - Destination Address: ${newBooking.bookingRequest.destAddress}
    - Message to Shipper: ${newBooking.bookingRequest.message}
    
    Booking Acknowledgement:
    - Status: ${newBooking.bookingAck.status}
    - Pickup Date: ${newBooking.bookingAck.pickupDate}
    - Pickup Time: ${newBooking.bookingAck.pickupTime}
    - HBL Number: ${newBooking.bookingAck.hblNumber}
    - Message to Customer: ${newBooking.bookingAck.message}
  `;
  const oldBookingMsg = `
    (Old booking information)
    Booking Request:
    - Booking ID: ${oldBooking.id}
    - Departure Date: ${oldBooking.bookingRequest.departDate}
    - Arrival Date: ${oldBooking.bookingRequest.arrivalDate}
    - Box number: ${oldBooking.bookingRequest.boxNumber}
    - Shipment Name: ${oldBooking.bookingRequest.shipmentName}
    - Pickup Address: ${oldBooking.bookingRequest.pickupAddress}
    - Destination Address: ${oldBooking.bookingRequest.destAddress}
    - Message to Shipper: ${oldBooking.bookingRequest.message}
    
    Booking Acknowledgement:
    - Status: ${oldBooking.bookingAck.status}
    - Pickup Date: ${oldBooking.bookingAck.pickupDate}
    - Pickup Time: ${oldBooking.bookingAck.pickupTime}
    - HBL Number: ${oldBooking.bookingAck.hblNumber}
    - Message to Customer: ${oldBooking.bookingAck.message}
  `;
  const message = `
    Below are the information of this shipment booking:
    
    ${bookingChangesMsg}
    ${newBookingMsg}
    ${oldBookingMsg}
  `;

  const customerMessage = `Hi ${customer.name}, \n ${message}`;
  const brotherMessage = `Hi Susanto's brother, \n ${message}`;;

  /* Send emails to customer and susanto's brother */
  sendEmailToUser(customerMessage, customer.email);
  sendEmailToUser(brotherMessage, SUSANTO_BROTHER_EMAIL);
};

const sendEmailToUser = (message, recepientEmail) => {
  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'swen90016.redteam@gmail.com',
      pass: 'Redteam1'
    }
  });

  const mailOptions = {
    from: 'RED Team',
    to: recepientEmail,
    subject: 'Booking update',
    text: message
  };

  console.log('Sending email to ', recepientEmail);
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = {
  sendEmail: sendEmail
};
