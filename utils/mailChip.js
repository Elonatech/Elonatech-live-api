const { mailchimp_url, mailchimp_api_key } = require('../config/key')
const Subscriber = require('../model/subscriberModel');


const mailChimp = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    // Make sure fields are filled
    if (!email) {
      return res.status(400).send('Please fill out this field');
    }

    // Save the subscriber locally FIRST (upsert avoids a duplicate-key crash
    // if they subscribe again) so the admin Subscribers list is populated even
    // if the Mailchimp call fails.
    try {
      await Subscriber.updateOne({ email }, { $set: { email } }, { upsert: true });
    } catch (error) {
      console.error("Subscriber save error:", error);
    }

    const data = {
      members: [
        {
          email_address: email,
          status: 'subscribed',
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName
          }
        }
      ]
    };

    const postData = JSON.stringify(data);

    const sendData = await fetch(mailchimp_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `auth ${mailchimp_api_key}`
      },
      body: postData
    })

    if (!sendData.ok) {
      const errorBody = await sendData.text();
      console.error("Mailchimp subscribe error:", sendData.status, errorBody);
      return res.status(502).send('Failed to subscribe. Please try again.');
    }

    return res.status(200).send('Email Sent Successfully');

  } catch (error) {
    console.error("Mailchimp subscribe error:", error);
    return res.status(500).send('Failed to subscribe. Please try again.');
  }
}



module.exports = { mailChimp }