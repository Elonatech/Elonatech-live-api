const { mailchimp_url, mailchimp_api_key } = require('../config/key')


const mailChimp = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    // Make sure fields are filled
    if (!email) {
      return res.status(400).send('Please fill out this field');
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
        Authorization: `auth ${mailchimp_api_key}`
      },
      body: postData
    })

    return res.status(200).send('Email Sent Successfully');

  } catch (error) {
    console.log(error)
  }
}



module.exports = { mailChimp }