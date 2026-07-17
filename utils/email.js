

const nodemailer = require('nodemailer');

const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY) // Dead code

const transporter = nodemailer.createTransport({
  host: "mail.elonatech.com.ng",
  port: 465,
  secure: true,
  // debug: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  // mail.elonatech.com.ng's cert chain is incomplete (missing intermediate) —
  // without this, every send fails with "unable to verify the first certificate"
  tls: {
    rejectUnauthorized: false
  }
});

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const jobEmail = async (req, res) => {

  try {

    let { firstname, lastname, email, number, gender, address, dob, category, status, letter, skill } = req.body;

    let parsedSkills = [];
    if (typeof skill === "string") {
      parsedSkills = skill.split(',').map(s => s.trim()).filter(s => s !== "");
    } else if (Array.isArray(skill)) {
      parsedSkills = skill;
    }

    console.log('Type of skills:', typeof skill);
    console.log('Parsed skills array:', parsedSkills);

    const safeLetter = letter && letter.trim() !== ""
      ? letter
      : "<p><em>No cover letter provided.</em></p>";

    if (!firstname || !lastname || !email || !number || !category || !status || !gender || !address || !dob || parsedSkills.length === 0) {
      return res.status(400).json({
        message: "Please ensure all fields are filled correctly",
      });
    }

    if (req.fileValidationError) {
      return res.status(400).json({ message: "Invalid File Type Pdf Only" });
    }

    const file = req.file

    if (!file) {
      return res.status(400).json({ message: "No File Received" });
    }


    const mailOptions = {
      from: 'noreply@elonatech.com.ng',
      // replyTo: 'noreply@elonatech.com.ng',
      to: email,
      bcc: ["recruitment@elonatech.com.ng"],
      subject: `New Job Application — ${firstname} ${lastname}`,
      html: `<!DOCTYPE html>
        <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
        <head>
          <title>New Job Application</title>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
          <!--[if !mso]><!-->
          <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Oxygen:wght@300;400;700&display=swap" rel="stylesheet" type="text/css">
          <!--<![endif]-->
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 0; }
            a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
            #MessageViewBody a { color: inherit; text-decoration: none; }
            p { line-height: inherit; }
            .image_block img+div { display: none; }
            @media (max-width: 640px) {
              .row-content { width: 100% !important; }
              .stack .column { width: 100%; display: block; }
              .field-row td { display: block !important; width: 100% !important; }
            }
          </style>
        </head>
        <body style="background-color:#e8ecf0;margin:0;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;background-color:#e8ecf0;">
            <tbody><tr><td style="padding:24px 0;">
              <!-- HEADER -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;border-radius:8px 8px 0 0;overflow:hidden;background-color:#1a3a6b;">
                <tbody><tr>
                  <td style="padding:28px 40px;text-align:center;">
                    <img src="https://elonatech.com.ng/static/media/elonatech.c6083e7d06b4cbab7d90.png"
                      width="180" height="auto" alt="Elonatech" style="display:block;margin:0 auto 16px;height:auto;border:0;">
                    <div style="display:inline-block;background-color:#f0a500;border-radius:4px;padding:4px 14px;margin-bottom:12px;">
                      <span style="font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1.5px;">Job Application</span>
                    </div>
                    <h1 style="margin:0;color:#ffffff;font-family:Oswald,sans-serif;font-size:28px;font-weight:700;line-height:1.2;">New Job Application</h1>
                    <p style="margin:8px 0 0;color:#a8c4e8;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:13px;">Submitted on ${new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </td>
                </tr></tbody>
              </table>
              <!-- SUMMARY BAND -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;background-color:#f0a500;">
                <tbody><tr>
                  <td style="padding:14px 40px;text-align:center;">
                    <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:15px;font-weight:700;color:#1a3a6b;">${firstname} ${lastname} &mdash; ${category}</p>
                  </td>
                </tr></tbody>
              </table>
              <!-- BODY CARD -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;background-color:#ffffff;">
                <tbody><tr><td style="padding:32px 40px;">
                  <p style="margin:0 0 20px;font-family:Oswald,sans-serif;font-size:13px;font-weight:600;color:#1a3a6b;text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid #1a3a6b;padding-bottom:8px;">Applicant Details</p>
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding:12px 12px 12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">First Name</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${firstname}</p></td>
                      <td width="50%" style="padding:12px 0 12px 12px;vertical-align:top;border-bottom:1px solid #eeeeee;border-left:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Last Name</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${lastname}</p></td>
                    </tr></tbody>
                  </table>
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding:12px 12px 12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Email Address</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;"><a href="mailto:${email}" style="color:#1a3a6b;text-decoration:none;">${email}</a></p></td>
                      <td width="50%" style="padding:12px 0 12px 12px;vertical-align:top;border-bottom:1px solid #eeeeee;border-left:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Phone Number</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${number}</p></td>
                    </tr></tbody>
                  </table>
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding:12px 12px 12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Gender</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${gender}</p></td>
                      <td width="50%" style="padding:12px 0 12px 12px;vertical-align:top;border-bottom:1px solid #eeeeee;border-left:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Date of Birth</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${dob}</p></td>
                    </tr></tbody>
                  </table>
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding:12px 12px 12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Job Category</p>
                        <p style="margin:0;"><span style="display:inline-block;background-color:#e8f0fc;color:#1a3a6b;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:13px;font-weight:600;padding:4px 10px;border-radius:20px;">${category}</span></p></td>
                      <td width="50%" style="padding:12px 0 12px 12px;vertical-align:top;border-bottom:1px solid #eeeeee;border-left:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Current Status</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${status}</p></td>
                    </tr></tbody>
                  </table>
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td style="padding:12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Residential Address</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${address}</p></td>
                    </tr></tbody>
                  </table>
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td style="padding:12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Skills</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${parsedSkills.join(", ")}</p></td>
                    </tr></tbody>
                  </table><p style="margin:20px 0 10px;font-family:Oswald,sans-serif;font-size:13px;font-weight:600;color:#1a3a6b;text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid #1a3a6b;padding-bottom:8px;">Cover Letter</p>
                  <div style="background-color:#f7f9fc;border-left:4px solid #1a3a6b;border-radius:0 6px 6px 0;padding:18px 20px;">
                    <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#333333;line-height:1.8;">${safeLetter}</p>
                  </div><p style="margin:16px 0 0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:12px;color:#888888;font-style:italic;">CV / Resume is attached to this email.</p>
                </td></tr></tbody>
              </table>
              <!-- FOOTER -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;background-color:#11253d;border-radius:0 0 8px 8px;overflow:hidden;">
                <tbody><tr>
                  <td style="padding:24px 40px;text-align:center;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center"
                      style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin:0 auto 16px;">
                      <tbody><tr>
                        <td style="padding:0 4px;"><a href="https://www.facebook.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/facebook@2x.png" width="28" height="28" alt="Facebook" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.instagram.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/instagram@2x.png" width="28" height="28" alt="Instagram" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.threads.com/@elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/threads@2x.png" width="28" height="28" alt="Threads" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.tiktok.com/@.elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/tiktok@2x.png" width="28" height="28" alt="TikTok" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.twitter.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/twitter@2x.png" width="28" height="28" alt="Twitter" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.linkedin.com/company/elonatech/" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/linkedin@2x.png" width="28" height="28" alt="LinkedIn" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.youtube.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/youtube@2x.png" width="28" height="28" alt="YouTube" style="display:block;border:0;"></a></td>
                      </tr></tbody>
                    </table>
                    <p style="margin:0 0 4px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:12px;font-weight:700;color:#ffffff;">
                      Elonatech Nigeria Limited &copy; ${new Date().getFullYear()} &mdash; All rights reserved
                    </p>
                    <p style="margin:0 0 8px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;color:#7a9cc4;">
                      You can view our <a href="http://www.elonatech.com.ng/policy" target="_blank" rel="noopener" style="color:#56B500;text-decoration:underline;">Privacy Policy</a>.
                    </p>
                    <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;color:#7a9cc4;">
                      This email was sent to <a href="mailto:${email}" style="color:#7a9cc4;text-decoration:underline;">${email}</a>
                    </p>
                  </td>
                </tr></tbody>
              </table>
            </td></tr></tbody>
          </table>
        </body>
        </html>`,
      attachments: file ? [{
        filename: file.originalname,
        content: file.buffer.toString('base64'),
        encoding: 'base64'
      }] : []
    }

    await transporter.sendMail(mailOptions);

    res.json({
      status: "success",
      message: "Application submitted successfully"
    });

    console.log('Received body:', req.body);
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to send email"
    });
  }
}

const quoteEmail = async (req, res) => {

  try {
    const { fullname, email, company, number, project, location, letter } = req.body;

    if (!fullname || !company || !email || !number || !project || !location || !letter) {
      return res.status(400).send("Please Fill All Fields")
    }

    const mailOptions = {
      from: "noreply@elonatech.com.ng",
      replyTo: "noreply@elonatech.com.ng",
      to: email,
      bcc: ["info@elonatech.com.ng"],
      subject: `Quote Request — ${fullname}`,
      html: `<!DOCTYPE html>
        <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
        <head>
          <title>Quote Request</title>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
          <!--[if !mso]><!-->
          <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Oxygen:wght@300;400;700&display=swap" rel="stylesheet" type="text/css">
          <!--<![endif]-->
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 0; }
            a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
            #MessageViewBody a { color: inherit; text-decoration: none; }
            p { line-height: inherit; }
            .image_block img+div { display: none; }
            @media (max-width: 640px) {
              .row-content { width: 100% !important; }
              .stack .column { width: 100%; display: block; }
              .field-row td { display: block !important; width: 100% !important; }
            }
          </style>
        </head>
        <body style="background-color:#e8ecf0;margin:0;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;background-color:#e8ecf0;">
            <tbody><tr><td style="padding:24px 0;">
              <!-- HEADER -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;border-radius:8px 8px 0 0;overflow:hidden;background-color:#1a3a6b;">
                <tbody><tr>
                  <td style="padding:28px 40px;text-align:center;">
                    <img src="https://elonatech.com.ng/static/media/elonatech.c6083e7d06b4cbab7d90.png"
                      width="180" height="auto" alt="Elonatech" style="display:block;margin:0 auto 16px;height:auto;border:0;">
                    <div style="display:inline-block;background-color:#f0a500;border-radius:4px;padding:4px 14px;margin-bottom:12px;">
                      <span style="font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1.5px;">Quote Request</span>
                    </div>
                    <h1 style="margin:0;color:#ffffff;font-family:Oswald,sans-serif;font-size:28px;font-weight:700;line-height:1.2;">Quote Request</h1>
                    <p style="margin:8px 0 0;color:#a8c4e8;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:13px;">Submitted on ${new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </td>
                </tr></tbody>
              </table>
              <!-- SUMMARY BAND -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;background-color:#f0a500;">
                <tbody><tr>
                  <td style="padding:14px 40px;text-align:center;">
                    <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:15px;font-weight:700;color:#1a3a6b;">${fullname} &mdash; ${company}</p>
                  </td>
                </tr></tbody>
              </table>
              <!-- BODY CARD -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;background-color:#ffffff;">
                <tbody><tr><td style="padding:32px 40px;">
                  <p style="margin:0 0 20px;font-family:Oswald,sans-serif;font-size:13px;font-weight:600;color:#1a3a6b;text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid #1a3a6b;padding-bottom:8px;">Request Details</p>
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding:12px 12px 12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Full Name</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${fullname}</p></td>
                      <td width="50%" style="padding:12px 0 12px 12px;vertical-align:top;border-bottom:1px solid #eeeeee;border-left:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Email Address</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;"><a href="mailto:${email}" style="color:#1a3a6b;text-decoration:none;">${email}</a></p></td>
                    </tr></tbody>
                  </table>
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding:12px 12px 12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Company</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${company}</p></td>
                      <td width="50%" style="padding:12px 0 12px 12px;vertical-align:top;border-bottom:1px solid #eeeeee;border-left:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Phone Number</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${number}</p></td>
                    </tr></tbody>
                  </table>
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding:12px 12px 12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Project Type</p>
                        <p style="margin:0;"><span style="display:inline-block;background-color:#e8f0fc;color:#1a3a6b;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:13px;font-weight:600;padding:4px 10px;border-radius:20px;">${project}</span></p></td>
                      <td width="50%" style="padding:12px 0 12px 12px;vertical-align:top;border-bottom:1px solid #eeeeee;border-left:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Location</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${location}</p></td>
                    </tr></tbody>
                  </table><p style="margin:20px 0 10px;font-family:Oswald,sans-serif;font-size:13px;font-weight:600;color:#1a3a6b;text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid #1a3a6b;padding-bottom:8px;">Project Brief</p>
                  <div style="background-color:#f7f9fc;border-left:4px solid #1a3a6b;border-radius:0 6px 6px 0;padding:18px 20px;">
                    <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#333333;line-height:1.8;">${letter}</p>
                  </div>
                </td></tr></tbody>
              </table>
              <!-- FOOTER -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;background-color:#11253d;border-radius:0 0 8px 8px;overflow:hidden;">
                <tbody><tr>
                  <td style="padding:24px 40px;text-align:center;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center"
                      style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin:0 auto 16px;">
                      <tbody><tr>
                        <td style="padding:0 4px;"><a href="https://www.facebook.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/facebook@2x.png" width="28" height="28" alt="Facebook" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.instagram.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/instagram@2x.png" width="28" height="28" alt="Instagram" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.threads.com/@elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/threads@2x.png" width="28" height="28" alt="Threads" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.tiktok.com/@.elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/tiktok@2x.png" width="28" height="28" alt="TikTok" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.twitter.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/twitter@2x.png" width="28" height="28" alt="Twitter" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.linkedin.com/company/elonatech/" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/linkedin@2x.png" width="28" height="28" alt="LinkedIn" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.youtube.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/youtube@2x.png" width="28" height="28" alt="YouTube" style="display:block;border:0;"></a></td>
                      </tr></tbody>
                    </table>
                    <p style="margin:0 0 4px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:12px;font-weight:700;color:#ffffff;">
                      Elonatech Nigeria Limited &copy; ${new Date().getFullYear()} &mdash; All rights reserved
                    </p>
                    <p style="margin:0 0 8px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;color:#7a9cc4;">
                      You can view our <a href="http://www.elonatech.com.ng/policy" target="_blank" rel="noopener" style="color:#56B500;text-decoration:underline;">Privacy Policy</a>.
                    </p>
                    <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;color:#7a9cc4;">
                      This email was sent to <a href="mailto:${email}" style="color:#7a9cc4;text-decoration:underline;">${email}</a>
                    </p>
                  </td>
                </tr></tbody>
              </table>
            </td></tr></tbody>
          </table>
        </body>
        </html>`
    }

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");

      return res.json({
        status: "success",
        message: "Quote request sent successfully"
      });

    } catch (error) {
      console.error("Email sending error:", error);
      return res.status(500).json({
        status: "error",
        message: "Failed to send email"
      });
    }
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to send email"
    });
  }
}

const consultEmail = async (req, res) => {

  const { name, email, occupation, challenge, business, cost, invest } = req.body;


  if (!name) {
    return res.status(400).send("Name is Required")
  }

  if (!email) {
    return res.status(400).send("Email is Required")
  }

  if (!occupation) {
    return res.status(400).send("What you do is Required")
  }
  if (!challenge) {
    return res.status(400).send("Challenges is Required")
  }
  if (!business) {
    return res.status(400).send("Business is Required")
  }
  if (!cost) {
    return res.status(400).send("Cost is Required")
  }
  if (!invest) {
    return res.status(400).send("Invest is Required")
  }



  const mailOptions = {
    from: "noreply@elonatech.com.ng",
    replyTo: "noreply@elonatech.com.ng",
    to: email,
    bcc: ["info@elonatech.com.ng"],
    subject: `Consultation Request — ${name}`,
    html: `<!DOCTYPE html>
        <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
        <head>
          <title>Consultation Request</title>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
          <!--[if !mso]><!-->
          <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Oxygen:wght@300;400;700&display=swap" rel="stylesheet" type="text/css">
          <!--<![endif]-->
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 0; }
            a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
            #MessageViewBody a { color: inherit; text-decoration: none; }
            p { line-height: inherit; }
            .image_block img+div { display: none; }
            @media (max-width: 640px) {
              .row-content { width: 100% !important; }
              .stack .column { width: 100%; display: block; }
              .field-row td { display: block !important; width: 100% !important; }
            }
          </style>
        </head>
        <body style="background-color:#e8ecf0;margin:0;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;background-color:#e8ecf0;">
            <tbody><tr><td style="padding:24px 0;">
              <!-- HEADER -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;border-radius:8px 8px 0 0;overflow:hidden;background-color:#1a3a6b;">
                <tbody><tr>
                  <td style="padding:28px 40px;text-align:center;">
                    <img src="https://elonatech.com.ng/static/media/elonatech.c6083e7d06b4cbab7d90.png"
                      width="180" height="auto" alt="Elonatech" style="display:block;margin:0 auto 16px;height:auto;border:0;">
                    <div style="display:inline-block;background-color:#f0a500;border-radius:4px;padding:4px 14px;margin-bottom:12px;">
                      <span style="font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1.5px;">Consultation</span>
                    </div>
                    <h1 style="margin:0;color:#ffffff;font-family:Oswald,sans-serif;font-size:28px;font-weight:700;line-height:1.2;">Consultation Request</h1>
                    <p style="margin:8px 0 0;color:#a8c4e8;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:13px;">Submitted on ${new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </td>
                </tr></tbody>
              </table>
              <!-- SUMMARY BAND -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;background-color:#f0a500;">
                <tbody><tr>
                  <td style="padding:14px 40px;text-align:center;">
                    <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:15px;font-weight:700;color:#1a3a6b;">${name} &mdash; ${occupation}</p>
                  </td>
                </tr></tbody>
              </table>
              <!-- BODY CARD -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;background-color:#ffffff;">
                <tbody><tr><td style="padding:32px 40px;">
                  <p style="margin:0 0 20px;font-family:Oswald,sans-serif;font-size:13px;font-weight:600;color:#1a3a6b;text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid #1a3a6b;padding-bottom:8px;">Consultation Details</p>
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding:12px 12px 12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Full Name</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${name}</p></td>
                      <td width="50%" style="padding:12px 0 12px 12px;vertical-align:top;border-bottom:1px solid #eeeeee;border-left:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Email Address</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;"><a href="mailto:${email}" style="color:#1a3a6b;text-decoration:none;">${email}</a></p></td>
                    </tr></tbody>
                  </table>
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding:12px 12px 12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Occupation</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${occupation}</p></td>
                      <td width="50%" style="padding:12px 0 12px 12px;vertical-align:top;border-bottom:1px solid #eeeeee;border-left:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Business Stage</p>
                        <p style="margin:0;"><span style="display:inline-block;background-color:#e8f0fc;color:#1a3a6b;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:13px;font-weight:600;padding:4px 10px;border-radius:20px;">${business}</span></p></td>
                    </tr></tbody>
                  </table>
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding:12px 12px 12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Budget</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${cost}</p></td>
                      <td width="50%" style="padding:12px 0 12px 12px;vertical-align:top;border-bottom:1px solid #eeeeee;border-left:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Willing to Invest</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${invest}</p></td>
                    </tr></tbody>
                  </table><p style="margin:20px 0 10px;font-family:Oswald,sans-serif;font-size:13px;font-weight:600;color:#1a3a6b;text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid #1a3a6b;padding-bottom:8px;">Key Challenges</p>
                  <div style="background-color:#f7f9fc;border-left:4px solid #1a3a6b;border-radius:0 6px 6px 0;padding:18px 20px;">
                    <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#333333;line-height:1.8;">${challenge}</p>
                  </div>
                </td></tr></tbody>
              </table>
              <!-- FOOTER -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;background-color:#11253d;border-radius:0 0 8px 8px;overflow:hidden;">
                <tbody><tr>
                  <td style="padding:24px 40px;text-align:center;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center"
                      style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin:0 auto 16px;">
                      <tbody><tr>
                        <td style="padding:0 4px;"><a href="https://www.facebook.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/facebook@2x.png" width="28" height="28" alt="Facebook" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.instagram.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/instagram@2x.png" width="28" height="28" alt="Instagram" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.threads.com/@elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/threads@2x.png" width="28" height="28" alt="Threads" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.tiktok.com/@.elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/tiktok@2x.png" width="28" height="28" alt="TikTok" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.twitter.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/twitter@2x.png" width="28" height="28" alt="Twitter" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.linkedin.com/company/elonatech/" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/linkedin@2x.png" width="28" height="28" alt="LinkedIn" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.youtube.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/youtube@2x.png" width="28" height="28" alt="YouTube" style="display:block;border:0;"></a></td>
                      </tr></tbody>
                    </table>
                    <p style="margin:0 0 4px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:12px;font-weight:700;color:#ffffff;">
                      Elonatech Nigeria Limited &copy; ${new Date().getFullYear()} &mdash; All rights reserved
                    </p>
                    <p style="margin:0 0 8px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;color:#7a9cc4;">
                      You can view our <a href="http://www.elonatech.com.ng/policy" target="_blank" rel="noopener" style="color:#56B500;text-decoration:underline;">Privacy Policy</a>.
                    </p>
                    <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;color:#7a9cc4;">
                      This email was sent to <a href="mailto:${email}" style="color:#7a9cc4;text-decoration:underline;">${email}</a>
                    </p>
                  </td>
                </tr></tbody>
              </table>
            </td></tr></tbody>
          </table>
        </body>
        </html>`,
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    return res.json({
      status: "success",
      message: "Consultation request sent successfully"
    });

  } catch (error) {
    console.error("Email sending error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to send email"
    });
  }

}

const contactEmail = async (req, res) => {

  const { name, email, subject, number, message } = req.body;


  if (!name) {
    return res.status(400).send("Name is Required")
  }
  if (!email) {
    return res.status(400).send("Email is Required")
  }

  if (!subject) {
    return res.status(400).send("Subject is Required")
  }
  if (!number) {
    return res.status(400).send("Number is Required")
  }
  if (!message) {
    return res.status(400).send("Message is Required")
  }

  const mailOptions = {
    from: "noreply@elonatech.com.ng",
    replyTo: "noreply@elonatech.com.ng",
    to: email,
    bcc: ["contact@elonatech.com.ng"],
    subject: `New Message — ${subject}`,
    html: `<!DOCTYPE html>
        <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
        <head>
          <title>New Contact Message</title>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
          <!--[if !mso]><!-->
          <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Oxygen:wght@300;400;700&display=swap" rel="stylesheet" type="text/css">
          <!--<![endif]-->
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 0; }
            a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
            #MessageViewBody a { color: inherit; text-decoration: none; }
            p { line-height: inherit; }
            .image_block img+div { display: none; }
            @media (max-width: 640px) {
              .row-content { width: 100% !important; }
              .stack .column { width: 100%; display: block; }
              .field-row td { display: block !important; width: 100% !important; }
            }
          </style>
        </head>
        <body style="background-color:#e8ecf0;margin:0;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;background-color:#e8ecf0;">
            <tbody><tr><td style="padding:24px 0;">
              <!-- HEADER -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;border-radius:8px 8px 0 0;overflow:hidden;background-color:#1a3a6b;">
                <tbody><tr>
                  <td style="padding:28px 40px;text-align:center;">
                    <img src="https://elonatech.com.ng/static/media/elonatech.c6083e7d06b4cbab7d90.png"
                      width="180" height="auto" alt="Elonatech" style="display:block;margin:0 auto 16px;height:auto;border:0;">
                    <div style="display:inline-block;background-color:#f0a500;border-radius:4px;padding:4px 14px;margin-bottom:12px;">
                      <span style="font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1.5px;">Contact Us</span>
                    </div>
                    <h1 style="margin:0;color:#ffffff;font-family:Oswald,sans-serif;font-size:28px;font-weight:700;line-height:1.2;">New Contact Message</h1>
                    <p style="margin:8px 0 0;color:#a8c4e8;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:13px;">Submitted on ${new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </td>
                </tr></tbody>
              </table>
              <!-- SUMMARY BAND -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;background-color:#f0a500;">
                <tbody><tr>
                  <td style="padding:14px 40px;text-align:center;">
                    <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:15px;font-weight:700;color:#1a3a6b;">${name} &mdash; ${subject}</p>
                  </td>
                </tr></tbody>
              </table>
              <!-- BODY CARD -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;background-color:#ffffff;">
                <tbody><tr><td style="padding:32px 40px;">
                  <p style="margin:0 0 20px;font-family:Oswald,sans-serif;font-size:13px;font-weight:600;color:#1a3a6b;text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid #1a3a6b;padding-bottom:8px;">Message Details</p>
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding:12px 12px 12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Full Name</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${name}</p></td>
                      <td width="50%" style="padding:12px 0 12px 12px;vertical-align:top;border-bottom:1px solid #eeeeee;border-left:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Email Address</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;"><a href="mailto:${email}" style="color:#1a3a6b;text-decoration:none;">${email}</a></p></td>
                    </tr></tbody>
                  </table>
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding:12px 12px 12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Subject</p>
                        <p style="margin:0;"><span style="display:inline-block;background-color:#e8f0fc;color:#1a3a6b;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:13px;font-weight:600;padding:4px 10px;border-radius:20px;">${subject}</span></p></td>
                      <td width="50%" style="padding:12px 0 12px 12px;vertical-align:top;border-bottom:1px solid #eeeeee;border-left:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Phone Number</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${number}</p></td>
                    </tr></tbody>
                  </table><p style="margin:20px 0 10px;font-family:Oswald,sans-serif;font-size:13px;font-weight:600;color:#1a3a6b;text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid #1a3a6b;padding-bottom:8px;">Message</p>
                  <div style="background-color:#f7f9fc;border-left:4px solid #1a3a6b;border-radius:0 6px 6px 0;padding:18px 20px;">
                    <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#333333;line-height:1.8;">${message}</p>
                  </div>
                </td></tr></tbody>
              </table>
              <!-- FOOTER -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;background-color:#11253d;border-radius:0 0 8px 8px;overflow:hidden;">
                <tbody><tr>
                  <td style="padding:24px 40px;text-align:center;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center"
                      style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin:0 auto 16px;">
                      <tbody><tr>
                        <td style="padding:0 4px;"><a href="https://www.facebook.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/facebook@2x.png" width="28" height="28" alt="Facebook" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.instagram.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/instagram@2x.png" width="28" height="28" alt="Instagram" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.threads.com/@elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/threads@2x.png" width="28" height="28" alt="Threads" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.tiktok.com/@.elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/tiktok@2x.png" width="28" height="28" alt="TikTok" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.twitter.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/twitter@2x.png" width="28" height="28" alt="Twitter" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.linkedin.com/company/elonatech/" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/linkedin@2x.png" width="28" height="28" alt="LinkedIn" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.youtube.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/youtube@2x.png" width="28" height="28" alt="YouTube" style="display:block;border:0;"></a></td>
                      </tr></tbody>
                    </table>
                    <p style="margin:0 0 4px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:12px;font-weight:700;color:#ffffff;">
                      Elonatech Nigeria Limited &copy; ${new Date().getFullYear()} &mdash; All rights reserved
                    </p>
                    <p style="margin:0 0 8px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;color:#7a9cc4;">
                      You can view our <a href="http://www.elonatech.com.ng/policy" target="_blank" rel="noopener" style="color:#56B500;text-decoration:underline;">Privacy Policy</a>.
                    </p>
                    <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;color:#7a9cc4;">
                      This email was sent to <a href="mailto:${email}" style="color:#7a9cc4;text-decoration:underline;">${email}</a>
                    </p>
                  </td>
                </tr></tbody>
              </table>
            </td></tr></tbody>
          </table>
        </body>
        </html>`
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    return res.json({
      status: "success",
      message: "Message sent successfully"
    });

  } catch (error) {
    console.error("Email sending error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to send email"
    });
  }
}

const reasonContactEmail = async (req, res) => {

  const { name, email, subject, number, message } = req.body;


  if (!name) {
    return res.status(400).send("Name is Required")
  }
  if (!email) {
    return res.status(400).send("Email is Required")
  }

  if (!subject) {
    return res.status(400).send("Subject is Required")
  }
  if (!number) {
    return res.status(400).send("Number is Required")
  }
  if (!message) {
    return res.status(400).send("Message is Required")
  }

  const mailOptions = {
    from: "noreply@elonatech.com.ng",
    replyTo: "noreply@elonatech.com.ng",
    to: email,
    bcc: ["contact@elonatech.com.ng"],
    subject: `New Enquiry — ${subject}`,
    html: `<!DOCTYPE html>
        <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
        <head>
          <title>New Enquiry</title>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
          <!--[if !mso]><!-->
          <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Oxygen:wght@300;400;700&display=swap" rel="stylesheet" type="text/css">
          <!--<![endif]-->
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 0; }
            a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
            #MessageViewBody a { color: inherit; text-decoration: none; }
            p { line-height: inherit; }
            .image_block img+div { display: none; }
            @media (max-width: 640px) {
              .row-content { width: 100% !important; }
              .stack .column { width: 100%; display: block; }
              .field-row td { display: block !important; width: 100% !important; }
            }
          </style>
        </head>
        <body style="background-color:#e8ecf0;margin:0;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;background-color:#e8ecf0;">
            <tbody><tr><td style="padding:24px 0;">
              <!-- HEADER -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;border-radius:8px 8px 0 0;overflow:hidden;background-color:#1a3a6b;">
                <tbody><tr>
                  <td style="padding:28px 40px;text-align:center;">
                    <img src="https://elonatech.com.ng/static/media/elonatech.c6083e7d06b4cbab7d90.png"
                      width="180" height="auto" alt="Elonatech" style="display:block;margin:0 auto 16px;height:auto;border:0;">
                    <div style="display:inline-block;background-color:#f0a500;border-radius:4px;padding:4px 14px;margin-bottom:12px;">
                      <span style="font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1.5px;">Get In Touch</span>
                    </div>
                    <h1 style="margin:0;color:#ffffff;font-family:Oswald,sans-serif;font-size:28px;font-weight:700;line-height:1.2;">New Enquiry</h1>
                    <p style="margin:8px 0 0;color:#a8c4e8;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:13px;">Submitted on ${new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </td>
                </tr></tbody>
              </table>
              <!-- SUMMARY BAND -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;background-color:#f0a500;">
                <tbody><tr>
                  <td style="padding:14px 40px;text-align:center;">
                    <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:15px;font-weight:700;color:#1a3a6b;">${name} &mdash; ${subject}</p>
                  </td>
                </tr></tbody>
              </table>
              <!-- BODY CARD -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;background-color:#ffffff;">
                <tbody><tr><td style="padding:32px 40px;">
                  <p style="margin:0 0 20px;font-family:Oswald,sans-serif;font-size:13px;font-weight:600;color:#1a3a6b;text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid #1a3a6b;padding-bottom:8px;">Message Details</p>
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding:12px 12px 12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Full Name</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${name}</p></td>
                      <td width="50%" style="padding:12px 0 12px 12px;vertical-align:top;border-bottom:1px solid #eeeeee;border-left:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Email Address</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;"><a href="mailto:${email}" style="color:#1a3a6b;text-decoration:none;">${email}</a></p></td>
                    </tr></tbody>
                  </table>
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding:12px 12px 12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Subject</p>
                        <p style="margin:0;"><span style="display:inline-block;background-color:#e8f0fc;color:#1a3a6b;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:13px;font-weight:600;padding:4px 10px;border-radius:20px;">${subject}</span></p></td>
                      <td width="50%" style="padding:12px 0 12px 12px;vertical-align:top;border-bottom:1px solid #eeeeee;border-left:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Phone Number</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${number}</p></td>
                    </tr></tbody>
                  </table><p style="margin:20px 0 10px;font-family:Oswald,sans-serif;font-size:13px;font-weight:600;color:#1a3a6b;text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid #1a3a6b;padding-bottom:8px;">Message</p>
                  <div style="background-color:#f7f9fc;border-left:4px solid #1a3a6b;border-radius:0 6px 6px 0;padding:18px 20px;">
                    <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#333333;line-height:1.8;">${message}</p>
                  </div>
                </td></tr></tbody>
              </table>
              <!-- FOOTER -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;background-color:#11253d;border-radius:0 0 8px 8px;overflow:hidden;">
                <tbody><tr>
                  <td style="padding:24px 40px;text-align:center;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center"
                      style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin:0 auto 16px;">
                      <tbody><tr>
                        <td style="padding:0 4px;"><a href="https://www.facebook.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/facebook@2x.png" width="28" height="28" alt="Facebook" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.instagram.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/instagram@2x.png" width="28" height="28" alt="Instagram" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.threads.com/@elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/threads@2x.png" width="28" height="28" alt="Threads" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.tiktok.com/@.elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/tiktok@2x.png" width="28" height="28" alt="TikTok" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.twitter.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/twitter@2x.png" width="28" height="28" alt="Twitter" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.linkedin.com/company/elonatech/" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/linkedin@2x.png" width="28" height="28" alt="LinkedIn" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.youtube.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/youtube@2x.png" width="28" height="28" alt="YouTube" style="display:block;border:0;"></a></td>
                      </tr></tbody>
                    </table>
                    <p style="margin:0 0 4px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:12px;font-weight:700;color:#ffffff;">
                      Elonatech Nigeria Limited &copy; ${new Date().getFullYear()} &mdash; All rights reserved
                    </p>
                    <p style="margin:0 0 8px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;color:#7a9cc4;">
                      You can view our <a href="http://www.elonatech.com.ng/policy" target="_blank" rel="noopener" style="color:#56B500;text-decoration:underline;">Privacy Policy</a>.
                    </p>
                    <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;color:#7a9cc4;">
                      This email was sent to <a href="mailto:${email}" style="color:#7a9cc4;text-decoration:underline;">${email}</a>
                    </p>
                  </td>
                </tr></tbody>
              </table>
            </td></tr></tbody>
          </table>
        </body>
        </html>`
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    return res.json({
      status: "success",
      message: "Message sent successfully"
    });

  } catch (error) {
    console.error("Email sending error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to send email"
    });
  }
}

const checkoutEmail = async (req, res) => {

  const { firstname, lastname, company, email, number, address, state, postal, notes, itemsOrdered, cartTotal, dateNow } = req.body;

  if (!firstname) {
    return res.status(400).send("Firstname is Required")
  }

  if (!lastname) {
    return res.status(400).send("Lastname is Required")
  }
  if (!company) {
    return res.status(400).send("Company is Required")
  }

  if (!email) {
    return res.status(400).send("Email is Required")
  }
  if (!number) {
    return res.status(400).send("Number is Required")
  }
  if (!address) {
    return res.status(400).send("Address is Required")
  }
  if (!state) {
    return res.status(400).send("State is Required")
  }
  if (!postal) {
    return res.status(400).send("Postal is Required")
  }
  if (!notes) {
    return res.status(400).send("Notes is Required")
  }
  if (!Array.isArray(itemsOrdered) || itemsOrdered.length === 0) {
    return res.status(400).json({ message: "Cart items are required" });
  }

  try {

    const mailOptions = {
      from: "noreply@elonatech.com.ng",
      replyTo: "noreply@elonatech.com.ng",
      to: email,
      bcc: ["billing@elonatech.com.ng"],
      subject: `Order Confirmation — ${firstname} ${lastname}`,
      html: `<!DOCTYPE html>
        <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
        <head>
          <title>Order Confirmation</title>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
          <!--[if !mso]><!-->
          <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Oxygen:wght@300;400;700&display=swap" rel="stylesheet" type="text/css">
          <!--<![endif]-->
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 0; }
            a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
            #MessageViewBody a { color: inherit; text-decoration: none; }
            p { line-height: inherit; }
            .image_block img+div { display: none; }
            @media (max-width: 640px) {
              .row-content { width: 100% !important; }
              .stack .column { width: 100%; display: block; }
              .field-row td { display: block !important; width: 100% !important; }
            }
          </style>
        </head>
        <body style="background-color:#e8ecf0;margin:0;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;background-color:#e8ecf0;">
            <tbody><tr><td style="padding:24px 0;">
              <!-- HEADER -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;border-radius:8px 8px 0 0;overflow:hidden;background-color:#1a3a6b;">
                <tbody><tr>
                  <td style="padding:28px 40px;text-align:center;">
                    <img src="https://elonatech.com.ng/static/media/elonatech.c6083e7d06b4cbab7d90.png"
                      width="180" height="auto" alt="Elonatech" style="display:block;margin:0 auto 16px;height:auto;border:0;">
                    <div style="display:inline-block;background-color:#f0a500;border-radius:4px;padding:4px 14px;margin-bottom:12px;">
                      <span style="font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1.5px;">Order Confirmation</span>
                    </div>
                    <h1 style="margin:0;color:#ffffff;font-family:Oswald,sans-serif;font-size:28px;font-weight:700;line-height:1.2;">Order Confirmation</h1>
                    <p style="margin:8px 0 0;color:#a8c4e8;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:13px;">Thank you for your order — we will be in touch shortly</p>
                  </td>
                </tr></tbody>
              </table>
              <!-- SUMMARY BAND -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;background-color:#f0a500;">
                <tbody><tr>
                  <td style="padding:14px 40px;text-align:center;">
                    <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:15px;font-weight:700;color:#1a3a6b;">${firstname} ${lastname} &mdash; &#8358;${cartTotal}</p>
                  </td>
                </tr></tbody>
              </table>
              <!-- BODY CARD -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;background-color:#ffffff;">
                <tbody><tr><td style="padding:32px 40px;">
                  <p style="margin:0 0 20px;font-family:Oswald,sans-serif;font-size:13px;font-weight:600;color:#1a3a6b;text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid #1a3a6b;padding-bottom:8px;">Customer Details</p>
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding:12px 12px 12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">First Name</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${firstname}</p></td>
                      <td width="50%" style="padding:12px 0 12px 12px;vertical-align:top;border-bottom:1px solid #eeeeee;border-left:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Last Name</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${lastname}</p></td>
                    </tr></tbody>
                  </table>
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding:12px 12px 12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Email Address</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;"><a href="mailto:${email}" style="color:#1a3a6b;text-decoration:none;">${email}</a></p></td>
                      <td width="50%" style="padding:12px 0 12px 12px;vertical-align:top;border-bottom:1px solid #eeeeee;border-left:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Phone Number</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${number}</p></td>
                    </tr></tbody>
                  </table>
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding:12px 12px 12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Company</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${company}</p></td>
                      <td width="50%" style="padding:12px 0 12px 12px;vertical-align:top;border-bottom:1px solid #eeeeee;border-left:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">State</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${state}</p></td>
                    </tr></tbody>
                  </table>
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding:12px 12px 12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Postal Code</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${postal}</p></td>
                      <td width="50%" style="padding:12px 0 12px 12px;vertical-align:top;border-bottom:1px solid #eeeeee;border-left:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Delivery Address</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${address}</p></td>
                    </tr></tbody>
                  </table>
                  <p style="margin:20px 0 10px;font-family:Oswald,sans-serif;font-size:13px;font-weight:600;color:#1a3a6b;text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid #1a3a6b;padding-bottom:8px;">Order Summary</p>
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;">
                    <thead>
                      <tr style="background-color:#1a3a6b;">
                        <th style="padding:10px 12px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;font-weight:700;color:#ffffff;text-align:left;text-transform:uppercase;letter-spacing:1px;">Item</th>
                        <th style="padding:10px 12px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;font-weight:700;color:#ffffff;text-align:center;">Qty</th>
                        <th style="padding:10px 12px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;font-weight:700;color:#ffffff;text-align:right;">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsOrdered && itemsOrdered.map(item => `<tr style="border-bottom:1px solid #eeeeee;"><td style="padding:10px 12px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:13px;color:#222222;">${item.name}</td><td style="padding:10px 12px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:13px;color:#555555;text-align:center;">${item.quantity}</td><td style="padding:10px 12px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:13px;color:#222222;text-align:right;">&#8358;${item.price}</td></tr>`).join('')}
                    </tbody>
                    <tfoot>
                      <tr style="background-color:#f7f9fc;">
                        <td colspan="2" style="padding:12px;font-family:Oswald,sans-serif;font-size:14px;font-weight:700;color:#1a3a6b;text-transform:uppercase;">Total</td>
                        <td style="padding:12px;font-family:Oswald,sans-serif;font-size:16px;font-weight:700;color:#1a3a6b;text-align:right;">&#8358;${cartTotal}</td>
                      </tr>
                    </tfoot>
                  </table>
                  ${notes ? `<div style="margin-top:20px;">` + `<p style="margin:20px 0 10px;font-family:Oswald,sans-serif;font-size:13px;font-weight:600;color:#1a3a6b;text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid #1a3a6b;padding-bottom:8px;">Order Notes</p>
                  <div style="background-color:#f7f9fc;border-left:4px solid #1a3a6b;border-radius:0 6px 6px 0;padding:18px 20px;">
                    <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#333333;line-height:1.8;">${notes}</p>
                  </div>` + `</div>` : ''}
                  <p style="margin:16px 0 0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:12px;color:#888888;font-style:italic;">Order placed on ${dateNow}</p>
                </td></tr></tbody>
              </table>
              <!-- FOOTER -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;background-color:#11253d;border-radius:0 0 8px 8px;overflow:hidden;">
                <tbody><tr>
                  <td style="padding:24px 40px;text-align:center;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center"
                      style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin:0 auto 16px;">
                      <tbody><tr>
                        <td style="padding:0 4px;"><a href="https://www.facebook.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/facebook@2x.png" width="28" height="28" alt="Facebook" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.instagram.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/instagram@2x.png" width="28" height="28" alt="Instagram" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.threads.com/@elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/threads@2x.png" width="28" height="28" alt="Threads" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.tiktok.com/@.elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/tiktok@2x.png" width="28" height="28" alt="TikTok" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.twitter.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/twitter@2x.png" width="28" height="28" alt="Twitter" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.linkedin.com/company/elonatech/" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/linkedin@2x.png" width="28" height="28" alt="LinkedIn" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.youtube.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/youtube@2x.png" width="28" height="28" alt="YouTube" style="display:block;border:0;"></a></td>
                      </tr></tbody>
                    </table>
                    <p style="margin:0 0 4px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:12px;font-weight:700;color:#ffffff;">
                      Elonatech Nigeria Limited &copy; ${new Date().getFullYear()} &mdash; All rights reserved
                    </p>
                    <p style="margin:0 0 8px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;color:#7a9cc4;">
                      You can view our <a href="http://www.elonatech.com.ng/policy" target="_blank" rel="noopener" style="color:#56B500;text-decoration:underline;">Privacy Policy</a>.
                    </p>
                    <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;color:#7a9cc4;">
                      This email was sent to <a href="mailto:${email}" style="color:#7a9cc4;text-decoration:underline;">${email}</a>
                    </p>
                  </td>
                </tr></tbody>
              </table>
            </td></tr></tbody>
          </table>
        </body>
        </html>`
    }

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    return res.json({
      status: "success",
      message: "Order placed successfully"
    });

  } catch (error) {
    console.error("Checkout email error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to send email"
    });
  }

}

const retainerEmail = async (req, res) => {

  const { fullname, company, email, number, service, contract, frequency, days, state, address } = req.body;
  console.log('req-body', req.body);

  if (!fullname) {
    return res.status(400).send("Fullname is Required")
  }
  if (!company) {
    return res.status(400).send("Company Name is Required")
  }

  if (!email) {
    return res.status(400).send("Email is Required")
  }
  if (!number) {
    return res.status(400).send("Phone Number is Required")
  }

  if (!service) {
    return res.status(400).send("Retainer Services Required")
  }

  if (!contract) {
    return res.status(400).send("Contract Renewable is Required")
  }

  if (!state) {
    return res.status(400).send("State is Required")
  }

  if (!address) {
    return res.status(400).send("Address is Required")
  }

  const mailOptions = {
    from: "noreply@elonatech.com.ng",
    replyTo: "noreply@elonatech.com.ng",
    to: email,
    bcc: ["info@elonatech.com.ng"],
    subject: `Retainership Request — ${fullname}`,
    html: `<!DOCTYPE html>
        <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
        <head>
          <title>Retainership Request</title>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
          <!--[if !mso]><!-->
          <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Oxygen:wght@300;400;700&display=swap" rel="stylesheet" type="text/css">
          <!--<![endif]-->
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 0; }
            a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
            #MessageViewBody a { color: inherit; text-decoration: none; }
            p { line-height: inherit; }
            .image_block img+div { display: none; }
            @media (max-width: 640px) {
              .row-content { width: 100% !important; }
              .stack .column { width: 100%; display: block; }
              .field-row td { display: block !important; width: 100% !important; }
            }
          </style>
        </head>
        <body style="background-color:#e8ecf0;margin:0;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;background-color:#e8ecf0;">
            <tbody><tr><td style="padding:24px 0;">
              <!-- HEADER -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;border-radius:8px 8px 0 0;overflow:hidden;background-color:#1a3a6b;">
                <tbody><tr>
                  <td style="padding:28px 40px;text-align:center;">
                    <img src="https://elonatech.com.ng/static/media/elonatech.c6083e7d06b4cbab7d90.png"
                      width="180" height="auto" alt="Elonatech" style="display:block;margin:0 auto 16px;height:auto;border:0;">
                    <div style="display:inline-block;background-color:#f0a500;border-radius:4px;padding:4px 14px;margin-bottom:12px;">
                      <span style="font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1.5px;">Retainership</span>
                    </div>
                    <h1 style="margin:0;color:#ffffff;font-family:Oswald,sans-serif;font-size:28px;font-weight:700;line-height:1.2;">Retainership Request</h1>
                    <p style="margin:8px 0 0;color:#a8c4e8;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:13px;">Submitted on ${new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </td>
                </tr></tbody>
              </table>
              <!-- SUMMARY BAND -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;background-color:#f0a500;">
                <tbody><tr>
                  <td style="padding:14px 40px;text-align:center;">
                    <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:15px;font-weight:700;color:#1a3a6b;">${fullname} &mdash; ${company}</p>
                  </td>
                </tr></tbody>
              </table>
              <!-- BODY CARD -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;background-color:#ffffff;">
                <tbody><tr><td style="padding:32px 40px;">
                  <p style="margin:0 0 20px;font-family:Oswald,sans-serif;font-size:13px;font-weight:600;color:#1a3a6b;text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid #1a3a6b;padding-bottom:8px;">Client Details</p>
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding:12px 12px 12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Full Name</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${fullname}</p></td>
                      <td width="50%" style="padding:12px 0 12px 12px;vertical-align:top;border-bottom:1px solid #eeeeee;border-left:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Company</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${company}</p></td>
                    </tr></tbody>
                  </table>
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding:12px 12px 12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Email Address</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;"><a href="mailto:${email}" style="color:#1a3a6b;text-decoration:none;">${email}</a></p></td>
                      <td width="50%" style="padding:12px 0 12px 12px;vertical-align:top;border-bottom:1px solid #eeeeee;border-left:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Phone Number</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${number}</p></td>
                    </tr></tbody>
                  </table>
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding:12px 12px 12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">State</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${state}</p></td>
                      <td width="50%" style="padding:12px 0 12px 12px;vertical-align:top;border-bottom:1px solid #eeeeee;border-left:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Address</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${address}</p></td>
                    </tr></tbody>
                  </table><p style="margin:0 0 20px;font-family:Oswald,sans-serif;font-size:13px;font-weight:600;color:#1a3a6b;text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid #1a3a6b;padding-bottom:8px;">Retainer Details</p>
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding:12px 12px 12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Service</p>
                        <p style="margin:0;"><span style="display:inline-block;background-color:#e8f0fc;color:#1a3a6b;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:13px;font-weight:600;padding:4px 10px;border-radius:20px;">${service}</span></p></td>
                      <td width="50%" style="padding:12px 0 12px 12px;vertical-align:top;border-bottom:1px solid #eeeeee;border-left:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Contract Duration</p>
                        <p style="margin:0;"><span style="display:inline-block;background-color:#e8f0fc;color:#1a3a6b;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:13px;font-weight:600;padding:4px 10px;border-radius:20px;">${contract}</span></p></td>
                    </tr></tbody>
                  </table>
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding:12px 12px 12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Service Frequency</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${frequency}</p></td>
                      <td width="50%" style="padding:12px 0 12px 12px;vertical-align:top;border-bottom:1px solid #eeeeee;border-left:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Preferred Days</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${days}</p></td>
                    </tr></tbody>
                  </table>
                </td></tr></tbody>
              </table>
              <!-- FOOTER -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;background-color:#11253d;border-radius:0 0 8px 8px;overflow:hidden;">
                <tbody><tr>
                  <td style="padding:24px 40px;text-align:center;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center"
                      style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin:0 auto 16px;">
                      <tbody><tr>
                        <td style="padding:0 4px;"><a href="https://www.facebook.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/facebook@2x.png" width="28" height="28" alt="Facebook" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.instagram.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/instagram@2x.png" width="28" height="28" alt="Instagram" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.threads.com/@elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/threads@2x.png" width="28" height="28" alt="Threads" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.tiktok.com/@.elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/tiktok@2x.png" width="28" height="28" alt="TikTok" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.twitter.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/twitter@2x.png" width="28" height="28" alt="Twitter" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.linkedin.com/company/elonatech/" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/linkedin@2x.png" width="28" height="28" alt="LinkedIn" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.youtube.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/youtube@2x.png" width="28" height="28" alt="YouTube" style="display:block;border:0;"></a></td>
                      </tr></tbody>
                    </table>
                    <p style="margin:0 0 4px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:12px;font-weight:700;color:#ffffff;">
                      Elonatech Nigeria Limited &copy; ${new Date().getFullYear()} &mdash; All rights reserved
                    </p>
                    <p style="margin:0 0 8px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;color:#7a9cc4;">
                      You can view our <a href="http://www.elonatech.com.ng/policy" target="_blank" rel="noopener" style="color:#56B500;text-decoration:underline;">Privacy Policy</a>.
                    </p>
                    <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;color:#7a9cc4;">
                      This email was sent to <a href="mailto:${email}" style="color:#7a9cc4;text-decoration:underline;">${email}</a>
                    </p>
                  </td>
                </tr></tbody>
              </table>
            </td></tr></tbody>
          </table>
        </body>
        </html>`
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    return res.json({
      status: "success",
      message: "Retainer request sent successfully"
    });

  } catch (error) {
    console.error("Email sending error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to send email"
    });
  }
}

const sessionEmail = async (req, res) => {

  const { name, email, phone, online, meet, address, discuss, date, hour, minute, gmt } = req.body;
  console.log('Received body:', req.body);

  if (!name) {
    return res.status(400).send("Name is Required")
  }

  if (!email) {
    return res.status(400).send("Email is Required")
  }

  if (!phone) {
    return res.status(400).send("Phone is Required")
  }

  if (!discuss) {
    return res.status(400).send("Meeting Brief is Required")
  }

  if (!date) {
    return res.status(400).send("Date is Required")
  }

  if (!hour) {
    return res.status(400).send("Hour Brief is Required")
  }

  if (!minute) {
    return res.status(400).send("Minute Brief is Required")
  }

  if (!gmt) {
    return res.status(400).send("Gmt Brief is Required")
  }

  try {
    const mailOptions = {
      from: 'noreply@elonatech.com.ng',
      replyTo: 'noreply@elonatech.com.ng',
      to: email,
      bcc: ["info@elonatech.com.ng"],
      subject: `Session Booking — ${name}`,
      html: `<!DOCTYPE html>
        <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
        <head>
          <title>Session Booking</title>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
          <!--[if !mso]><!-->
          <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Oxygen:wght@300;400;700&display=swap" rel="stylesheet" type="text/css">
          <!--<![endif]-->
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 0; }
            a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
            #MessageViewBody a { color: inherit; text-decoration: none; }
            p { line-height: inherit; }
            .image_block img+div { display: none; }
            @media (max-width: 640px) {
              .row-content { width: 100% !important; }
              .stack .column { width: 100%; display: block; }
              .field-row td { display: block !important; width: 100% !important; }
            }
          </style>
        </head>
        <body style="background-color:#e8ecf0;margin:0;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;background-color:#e8ecf0;">
            <tbody><tr><td style="padding:24px 0;">
              <!-- HEADER -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;border-radius:8px 8px 0 0;overflow:hidden;background-color:#1a3a6b;">
                <tbody><tr>
                  <td style="padding:28px 40px;text-align:center;">
                    <img src="https://elonatech.com.ng/static/media/elonatech.c6083e7d06b4cbab7d90.png"
                      width="180" height="auto" alt="Elonatech" style="display:block;margin:0 auto 16px;height:auto;border:0;">
                    <div style="display:inline-block;background-color:#f0a500;border-radius:4px;padding:4px 14px;margin-bottom:12px;">
                      <span style="font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1.5px;">Book a Session</span>
                    </div>
                    <h1 style="margin:0;color:#ffffff;font-family:Oswald,sans-serif;font-size:28px;font-weight:700;line-height:1.2;">Session Booking</h1>
                    <p style="margin:8px 0 0;color:#a8c4e8;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:13px;">Submitted on ${new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </td>
                </tr></tbody>
              </table>
              <!-- SUMMARY BAND -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;background-color:#f0a500;">
                <tbody><tr>
                  <td style="padding:14px 40px;text-align:center;">
                    <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:15px;font-weight:700;color:#1a3a6b;">${name} &mdash; ${date} at ${hour}:${minute}</p>
                  </td>
                </tr></tbody>
              </table>
              <!-- BODY CARD -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;background-color:#ffffff;">
                <tbody><tr><td style="padding:32px 40px;">
                  <p style="margin:0 0 20px;font-family:Oswald,sans-serif;font-size:13px;font-weight:600;color:#1a3a6b;text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid #1a3a6b;padding-bottom:8px;">Booking Details</p>
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding:12px 12px 12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Full Name</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${name}</p></td>
                      <td width="50%" style="padding:12px 0 12px 12px;vertical-align:top;border-bottom:1px solid #eeeeee;border-left:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Email Address</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;"><a href="mailto:${email}" style="color:#1a3a6b;text-decoration:none;">${email}</a></p></td>
                    </tr></tbody>
                  </table>
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding:12px 12px 12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Phone Number</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${phone}</p></td>
                      <td width="50%" style="padding:12px 0 12px 12px;vertical-align:top;border-bottom:1px solid #eeeeee;border-left:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Meeting Format</p>
                        <p style="margin:0;"><span style="display:inline-block;background-color:#e8f0fc;color:#1a3a6b;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:13px;font-weight:600;padding:4px 10px;border-radius:20px;">${online ? "Virtual" : "In-Person"}</span></p></td>
                    </tr></tbody>
                  </table>
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding:12px 12px 12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Preferred Date</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${date}</p></td>
                      <td width="50%" style="padding:12px 0 12px 12px;vertical-align:top;border-bottom:1px solid #eeeeee;border-left:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Preferred Time</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${hour}:${minute} ${gmt}</p></td>
                    </tr></tbody>
                  </table>
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:4px;">
                    <tbody><tr>
                      <td style="padding:12px 0;vertical-align:top;border-bottom:1px solid #eeeeee;"><p style="margin:0 0 3px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:10px;font-weight:700;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;">Meeting Address / Link</p>
                        <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#222222;">${address || meet || "N/A"}</p></td>
                    </tr></tbody>
                  </table><p style="margin:20px 0 10px;font-family:Oswald,sans-serif;font-size:13px;font-weight:600;color:#1a3a6b;text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid #1a3a6b;padding-bottom:8px;">What to Discuss</p>
                  <div style="background-color:#f7f9fc;border-left:4px solid #1a3a6b;border-radius:0 6px 6px 0;padding:18px 20px;">
                    <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:14px;color:#333333;line-height:1.8;">${discuss}</p>
                  </div>
                </td></tr></tbody>
              </table>
              <!-- FOOTER -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;width:620px;max-width:100%;margin:0 auto;background-color:#11253d;border-radius:0 0 8px 8px;overflow:hidden;">
                <tbody><tr>
                  <td style="padding:24px 40px;text-align:center;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center"
                      style="mso-table-lspace:0pt;mso-table-rspace:0pt;margin:0 auto 16px;">
                      <tbody><tr>
                        <td style="padding:0 4px;"><a href="https://www.facebook.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/facebook@2x.png" width="28" height="28" alt="Facebook" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.instagram.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/instagram@2x.png" width="28" height="28" alt="Instagram" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.threads.com/@elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/threads@2x.png" width="28" height="28" alt="Threads" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.tiktok.com/@.elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/tiktok@2x.png" width="28" height="28" alt="TikTok" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.twitter.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/twitter@2x.png" width="28" height="28" alt="Twitter" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.linkedin.com/company/elonatech/" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/linkedin@2x.png" width="28" height="28" alt="LinkedIn" style="display:block;border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.youtube.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/youtube@2x.png" width="28" height="28" alt="YouTube" style="display:block;border:0;"></a></td>
                      </tr></tbody>
                    </table>
                    <p style="margin:0 0 4px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:12px;font-weight:700;color:#ffffff;">
                      Elonatech Nigeria Limited &copy; ${new Date().getFullYear()} &mdash; All rights reserved
                    </p>
                    <p style="margin:0 0 8px;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;color:#7a9cc4;">
                      You can view our <a href="http://www.elonatech.com.ng/policy" target="_blank" rel="noopener" style="color:#56B500;text-decoration:underline;">Privacy Policy</a>.
                    </p>
                    <p style="margin:0;font-family:Oxygen,Trebuchet MS,sans-serif;font-size:11px;color:#7a9cc4;">
                      This email was sent to <a href="mailto:${email}" style="color:#7a9cc4;text-decoration:underline;">${email}</a>
                    </p>
                  </td>
                </tr></tbody>
              </table>
            </td></tr></tbody>
          </table>
        </body>
        </html>`
    }
    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
      return res.json({ status: "success", message: "Session booked successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ status: "error", message: "Failed to send email" });
    }

  } catch (error) {
    console.error("Email sending error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to send email"
    });
  }

}

const emptdpEmail = async (req, res) => {

  try {
    const { fullName, email, location, areaOfInterest, statement, phone, qualification } = req.body
    console.log('Received body: ', req.body)

    if (!fullName) {
      return res.status(400).send("Full name is required")
    }
    if (!email) {
      return res.status(400).send("email is required")
    }
    if (!location) {
      return res.status(400).send("location is required")
    }
    if (!areaOfInterest) {
      return res.status(400).send("areaOfInterest is required")
    }
    if (!statement) {
      return res.status(400).send("statement is required")
    }
    if (!qualification) {
      return res.status(400).send("qualification is required")
    }
    if (!phone) {
      return res.status(400).send("phone is required")
    }

    if (req.fileValidationError) {
      return res.status(400).json({ message: "Invalid File Format. PDF File only" })
    }
    const file = req.file
    if (!file) {
      return res.status(400).json({ message: "No File Received" });
    }

    const mailOptions = {
      from: 'noreply@elonatech.com.ng',
      // replyTo: 'noreply@elonatech.com.ng',
      to: "training@elonatech.com.ng",
      // bcc: ["recruitment@elonatech.com.ng"],
      subject: `New Training Application — ${fullName}`,
      html: `<!DOCTYPE html>
        <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
        <head>
          <title>Training Application</title>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
          <!--[if !mso]><!-->
          <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Oxygen:wght@300;400;700&display=swap" rel="stylesheet" type="text/css">
          <!--<![endif]-->
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 0; }
            a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
            #MessageViewBody a { color: inherit; text-decoration: none; }
            p { line-height: inherit; }
            .image_block img+div { display: none; }
            @media (max-width: 640px) {
              .row-content { width: 100% !important; }
              .stack .column { width: 100%; display: block; }
              .field-row td { display: block !important; width: 100% !important; }
            }
          </style>
        </head>
        <body style="background-color: #e8ecf0; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
            style="mso-table-lspace:0pt; mso-table-rspace:0pt; background-color:#e8ecf0;">
            <tbody><tr><td style="padding: 24px 0;">

              <!-- HEADER -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt; mso-table-rspace:0pt; width:620px; max-width:100%; margin:0 auto; border-radius:8px 8px 0 0; overflow:hidden; background-color:#1a3a6b;">
                <tbody><tr>
                  <td style="padding: 28px 40px; text-align:center;">
                    <img src="https://elonatech.com.ng/static/media/elonatech.c6083e7d06b4cbab7d90.png"
                      width="180" height="auto" alt="Elonatech" style="display:block; margin:0 auto 16px; height:auto; border:0;">
                    <div style="display:inline-block; background-color:#f0a500; border-radius:4px; padding:4px 14px; margin-bottom:12px;">
                      <span style="font-family: Oxygen, Trebuchet MS, sans-serif; font-size:11px; font-weight:700; color:#1a3a6b; text-transform:uppercase; letter-spacing:1.5px;">Training Programme</span>
                    </div>
                    <h1 style="margin:0; color:#ffffff; font-family: Oswald, sans-serif; font-size:28px; font-weight:700; line-height:1.2;">
                      New Training Application
                    </h1>
                    <p style="margin:8px 0 0; color:#a8c4e8; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:13px;">
                      Submitted on ${new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </td>
                </tr></tbody>
              </table>

              <!-- APPLICANT SUMMARY BAND -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt; mso-table-rspace:0pt; width:620px; max-width:100%; margin:0 auto; background-color:#f0a500;">
                <tbody><tr>
                  <td style="padding: 14px 40px; text-align:center;">
                    <p style="margin:0; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:15px; font-weight:700; color:#1a3a6b;">
                      ${fullName}
                      <span style="font-weight:400; margin-left:8px;">&#8212; ${areaOfInterest}</span>
                    </p>
                  </td>
                </tr></tbody>
              </table>

              <!-- BODY CARD -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt; mso-table-rspace:0pt; width:620px; max-width:100%; margin:0 auto; background-color:#ffffff;">
                <tbody>

                <tr><td style="padding: 32px 40px 0;">
                  <p style="margin:0 0 20px; font-family: Oswald, sans-serif; font-size:13px; font-weight:600; color:#1a3a6b; text-transform:uppercase; letter-spacing:1.5px; border-bottom: 2px solid #1a3a6b; padding-bottom:8px;">
                    Applicant Details
                  </p>

                  <!-- Row: Full Name + Phone -->
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt; mso-table-rspace:0pt; margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding: 12px 12px 12px 0; vertical-align:top; border-bottom:1px solid #eeeeee;">
                        <p style="margin:0 0 3px; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:10px; font-weight:700; color:#1a3a6b; text-transform:uppercase; letter-spacing:1px;">Full Name</p>
                        <p style="margin:0; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:14px; color:#222222;">${fullName}</p>
                      </td>
                      <td width="50%" style="padding: 12px 0 12px 12px; vertical-align:top; border-bottom:1px solid #eeeeee; border-left:1px solid #eeeeee;">
                        <p style="margin:0 0 3px; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:10px; font-weight:700; color:#1a3a6b; text-transform:uppercase; letter-spacing:1px;">Phone Number</p>
                        <p style="margin:0; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:14px; color:#222222;">${phone}</p>
                      </td>
                    </tr></tbody>
                  </table>

                  <!-- Row: Email + Location -->
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt; mso-table-rspace:0pt; margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding: 12px 12px 12px 0; vertical-align:top; border-bottom:1px solid #eeeeee;">
                        <p style="margin:0 0 3px; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:10px; font-weight:700; color:#1a3a6b; text-transform:uppercase; letter-spacing:1px;">Email Address</p>
                        <p style="margin:0; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:14px; color:#222222;">
                          <a href="mailto:${email}" style="color:#1a3a6b; text-decoration:none;">${email}</a>
                        </p>
                      </td>
                      <td width="50%" style="padding: 12px 0 12px 12px; vertical-align:top; border-bottom:1px solid #eeeeee; border-left:1px solid #eeeeee;">
                        <p style="margin:0 0 3px; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:10px; font-weight:700; color:#1a3a6b; text-transform:uppercase; letter-spacing:1px;">Location</p>
                        <p style="margin:0; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:14px; color:#222222;">${location}</p>
                      </td>
                    </tr></tbody>
                  </table>

                  <!-- Row: Area of Interest + Qualification -->
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt; mso-table-rspace:0pt; margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding: 12px 12px 12px 0; vertical-align:top; border-bottom:1px solid #eeeeee;">
                        <p style="margin:0 0 3px; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:10px; font-weight:700; color:#1a3a6b; text-transform:uppercase; letter-spacing:1px;">Area of Interest</p>
                        <p style="margin:0;">
                          <span style="display:inline-block; background-color:#e8f0fc; color:#1a3a6b; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:13px; font-weight:600; padding:4px 10px; border-radius:20px;">${areaOfInterest}</span>
                        </p>
                      </td>
                      <td width="50%" style="padding: 12px 0 12px 12px; vertical-align:top; border-bottom:1px solid #eeeeee; border-left:1px solid #eeeeee;">
                        <p style="margin:0 0 3px; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:10px; font-weight:700; color:#1a3a6b; text-transform:uppercase; letter-spacing:1px;">Qualification</p>
                        <p style="margin:0; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:14px; color:#222222;">${qualification}</p>
                      </td>
                    </tr></tbody>
                  </table>

                </td></tr>

                <!-- Personal Statement -->
                <tr><td style="padding: 24px 40px 32px;">
                  <p style="margin:0 0 10px; font-family: Oswald, sans-serif; font-size:13px; font-weight:600; color:#1a3a6b; text-transform:uppercase; letter-spacing:1.5px; border-bottom: 2px solid #1a3a6b; padding-bottom:8px;">
                    Personal Statement
                  </p>
                  <div style="background-color:#f7f9fc; border-left:4px solid #1a3a6b; border-radius:0 6px 6px 0; padding:18px 20px;">
                    <p style="margin:0; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:14px; color:#333333; line-height:1.8;">${statement}</p>
                  </div>
                  <p style="margin:16px 0 0; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:12px; color:#888888; font-style:italic;">
                    CV / Resume is attached to this email.
                  </p>
                </td></tr>

                </tbody>
              </table>

              <!-- FOOTER -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt; mso-table-rspace:0pt; width:620px; max-width:100%; margin:0 auto; background-color:#11253d; border-radius:0 0 8px 8px; overflow:hidden;">
                <tbody><tr>
                  <td style="padding: 24px 40px; text-align:center;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center"
                      style="mso-table-lspace:0pt; mso-table-rspace:0pt; margin:0 auto 16px;">
                      <tbody><tr>
                        <td style="padding:0 4px;"><a href="https://www.facebook.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/facebook@2x.png" width="28" height="28" alt="Facebook" style="display:block; border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.instagram.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/instagram@2x.png" width="28" height="28" alt="Instagram" style="display:block; border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.threads.com/@elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/threads@2x.png" width="28" height="28" alt="Threads" style="display:block; border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.tiktok.com/@.elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/tiktok@2x.png" width="28" height="28" alt="TikTok" style="display:block; border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.twitter.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/twitter@2x.png" width="28" height="28" alt="Twitter" style="display:block; border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.linkedin.com/company/elonatech/" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/linkedin@2x.png" width="28" height="28" alt="LinkedIn" style="display:block; border:0;"></a></td>
                        <td style="padding:0 4px;"><a href="https://www.youtube.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/youtube@2x.png" width="28" height="28" alt="YouTube" style="display:block; border:0;"></a></td>
                      </tr></tbody>
                    </table>
                    <p style="margin:0 0 4px; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:12px; font-weight:700; color:#ffffff;">
                      Elonatech Nigeria Limited &copy; ${new Date().getFullYear()} &mdash; All rights reserved
                    </p>
                    <p style="margin:0 0 8px; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:11px; color:#7a9cc4;">
                      You can view our <a href="http://www.elonatech.com.ng/policy" target="_blank" rel="noopener" style="color:#56B500; text-decoration:underline;">Privacy Policy</a>.
                    </p>
                    <p style="margin:0; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:11px; color:#7a9cc4;">
                      This notification was generated by the Elonatech Training Application system.
                    </p>
                  </td>
                </tr></tbody>
              </table>

            </td></tr></tbody>
          </table>
        </body>
        </html>`,
      attachments: file ? [{
        filename: file.originalname,
        content: file.buffer.toString('base64'),
        encoding: 'base64'
      }] : []
    }

    await transporter.sendMail(mailOptions)

    res.json({
      status: "success",
      message: "Application submitted successfully"
    });
  } catch (error) {
    console.error("Email sending error: ", error);
    res.status(500).json({
      status: "error",
      message: "Failed to send email"
    });
  }

}


const igniteEmail = async (req, res) => {

  try {
    const { fullName, email, location, specialization, programTrack, statement, phone, qualification } = req.body
    console.log('Received body: ', req.body)

    if (!fullName) {
      return res.status(400).send("Full name is required")
    }
    if (!email) {
      return res.status(400).send("email is required")
    }
    if (!location) {
      return res.status(400).send("location is required")
    }
    if (!specialization) {
      return res.status(400).send("specialization is required")
    }
    if (!programTrack) {
      return res.status(400).send("programTrack is required")
    }
    if (!statement) {
      return res.status(400).send("statement is required")
    }
    if (!qualification) {
      return res.status(400).send("qualification is required")
    }
    if (!phone) {
      return res.status(400).send("phone is required")
    }

    if (req.fileValidationError) {
      return res.status(400).json({ message: "Invalid file format. CV must be a PDF; Siwes letter must be PDF or JPEG" })
    }
    const file = req.files?.file?.[0]
    const siwesLetter = req.files?.siwesLetter?.[0]
    if (!file) {
      return res.status(400).json({ message: "No File Received" });
    }

    const mailOptions = {
      from: 'noreply@elonatech.com.ng',
      to: "training@elonatech.com.ng",
      subject: `New ETMPDP Ignite Application — ${fullName}`,
      html: `<!DOCTYPE html>
        <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
        <head>
          <title>ETMPDP Ignite Application</title>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
          <!--[if !mso]><!-->
          <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Oxygen:wght@300;400;700&display=swap" rel="stylesheet" type="text/css">
          <!--<![endif]-->
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 0; }
            a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
            #MessageViewBody a { color: inherit; text-decoration: none; }
            p { line-height: inherit; }
            .image_block img+div { display: none; }
            @media (max-width: 640px) {
              .row-content { width: 100% !important; }
              .stack .column { width: 100%; display: block; }
              .field-row td { display: block !important; width: 100% !important; }
            }
          </style>
        </head>
        <body style="background-color: #e8ecf0; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
            style="mso-table-lspace:0pt; mso-table-rspace:0pt; background-color:#e8ecf0;">
            <tbody><tr><td style="padding: 24px 0;">

              <!-- HEADER -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt; mso-table-rspace:0pt; width:620px; max-width:100%; margin:0 auto; border-radius:8px 8px 0 0; overflow:hidden; background-color:#11253d;">
                <tbody><tr>
                  <td style="padding: 28px 40px; text-align:center;">
                    <img src="https://elonatech.com.ng/static/media/elonatech.c6083e7d06b4cbab7d90.png"
                      width="180" height="auto" alt="Elonatech" style="display:block; margin:0 auto 16px; height:auto; border:0;">
                    <div style="display:inline-block; background-color:#dc3545; border-radius:4px; padding:4px 14px; margin-bottom:12px;">
                      <span style="font-family: Oxygen, Trebuchet MS, sans-serif; font-size:11px; font-weight:700; color:#ffffff; text-transform:uppercase; letter-spacing:1.5px;">ETMPDP Ignite</span>
                    </div>
                    <h1 style="margin:0; color:#ffffff; font-family: Oswald, sans-serif; font-size:28px; font-weight:700; line-height:1.2;">
                      New ETMPDP Ignite Application
                    </h1>
                    <p style="margin:8px 0 0; color:#a8c4e8; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:13px;">
                      Submitted on ${new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </td>
                </tr></tbody>
              </table>

              <!-- APPLICANT SUMMARY BAND -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt; mso-table-rspace:0pt; width:620px; max-width:100%; margin:0 auto; background-color:#dc3545;">
                <tbody><tr>
                  <td style="padding: 14px 40px; text-align:center;">
                    <p style="margin:0; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:15px; font-weight:700; color:#ffffff;">
                      ${fullName}
                      <span style="font-weight:400; margin-left:8px;">&#8212; ${specialization}</span>
                    </p>
                  </td>
                </tr></tbody>
              </table>

              <!-- BODY CARD -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt; mso-table-rspace:0pt; width:620px; max-width:100%; margin:0 auto; background-color:#ffffff;">
                <tbody>

                <tr><td style="padding: 32px 40px 0;">
                  <p style="margin:0 0 20px; font-family: Oswald, sans-serif; font-size:13px; font-weight:600; color:#11253d; text-transform:uppercase; letter-spacing:1.5px; border-bottom: 2px solid #11253d; padding-bottom:8px;">
                    Applicant Details
                  </p>

                  <!-- Row: Full Name + Phone -->
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt; mso-table-rspace:0pt; margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding: 12px 12px 12px 0; vertical-align:top; border-bottom:1px solid #eeeeee;">
                        <p style="margin:0 0 3px; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:10px; font-weight:700; color:#11253d; text-transform:uppercase; letter-spacing:1px;">Full Name</p>
                        <p style="margin:0; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:14px; color:#222222;">${fullName}</p>
                      </td>
                      <td width="50%" style="padding: 12px 0 12px 12px; vertical-align:top; border-bottom:1px solid #eeeeee; border-left:1px solid #eeeeee;">
                        <p style="margin:0 0 3px; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:10px; font-weight:700; color:#11253d; text-transform:uppercase; letter-spacing:1px;">Phone Number</p>
                        <p style="margin:0; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:14px; color:#222222;">${phone}</p>
                      </td>
                    </tr></tbody>
                  </table>

                  <!-- Row: Email + Location -->
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt; mso-table-rspace:0pt; margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding: 12px 12px 12px 0; vertical-align:top; border-bottom:1px solid #eeeeee;">
                        <p style="margin:0 0 3px; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:10px; font-weight:700; color:#11253d; text-transform:uppercase; letter-spacing:1px;">Email Address</p>
                        <p style="margin:0; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:14px; color:#222222;">
                          <a href="mailto:${email}" style="color:#11253d; text-decoration:none;">${email}</a>
                        </p>
                      </td>
                      <td width="50%" style="padding: 12px 0 12px 12px; vertical-align:top; border-bottom:1px solid #eeeeee; border-left:1px solid #eeeeee;">
                        <p style="margin:0 0 3px; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:10px; font-weight:700; color:#11253d; text-transform:uppercase; letter-spacing:1px;">Location</p>
                        <p style="margin:0; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:14px; color:#222222;">${location}</p>
                      </td>
                    </tr></tbody>
                  </table>

                  <!-- Row: Specialization + Program Track -->
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt; mso-table-rspace:0pt; margin-bottom:4px;">
                    <tbody><tr>
                      <td width="50%" style="padding: 12px 12px 12px 0; vertical-align:top; border-bottom:1px solid #eeeeee;">
                        <p style="margin:0 0 3px; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:10px; font-weight:700; color:#11253d; text-transform:uppercase; letter-spacing:1px;">Specialization</p>
                        <p style="margin:0;">
                          <span style="display:inline-block; background-color:#fdeef0; color:#11253d; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:13px; font-weight:600; padding:4px 10px; border-radius:20px;">${specialization}</span>
                        </p>
                      </td>
                      <td width="50%" style="padding: 12px 0 12px 12px; vertical-align:top; border-bottom:1px solid #eeeeee; border-left:1px solid #eeeeee;">
                        <p style="margin:0 0 3px; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:10px; font-weight:700; color:#11253d; text-transform:uppercase; letter-spacing:1px;">Program Track</p>
                        <p style="margin:0; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:14px; color:#222222;">${programTrack}</p>
                      </td>
                    </tr></tbody>
                  </table>

                  <!-- Row: Qualification -->
                  <table class="field-row" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="mso-table-lspace:0pt; mso-table-rspace:0pt; margin-bottom:4px;">
                    <tbody><tr>
                      <td width="100%" style="padding: 12px 0; vertical-align:top; border-bottom:1px solid #eeeeee;">
                        <p style="margin:0 0 3px; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:10px; font-weight:700; color:#11253d; text-transform:uppercase; letter-spacing:1px;">Current Academic Status</p>
                        <p style="margin:0; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:14px; color:#222222;">${qualification}</p>
                      </td>
                    </tr></tbody>
                  </table>

                </td></tr>

                <!-- Personal Statement -->
                <tr><td style="padding: 24px 40px 32px;">
                  <p style="margin:0 0 10px; font-family: Oswald, sans-serif; font-size:13px; font-weight:600; color:#11253d; text-transform:uppercase; letter-spacing:1.5px; border-bottom: 2px solid #11253d; padding-bottom:8px;">
                    Personal Statement
                  </p>
                  <div style="background-color:#f7f9fc; border-left:4px solid #11253d; border-radius:0 6px 6px 0; padding:18px 20px;">
                    <p style="margin:0; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:14px; color:#333333; line-height:1.8;">${statement}</p>
                  </div>
                  <p style="margin:16px 0 0; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:12px; color:#888888; font-style:italic;">
                    CV / Resume is attached to this email.
                  </p>
                </td></tr>

                </tbody>
              </table>

              <!-- FOOTER -->
              <table align="center" width="620" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="mso-table-lspace:0pt; mso-table-rspace:0pt; width:620px; max-width:100%; margin:0 auto; background-color:#11253d; border-radius:0 0 8px 8px; overflow:hidden;">
                <tbody><tr>
                  <td style="padding: 24px 40px; text-align:center;">
                    <p style="margin:0 0 4px; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:12px; font-weight:700; color:#ffffff;">
                      Elonatech Nigeria Limited &copy; ${new Date().getFullYear()} &mdash; All rights reserved
                    </p>
                    <p style="margin:0 0 8px; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:11px; color:#7a9cc4;">
                      You can view our <a href="http://www.elonatech.com.ng/policy" target="_blank" rel="noopener" style="color:#56B500; text-decoration:underline;">Privacy Policy</a>.
                    </p>
                    <p style="margin:0; font-family: Oxygen, Trebuchet MS, sans-serif; font-size:11px; color:#7a9cc4;">
                      This notification was generated by the Elonatech ETMPDP Ignite Application system.
                    </p>
                  </td>
                </tr></tbody>
              </table>

            </td></tr></tbody>
          </table>
        </body>
        </html>`,
      attachments: [
        {
          filename: file.originalname,
          content: file.buffer.toString('base64'),
          encoding: 'base64'
        },
        ...(siwesLetter ? [{
          filename: siwesLetter.originalname,
          content: siwesLetter.buffer.toString('base64'),
          encoding: 'base64'
        }] : [])
      ]
    }

    await transporter.sendMail(mailOptions)

    res.json({
      status: "success",
      message: "Application submitted successfully"
    });
  } catch (error) {
    console.error("Email sending error: ", error);
    res.status(500).json({
      status: "error",
      message: "Failed to send email"
    });
  }

}


module.exports = { jobEmail, quoteEmail, consultEmail, contactEmail, checkoutEmail, retainerEmail, sessionEmail, reasonContactEmail, emptdpEmail, igniteEmail }