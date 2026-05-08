const nodemailer = require('nodemailer');

const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

const transporter = nodemailer.createTransport({
	host: "mail.elonatech.com.ng",
	port: 465,
	secure: true,
	debug: true,
	auth: {
		user: "webadmin@elonatech.com.ng",
		pass: "El0n@_W3b@dm1n@"
	},
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
			subject: "Job Application",
			html: `<!DOCTYPE html>
				<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

				<head>
					<title></title>
					<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
					<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet"
						type="text/css">
					<link href="https://fonts.googleapis.com/css2?family=Oxygen:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet"
						type="text/css"><!--<![endif]-->
					<style>
						* {
							box-sizing: border-box;
						}

						body {
							margin: 0;
							padding: 0;
						}

						a[x-apple-data-detectors] {
							color: inherit !important;
							text-decoration: inherit !important;
						}

						#MessageViewBody a {
							color: inherit;
							text-decoration: none;
						}

						p {
							line-height: inherit
						}

						.desktop_hide,
						.desktop_hide table {
							mso-hide: all;
							display: none;
							max-height: 0px;
							overflow: hidden;
						}

						.image_block img+div {
							display: none;
						}

						@media (max-width:640px) {

							.desktop_hide table.icons-inner,
							.social_block.desktop_hide .social-table {
								display: inline-block !important;
							}

							.icons-inner {
								text-align: center;
							}

							.icons-inner td {
								margin: 0 auto;
							}

							.mobile_hide {
								display: none;
							}

							.row-content {
								width: 100% !important;
							}

							.stack .column {
								width: 100%;
								display: block;
							}

							.mobile_hide {
								min-height: 0;
								max-height: 0;
								max-width: 0;
								overflow: hidden;
								font-size: 0px;
							}

							.desktop_hide,
							.desktop_hide table {
								display: table !important;
								max-height: none !important;
							}
						}
					</style>
				</head>

				<body style="background-color: #DFDFDF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
					<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
						style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #DFDFDF;">
						<tbody>
							<tr>
								<td>
									<table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
										<tbody>
											<tr>
												<td>
													<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
														role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #3c5d98; color: #000000; background-size: auto; width: 620px; margin: 0 auto;"
														width="620">
														<tbody>
															<tr>
																<td class="column column-1" width="100%"
																	style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																	<table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
																		role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
																				<div class="alignment" align="center" style="line-height:10px">
																					<div style="max-width: 279px;"><img
																							src="https://elonatech.com.ng/static/media/elonatech.c6083e7d06b4cbab7d90.png"
																							style="display: block; height: auto; border: 0; width: 100%;" width="279"
																							height="auto"></div>
																				</div>
																			</td>
																		</tr>
																	</table>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
									<table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
										<tbody>
											<tr>
												<td>
													<table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
														role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #3c5d98; color: #000000; width: 620px; margin: 0 auto;"
														width="620">
														<tbody>
															<tr>
																<td class="column column-1" width="100%"
																	style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																	<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
																		role="presentation"
																		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																		<tr>
																			<td class="pad" style="padding-left:60px;padding-right:60px;">
																				<div
																					style="color:#FFFFFF;font-family:'Oswald','Lucida Sans Unicode','Lucida Grande',sans-serif;font-size:14px;line-height:180%;text-align:center;mso-line-height-alt:25.2px;">
																					<p style="margin: 0; word-break: break-word;"><br></p>
																				</div>
																			</td>
																		</tr>
																	</table>
																	<table class="heading_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0"
																		role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="pad">
																				<h2
																					style="margin: 0; color: #f5f5f5; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 30px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 36px;">
																					<span class="tinyMce-placeholder">Job Application</span>
																				</h2>
																			</td>
																		</tr>
																	</table>
																	<table class="image_block mobile_hide block-3" width="100%" border="0" cellpadding="10"
																		cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="pad">
																				<div class="alignment" align="center" style="line-height:10px">
																					<div style="max-width: 64px;"><img
																							src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/smile.png"
																							style="display: block; height: auto; border: 0; width: 100%;" width="64"
																							alt="Image" title="Image" height="auto"></div>
																				</div>
																			</td>
																		</tr>
																	</table>
																	<div class="spacer_block block-4 mobile_hide"
																		style="height:125px;line-height:125px;font-size:1px;">&#8202;</div>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
									<table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
										<tbody>
											<tr>
												<td>
													<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
														role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F5F5F5; color: #000000; width: 620px; margin: 0 auto;"
														width="620">
														<tbody>
															<tr>
																<td class="column column-1" width="100%"
																	style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #F5F5F5; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																	<table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
																		role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="pad">
																				<div class="alignment" align="center">
																					<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
																						style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																						<tr>
																							<td class="divider_inner"
																								style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
																								<span>&#8202;</span>
																							</td>
																						</tr>
																					</table>
																				</div>
																			</td>
																		</tr>
																	</table>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
									<table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
										<tbody>
											<tr>
												<td>
													<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
														role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;"
														width="620">
														<tbody>
															<tr>
																<td class="column column-1" width="100%"
																	style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																	<table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
																		role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="pad">
																				<div class="alignment" align="left">
																					<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
																						style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																						<tr>
																							<td class="divider_inner"
																								style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
																								<span>&#8202;</span>
																							</td>
																						</tr>
																					</table>
																				</div>
																			</td>
																		</tr>
																	</table>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
									<table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
										<tbody>
											<tr>
												<td>
													<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
														role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F5F5F5; color: #000000; width: 620px; margin: 0 auto;"
														width="620">
														<tbody>
															<tr>
																<td class="column column-1" width="100%"
																	style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #F5F5F5; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																	<table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
																		role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="pad">
																				<div class="alignment" align="center">
																					<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
																						style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																						<tr>
																							<td class="divider_inner"
																								style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
																								<span>&#8202;</span>
																							</td>
																						</tr>
																					</table>
																				</div>
																			</td>
																		</tr>
																	</table>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
									<table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
										<tbody>
											<tr>
												<td>
													<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
														role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;"
														width="620">
														<tbody>
															<tr>
																<td class="column column-1" width="100%"
																	style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																	<table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
																		role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="pad">
																				<div class="alignment" align="left">
																					<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
																						style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																						<tr>
																							<td class="divider_inner"
																								style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
																								<span>&#8202;</span>
																							</td>
																						</tr>
																					</table>
																				</div>
																			</td>
																		</tr>
																	</table>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
									<table class="row row-7" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
										<tbody>
											<tr>
												<td>
													<table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
														role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
														width="620">
														<tbody>
															<tr>
																<td class="column column-1" width="100%"
																	style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																	<table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
																		role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<!-- Firstname  -->
																			<td class="pad">
																				<h3
																					style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
																					<span class="tinyMce-placeholder">Firstname:&nbsp;&nbsp;</span>
																				</h3>
																			</td>
																		</tr>
																	</table>
																	<table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
																		role="presentation"
																		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																		<tr>
																			<td class="pad">
																				<div style="font-family: sans-serif">
																					<div class
																						style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																						<p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
																							${firstname}&nbsp;</p>
																					</div>
																				</div>
																			</td>
																		</tr>
																	</table>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
									<table class="row row-8" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
										<tbody>
											<tr>
												<td>
													<table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
														role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
														width="620">
														<tbody>
															<tr>
																<td class="column column-1" width="100%"
																	style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																	<table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
																		role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="pad">
																				<h3
																					style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
																					<span class="tinyMce-placeholder">Lastname:&nbsp;&nbsp;</span>
																				</h3>
																			</td>
																		</tr>
																	</table>
																	<table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
																		role="presentation"
																		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																		<tr>
																			<td class="pad">
																				<div style="font-family: sans-serif">
																					<div class
																						style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																						<p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
																							${lastname}&nbsp;</p>
																					</div>
																				</div>
																			</td>
																		</tr>
																	</table>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
									<table class="row row-9" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
										<tbody>
											<tr>
												<td>
													<table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
														role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
														width="620">
														<tbody>
															<tr>
																<td class="column column-1" width="100%"
																	style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																	<table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
																		role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="pad">
																				<h3
																					style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
																					<span class="tinyMce-placeholder">Email:&nbsp;&nbsp;</span>
																				</h3>
																			</td>
																		</tr>
																	</table>
																	<table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
																		role="presentation"
																		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																		<tr>
																			<td class="pad">
																				<div style="font-family: sans-serif">
																					<div class
																						style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																						<p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
																							${email}&nbsp;</p>
																					</div>
																				</div>
																			</td>
																		</tr>
																	</table>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
									<table class="row row-10" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
										<tbody>
											<tr>
												<td>
													<table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
														role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
														width="620">
														<tbody>
															<tr>
																<td class="column column-1" width="100%"
																	style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																	<table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
																		role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="pad">
																				<h3
																					style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
																					<span class="tinyMce-placeholder">Phone:&nbsp;&nbsp;</span>
																				</h3>
																			</td>
																		</tr>
																	</table>
																	<table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
																		role="presentation"
																		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																		<tr>
																			<td class="pad">
																				<div style="font-family: sans-serif">
																					<div class
																						style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																						<p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
																							${number}&nbsp;</p>
																					</div>
																				</div>
																			</td>
																		</tr>
																	</table>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
									<table class="row row-11" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
										<tbody>
											<tr>
												<td>
													<table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
														role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
														width="620">
														<tbody>
															<tr>
																<td class="column column-1" width="100%"
																	style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																	<table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
																		role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="pad">
																				<h3
																					style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
																					<span class="tinyMce-placeholder">Gender:&nbsp;&nbsp;</span>
																				</h3>
																			</td>
																		</tr>
																	</table>
																	<table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
																		role="presentation"
																		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																		<tr>
																			<td class="pad">
																				<div style="font-family: sans-serif">
																					<div class
																						style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																						<p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
																							${gender}&nbsp;</p>
																					</div>
																				</div>
																			</td>
																		</tr>
																	</table>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
									<table class="row row-12" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
										<tbody>
											<tr>
												<td>
													<table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
														role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
														width="620">
														<tbody>
															<tr>
																<td class="column column-1" width="100%"
																	style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																	<table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
																		role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="pad">
																				<h3
																					style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
																					<span class="tinyMce-placeholder">Address:&nbsp;&nbsp;</span>
																				</h3>
																			</td>
																		</tr>
																	</table>
																	<table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
																		role="presentation"
																		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																		<tr>
																			<td class="pad">
																				<div style="font-family: sans-serif">
																					<div class
																						style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																						<p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
																							${address}&nbsp;</p>
																					</div>
																				</div>
																			</td>
																		</tr>
																	</table>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
									<table class="row row-13" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
										<tbody>
											<tr>
												<td>
													<table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
														role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
														width="620">
														<tbody>
															<tr>
																<td class="column column-1" width="100%"
																	style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																	<table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
																		role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="pad">
																				<h3
																					style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
																					<span class="tinyMce-placeholder">Date Of Birth:&nbsp;&nbsp;</span>
																				</h3>
																			</td>
																		</tr>
																	</table>
																	<table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
																		role="presentation"
																		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																		<tr>
																			<td class="pad">
																				<div style="font-family: sans-serif">
																					<div class
																						style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																						<p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
																							${dob}&nbsp;</p>
																					</div>
																				</div>
																			</td>
																		</tr>
																	</table>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
									<table class="row row-14" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
										<tbody>
											<tr>
												<td>
													<table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
														role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
														width="620">
														<tbody>
															<tr>
																<td class="column column-1" width="100%"
																	style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																	<table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
																		role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="pad">
																				<h3
																					style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
																					<span class="tinyMce-placeholder">Skills:&nbsp;&nbsp;</span>
																				</h3>
																			</td>
																		</tr>
																	</table>
																	<table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
																		role="presentation"
																		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																		<tr>
																			<td class="pad">
																				<div style="font-family: sans-serif">
																					<div class
																						style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																						<p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
																							${parsedSkills}&nbsp;</p>
																					</div>
																				</div>
																			</td>
																		</tr>
																	</table>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
									<table class="row row-15" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
										<tbody>
											<tr>
												<td>
													<table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
														role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
														width="620">
														<tbody>
															<tr>
																<td class="column column-1" width="100%"
																	style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																	<table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
																		role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="pad">
																				<h3
																					style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
																					<span class="tinyMce-placeholder">Category:&nbsp;&nbsp;</span>
																				</h3>
																			</td>
																		</tr>
																	</table>
																	<table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
																		role="presentation"
																		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																		<tr>
																			<td class="pad">
																				<div style="font-family: sans-serif">
																					<div class
																						style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																						<p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
																							${category}&nbsp;</p>
																					</div>
																				</div>
																			</td>
																		</tr>
																	</table>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
									<table class="row row-16" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
										<tbody>
											<tr>
												<td>
													<table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
														role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
														width="620">
														<tbody>
															<tr>
																<td class="column column-1" width="100%"
																	style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																	<table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
																		role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="pad">
																				<h3
																					style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
																					<span class="tinyMce-placeholder">Status:&nbsp;&nbsp;</span>
																				</h3>
																			</td>
																		</tr>
																	</table>
																	<table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
																		role="presentation"
																		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																		<tr>
																			<td class="pad">
																				<div style="font-family: sans-serif">
																					<div class
																						style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																						<p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
																							${status}&nbsp;</p>
																					</div>
																				</div>
																			</td>
																		</tr>
																	</table>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
									<table class="row row-17" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
										<tbody>
											<tr>
												<td>
													<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
														role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
														width="620">
														<tbody>
															<tr>
																<td class="column column-1" width="100%"
																	style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																	<table class="heading_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0"
																		role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="pad">
																				<h3
																					style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 17px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 20.4px;">
																					<span class="tinyMce-placeholder">Cover Letter: </span>
																				</h3>
																			</td>
																		</tr>
																	</table>
																	<table class="text_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0"
																		role="presentation"
																		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																		<tr>
																			<td class="pad">
																				<div style="font-family: sans-serif">
																					<div class
																						style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 21.6px; color: #555555; line-height: 1.8;">
																						<div
																							style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 25.2px;">
																							${safeLetter}
																						</div>
																					</div>
																				</div>
																			</td>
																		</tr>
																	</table>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>

									<table class="row row-20" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F0F0F0; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
										<tbody>
											<tr>
												<td>
													<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
														role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #11253d; color: #000000; width: 620px; margin: 0 auto;"
														width="620">
														<tbody>
															<tr>
																<td class="column column-1" width="100%"
																	style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 15px; padding-top: 15px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																	<table class="social_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0"
																		role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="pad">
																				<div class="alignment" align="center">
																					<table class="social-table" width="180px" border="0" cellpadding="0" cellspacing="0"
																						role="presentation"
																						style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;">
																						<tr>
																							<td style="padding:0 2px 0 2px;"><a href="https://www.facebook.com/elonatech"
																									target="_blank"><img
																										src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/facebook@2x.png"
																										width="32" height="auto" alt="Facebook" title="facebook"
																										style="display: block; height: auto; border: 0;"></a></td>
																							<td style="padding:0 2px 0 2px;"><a href="https://www.twitter.com/elonatech"
																									target="_blank"><img
																										src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/twitter@2x.png"
																										width="32" height="auto" alt="Twitter" title="twitter"
																										style="display: block; height: auto; border: 0;"></a></td>
																							<td style="padding:0 2px 0 2px;"><a
																									href="https://www.linkedin.com/company/elonatech/" target="_blank"><img
																										src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/linkedin@2x.png"
																										width="32" height="auto" alt="Linkedin" title="linkedin"
																										style="display: block; height: auto; border: 0;"></a></td>
																							<td style="padding:0 2px 0 2px;"><a href="https://www.instagram.com/elonatech"
																									target="_blank"><img
																										src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/instagram@2x.png"
																										width="32" height="auto" alt="Instagram" title="instagram"
																										style="display: block; height: auto; border: 0;"></a></td>
																							<td style="padding:0 2px 0 2px;"><a href="https://www.youtube.com/eloatech"
																									target="_blank"><img
																										src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/youtube@2x.png"
																										width="32" height="auto" alt="YouTube" title="YouTube"
																										style="display: block; height: auto; border: 0;"></a></td>
																						</tr>
																					</table>
																				</div>
																			</td>
																		</tr>
																	</table>
																	<table class="paragraph_block block-2" width="100%" border="0" cellpadding="10"
																		cellspacing="0" role="presentation"
																		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																		<tr>
																			<td class="pad">
																				<div
																					style="color:#555555;font-family:Oxygen, Trebuchet MS, Helvetica, sans-serif;font-size:12px;font-weight:400;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
																					<p style="margin: 0; word-break: break-word;"><span
																							style="color: #ffffff;"><strong>Elonatech Nigeria Limited ©&nbsp; 2024 All rights
																								reserved</strong></span></p>
																					<p style="margin: 0; word-break: break-word;">&nbsp;</p>
																					<span style="color: #ffffff;">You can view our privacy policy </span>
																					<span style="color: #c13b3b;"><a href="http://www.elonatech.com.ng/policy"
																							target="_blank" rel="noopener"
																							style="text-decoration: underline; color: #56B500;">here</a>.
																					</span>
																					<p style="margin-top: 10px;">This email was sent to <a href="mailto:${email}"
																							style="text-decoration: underline; color: #3b75c1;">${email}</a> because you signed up for one of our services</p>
																				</div>
																			</td>
																		</tr>
																	</table>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
									<table class="row row-21" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
										role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
										<tbody>
											<tr>
												<td>
													<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
														role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 620px; margin: 0 auto;"
														width="620">
														<tbody>
															<tr>
																<td class="column column-1" width="100%"
																	style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																	<table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
																		role="presentation"
																		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: center;">
																		<tr>
																			<td class="pad"
																				style="vertical-align: middle; color: #1e0e4b; font-family: 'Inter', sans-serif; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
																				<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
																					style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																					<tr>
																						<td class="alignment" style="vertical-align: middle; text-align: center;">
																							<!--[if vml]><table align="center" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
																							<!--[if !vml]><!-->
																							<table class="icons-inner"
																								style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;"
																								cellpadding="0" cellspacing="0" role="presentation"><!--<![endif]-->

																							</table>
																						</td>
																					</tr>
																				</table>
																			</td>
																		</tr>
																	</table>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table><!-- End -->
				</body>

				</html>`,
			attachments: file ? [{
				filename: file.originalname,
				content: file.buffer.toString('base64'),
				encoding: 'base64'
			}] : []
		}

		await sgMail.send(mailOptions);

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
			html: `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
  <title></title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet"
    type="text/css">
  <link href="https://fonts.googleapis.com/css2?family=Oxygen:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet"
    type="text/css"><!--<![endif]-->
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
    }

    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: inherit !important;
    }

    #MessageViewBody a {
      color: inherit;
      text-decoration: none;
    }

    p {
      line-height: inherit
    }

    .desktop_hide,
    .desktop_hide table {
      mso-hide: all;
      display: none;
      max-height: 0px;
      overflow: hidden;
    }

    .image_block img+div {
      display: none;
    }

    @media (max-width:640px) {

      .desktop_hide table.icons-inner,
      .social_block.desktop_hide .social-table {
        display: inline-block !important;
      }

      .icons-inner {
        text-align: center;
      }

      .icons-inner td {
        margin: 0 auto;
      }

      .mobile_hide {
        display: none;
      }

      .row-content {
        width: 100% !important;
      }

      .stack .column {
        width: 100%;
        display: block;
      }

      .mobile_hide {
        min-height: 0;
        max-height: 0;
        max-width: 0;
        overflow: hidden;
        font-size: 0px;
      }

      .desktop_hide,
      .desktop_hide table {
        display: table !important;
        max-height: none !important;
      }
    }
  </style>
</head>

<body style="background-color: #DFDFDF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
  <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #DFDFDF;">
    <tbody>
      <tr>
        <td>
          <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #3c5d98; color: #000000; background-size: auto; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                <div class="alignment" align="center" style="line-height:10px">
                                  <div style="max-width: 279px;"><img
                                      src="https://elonatech.com.ng/static/media/elonatech.c6083e7d06b4cbab7d90.png"
                                      style="display: block; height: auto; border: 0; width: 100%;" width="279"
                                      height="auto"></div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #3c5d98; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad" style="padding-left:60px;padding-right:60px;">
                                <div
                                  style="color:#FFFFFF;font-family:'Oswald','Lucida Sans Unicode','Lucida Grande',sans-serif;font-size:14px;line-height:180%;text-align:center;mso-line-height-alt:25.2px;">
                                  <p style="margin: 0; word-break: break-word;"><br></p>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <table class="heading_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h2
                                  style="margin: 0; color: #f5f5f5; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 30px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 36px;">
                                  <span class="tinyMce-placeholder">Quote</span>
                                </h2>
                              </td>
                            </tr>
                          </table>
                          <table class="image_block mobile_hide block-3" width="100%" border="0" cellpadding="10"
                            cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="center" style="line-height:10px">
                                  <div style="max-width: 64px;"><img
                                      src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/smile.png"
                                      style="display: block; height: auto; border: 0; width: 100%;" width="64"
                                      alt="Image" title="Image" height="auto"></div>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <div class="spacer_block block-4 mobile_hide"
                            style="height:125px;line-height:125px;font-size:1px;">&#8202;</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F5F5F5; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #F5F5F5; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="center">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="divider_inner"
                                        style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
                                        <span>&#8202;</span>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="left">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="divider_inner"
                                        style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
                                        <span>&#8202;</span>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F5F5F5; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #F5F5F5; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="center">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="divider_inner"
                                        style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
                                        <span>&#8202;</span>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="left">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="divider_inner"
                                        style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
                                        <span>&#8202;</span>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-7" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Fullname:&nbsp;&nbsp;</span>
                                </h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${fullname}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-8" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Email:&nbsp;&nbsp;</span>
                                </h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${email}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-9" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Company:&nbsp;&nbsp;</span>
                                </h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${company}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-10" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Phone:&nbsp;&nbsp;</span>
                                </h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${number}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-11" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Project:&nbsp;&nbsp;</span>
                                </h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${project}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-12" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Location:&nbsp;&nbsp;</span>
                                </h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${location}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-13" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 17px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 20.4px;">
                                  <span class="tinyMce-placeholder">Cover Letter: </span>
                                </h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 21.6px; color: #555555; line-height: 1.8;">
                                    <div
                                      style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 25.2px;">
                                      ${letter}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-14" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 20px; padding-right: 20px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="left">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="divider_inner"
                                        style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
                                        <span>&#8202;</span>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-15" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F0F0F0; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #11253d; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 15px; padding-top: 15px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="social_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="center">
                                  <table class="social-table" width="180px" border="0" cellpadding="0" cellspacing="0"
                                    role="presentation"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;">
                                    <tr>
                                      <!-- Facebook -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.facebook.com/elonatech" target="_blank"><img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/facebook@2x.png"
                                            width="32" height="auto" alt="Facebook" title="facebook"
                                            style="display: block; height: auto; border: 0;">
                                        </a>
                                      </td>
                                      <!-- Instagram -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.instagram.com/elonatech" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/instagram@2x.png"
                                            width="32" height="auto" alt="Instagram" title="instagram"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                      <!-- Threads -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.threads.com/@elonatech" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/threads@2x.png"
                                            width="32" height="auto" alt="Threads" title="threads"
                                            style="display: block; height: auto; border: 0;">
                                        </a>
                                      </td>
                                      <!-- Tiktok -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.tiktok.com/@.elonatech" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/tiktok@2x.png"
                                            width="32" height="auto" alt="Tiktok" title="tiktok"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                      <!-- Twitter -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.twitter.com/elonatech" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/twitter@2x.png"
                                            width="32" height="auto" alt="Twitter" title="twitter"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                      <!-- Linkedin -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.linkedin.com/company/elonatech/" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/linkedin@2x.png"
                                            width="32" height="auto" alt="Linkedin" title="linkedin"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                      <!-- Pinterest -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.pinterest.com/Elonatechnig/" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/pinterest@2x.png"
                                            width="32" height="auto" alt="Pinterest" title="pinterest"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                      <!-- YouTube -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.youtube.com/elonatech" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/youtube@2x.png"
                                            width="32" height="auto" alt="YouTube" title="YouTube"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <table class="paragraph_block block-2" width="100%" border="0" cellpadding="10"
                            cellspacing="0" role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div
                                  style="color:#555555;font-family:Oxygen, Trebuchet MS, Helvetica, sans-serif;font-size:12px;font-weight:400;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
                                  <p style="margin: 0; word-break: break-word;">
                                    <span style="color: #ffffff;"><strong>Elonatech Nigeria Limited ©&nbsp; ${new
					Date().getFullYear()} All rights reserved</strong>
                                    </span>
                                  </p>
                                  <p style="margin: 0; word-break: break-word;">&nbsp;</p>
                                  <span style="color: #ffffff;">You can view our privacy policy </span>
                                  <span style="color: #c13b3b;"><a href="http://www.elonatech.com.ng/policy"
                                      target="_blank" rel="noopener"
                                      style="text-decoration: underline; color: #56B500;">here</a>.
                                  </span>
                                  <p style="margin-top: 10px;">This email was sent to <a href="mailto:${email}"
                                      style="text-decoration: underline; color: #3b75c1;">${email}</a> because you
                                    signed up for one of our services</p>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-16" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: center;">
                            <tr>
                              <td class="pad"
                                style="vertical-align: middle; color: #1e0e4b; font-family: 'Inter', sans-serif; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                                <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="alignment" style="vertical-align: middle; text-align: center;">
                                      <!--[if vml]><table align="center" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                      <!--[if !vml]><!-->
                                      <table class="icons-inner"
                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;"
                                        cellpadding="0" cellspacing="0" role="presentation"><!--<![endif]-->

                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table><!-- End -->
</body>

</html>`
		}

		try {
			await sgMail.send(mailOptions);
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
		subject: "Consultation",
		html: `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
  <title></title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet"
    type="text/css">
  <link href="https://fonts.googleapis.com/css2?family=Oxygen:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet"
    type="text/css"><!--<![endif]-->
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
    }

    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: inherit !important;
    }

    #MessageViewBody a {
      color: inherit;
      text-decoration: none;
    }

    p {
      line-height: inherit
    }

    .desktop_hide,
    .desktop_hide table {
      mso-hide: all;
      display: none;
      max-height: 0px;
      overflow: hidden;
    }

    .image_block img+div {
      display: none;
    }

    @media (max-width:640px) {

      .desktop_hide table.icons-inner,
      .social_block.desktop_hide .social-table {
        display: inline-block !important;
      }

      .icons-inner {
        text-align: center;
      }

      .icons-inner td {
        margin: 0 auto;
      }

      .mobile_hide {
        display: none;
      }

      .row-content {
        width: 100% !important;
      }

      .stack .column {
        width: 100%;
        display: block;
      }

      .mobile_hide {
        min-height: 0;
        max-height: 0;
        max-width: 0;
        overflow: hidden;
        font-size: 0px;
      }

      .desktop_hide,
      .desktop_hide table {
        display: table !important;
        max-height: none !important;
      }
    }
  </style>
</head>

<body style="background-color: #DFDFDF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
  <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #DFDFDF;">
    <tbody>
      <tr>
        <td>
          <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #3c5d98; color: #000000; background-size: auto; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                <div class="alignment" align="center" style="line-height:10px">
                                  <div style="max-width: 279px;"><img
                                      src="https://elonatech.com.ng/static/media/elonatech.c6083e7d06b4cbab7d90.png"
                                      style="display: block; height: auto; border: 0; width: 100%;" width="279"
                                      height="auto"></div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #3c5d98; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad" style="padding-left:60px;padding-right:60px;">
                                <div
                                  style="color:#FFFFFF;font-family:'Oswald','Lucida Sans Unicode','Lucida Grande',sans-serif;font-size:14px;line-height:180%;text-align:center;mso-line-height-alt:25.2px;">
                                  <p style="margin: 0; word-break: break-word;"><br></p>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <table class="heading_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h2
                                  style="margin: 0; color: #f5f5f5; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 30px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 36px;">
                                  <span class="tinyMce-placeholder">Free Consultation</span></h2>
                              </td>
                            </tr>
                          </table>
                          <table class="image_block mobile_hide block-3" width="100%" border="0" cellpadding="10"
                            cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="center" style="line-height:10px">
                                  <div style="max-width: 64px;"><img
                                      src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/smile.png"
                                      style="display: block; height: auto; border: 0; width: 100%;" width="64"
                                      alt="Image" title="Image" height="auto"></div>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <div class="spacer_block block-4 mobile_hide"
                            style="height:125px;line-height:125px;font-size:1px;">&#8202;</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F5F5F5; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #F5F5F5; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="center">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="divider_inner"
                                        style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
                                        <span>&#8202;</span></td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="left">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="divider_inner"
                                        style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
                                        <span>&#8202;</span></td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F5F5F5; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #F5F5F5; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="center">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="divider_inner"
                                        style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
                                        <span>&#8202;</span></td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="left">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="divider_inner"
                                        style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
                                        <span>&#8202;</span></td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-7" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Fullname:&nbsp;&nbsp;</span></h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${name}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-8" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Email:&nbsp;&nbsp;</span></h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${email}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-9" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Occupation:&nbsp;&nbsp;</span></h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${occupation}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-10" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Currently Faced Challenges:&nbsp;&nbsp;</span></h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${challenge}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-11" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Business Challenges:&nbsp;&nbsp;</span></h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${business}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-12" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Cost:&nbsp;&nbsp;</span></h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${cost}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-13" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Business:&nbsp;&nbsp;</span></h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${invest}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-15" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 20px; padding-right: 20px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="left">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="divider_inner"
                                        style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
                                        <span>&#8202;</span></td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-16" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F0F0F0; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #11253d; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 15px; padding-top: 15px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="social_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="center">
                                  <table class="social-table" width="180px" border="0" cellpadding="0" cellspacing="0"
                                    role="presentation"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;">
                                    <tr>
                                      <!-- Facebook -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.facebook.com/elonatech" target="_blank"><img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/facebook@2x.png"
                                            width="32" height="auto" alt="Facebook" title="facebook"
                                            style="display: block; height: auto; border: 0;">
                                        </a>
                                      </td>
                                      <!-- Instagram -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.instagram.com/elonatech" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/instagram@2x.png"
                                            width="32" height="auto" alt="Instagram" title="instagram"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                      <!-- Threads -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.threads.com/@elonatech" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/threads@2x.png"
                                            width="32" height="auto" alt="Threads" title="threads"
                                            style="display: block; height: auto; border: 0;">
                                        </a>
                                      </td>
                                      <!-- Tiktok -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.tiktok.com/@.elonatech" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/tiktok@2x.png"
                                            width="32" height="auto" alt="Tiktok" title="tiktok"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                      <!-- Twitter -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.twitter.com/elonatech" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/twitter@2x.png"
                                            width="32" height="auto" alt="Twitter" title="twitter"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                      <!-- Linkedin -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.linkedin.com/company/elonatech/" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/linkedin@2x.png"
                                            width="32" height="auto" alt="Linkedin" title="linkedin"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                      <!-- Pinterest -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.pinterest.com/Elonatechnig/" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/pinterest@2x.png"
                                            width="32" height="auto" alt="Pinterest" title="pinterest"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                      <!-- YouTube -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.youtube.com/elonatech" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/youtube@2x.png"
                                            width="32" height="auto" alt="YouTube" title="YouTube"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <table class="paragraph_block block-2" width="100%" border="0" cellpadding="10"
                            cellspacing="0" role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div
                                  style="color:#555555;font-family:Oxygen, Trebuchet MS, Helvetica, sans-serif;font-size:12px;font-weight:400;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
                                  <p style="margin: 0; word-break: break-word;"><span
                                      style="color: #ffffff;"><strong>Elonatech Nigeria Limited ©&nbsp; 2024 All rights
                                        reserved</strong></span></p>
                                  <p style="margin: 0; word-break: break-word;">&nbsp;</p>
                                  <p style="margin: 0; word-break: break-word;"><span style="color: #ffffff;">Want to
                                      change which emails you receive from us? You can update your preferences</span>
                                    <span style="color: #c13b3b;"><a href="http://example.com/preferences"
                                        target="_blank" rel="noopener"
                                        style="text-decoration: underline; color: #56B500;">here</a></span> <span
                                      style="color: #ffffff;">or unsubscribe</span> <span style="color: #c13b3b;"><a
                                        href="http://example.com/unsubcribe" target="_blank" rel="noopener"
                                        style="text-decoration: underline; color: #56B500;">here</a>.</span> <span
                                      style="color: #ffffff;">You can view our privacy policy </span><span
                                      style="color: #c13b3b;"><a href="http://www.example.com/privacy-policy"
                                        target="_blank" rel="noopener"
                                        style="text-decoration: underline; color: #56B500;">here</a>.</span></p>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-17" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: center;">
                            <tr>
                              <td class="pad">
                                <div
                                  style="color:#555555;font-family:Oxygen, Trebuchet MS, Helvetica, sans-serif;font-size:12px;font-weight:400;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
                                  <p style="margin: 0; word-break: break-word;">
                                    <span style="color: #ffffff;"><strong>Elonatech Nigeria Limited ©&nbsp; ${new
				Date().getFullYear()} All rights reserved</strong>
                                    </span>
                                  </p>
                                  <p style="margin: 0; word-break: break-word;">&nbsp;</p>
                                  <span style="color: #ffffff;">You can view our privacy policy </span>
                                  <span style="color: #c13b3b;"><a href="http://www.elonatech.com.ng/policy"
                                      target="_blank" rel="noopener"
                                      style="text-decoration: underline; color: #56B500;">here</a>.
                                  </span>
                                  <p style="margin-top: 10px;">This email was sent to <a href="mailto:${email}"
                                      style="text-decoration: underline; color: #3b75c1;">${email}</a> because you
                                    signed up for one of our services</p>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table><!-- End -->
</body>

</html>
`,
	}

	try {
		await sgMail.send(mailOptions);
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
		subject: "Get in Touch with us",
		html: `
	<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
	<title></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
	<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet" type="text/css">
	<link href="https://fonts.googleapis.com/css2?family=Oxygen:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet" type="text/css"><!--<![endif]-->
	<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		.image_block img+div {
			display: none;
		}

		@media (max-width:640px) {

			.desktop_hide table.icons-inner,
			.social_block.desktop_hide .social-table {
				display: inline-block !important;
			}

			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.mobile_hide {
				display: none;
			}

			.row-content {
				width: 100% !important;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}
		}
	</style>
</head>

<body style="background-color: #DFDFDF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #DFDFDF;">
		<tbody>
			<tr>
				<td>
					<table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #3c5d98; color: #000000; background-size: auto; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
																<div class="alignment" align="center" style="line-height:10px">
																	<div style="max-width: 279px;"><img src="https://elonatech.com.ng/static/media/elonatech.c6083e7d06b4cbab7d90.png" style="display: block; height: auto; border: 0; width: 100%;" width="279" height="auto"></div>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
						<tbody>
							<tr>
								<td>
									<table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #3c5d98; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-left:60px;padding-right:60px;">
																<div style="color:#FFFFFF;font-family:'Oswald','Lucida Sans Unicode','Lucida Grande',sans-serif;font-size:14px;line-height:180%;text-align:center;mso-line-height-alt:25.2px;">
																	<p style="margin: 0; word-break: break-word;"><br></p>
																</div>
															</td>
														</tr>
													</table>
													<table class="heading_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<h2 style="margin: 0; color: #f5f5f5; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 30px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 36px;"><span class="tinyMce-placeholder">Contact Us</span></h2>
															</td>
														</tr>
													</table>
													<table class="image_block mobile_hide block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<div class="alignment" align="center" style="line-height:10px">
																	<div style="max-width: 64px;"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/smile.png" style="display: block; height: auto; border: 0; width: 100%;" width="64" alt="Image" title="Image" height="auto"></div>
																</div>
															</td>
														</tr>
													</table>
													<div class="spacer_block block-4 mobile_hide" style="height:125px;line-height:125px;font-size:1px;">&#8202;</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F5F5F5; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #F5F5F5; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<div class="alignment" align="center">
																	<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;"><span>&#8202;</span></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<div class="alignment" align="left">
																	<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;"><span>&#8202;</span></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F5F5F5; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #F5F5F5; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<div class="alignment" align="center">
																	<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;"><span>&#8202;</span></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<div class="alignment" align="left">
																	<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;"><span>&#8202;</span></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-7" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
						<tbody>
							<tr>
								<td>
									<table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<h3 style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;"><span class="tinyMce-placeholder">Fullname:&nbsp;&nbsp;</span></h3>
															</td>
														</tr>
													</table>
													<table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																		<p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">${name}&nbsp;</p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-8" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
						<tbody>
							<tr>
								<td>
									<table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; background-size: auto; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<h3 style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;"><span class="tinyMce-placeholder">Email:&nbsp;&nbsp;</span></h3>
															</td>
														</tr>
													</table>
													<table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																		<p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">${email}&nbsp;</p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-9" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
						<tbody>
							<tr>
								<td>
									<table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<h3 style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;"><span class="tinyMce-placeholder">Subject:&nbsp;&nbsp;</span></h3>
															</td>
														</tr>
													</table>
													<table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																		<p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">${subject}&nbsp;</p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-10" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
						<tbody>
							<tr>
								<td>
									<table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; background-size: auto; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<h3 style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;"><span class="tinyMce-placeholder">Number:&nbsp;&nbsp;</span></h3>
															</td>
														</tr>
													</table>
													<table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																		<p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">${number}&nbsp;</p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-11" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="heading_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<h3 style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 17px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 20.4px;"><span class="tinyMce-placeholder">Message: </span></h3>
															</td>
														</tr>
													</table>
													<table class="text_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 21.6px; color: #555555; line-height: 1.8;">
																		<div style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 25.2px;">
																		${message}
																		</div>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-12" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 20px; padding-right: 20px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<div class="alignment" align="left">
																	<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;"><span>&#8202;</span></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-13" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F0F0F0; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #11253d; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 15px; padding-top: 15px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="social_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<div class="alignment" align="center">
																	<table class="social-table" width="180px" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;">
																		<tr>
																			<td style="padding:0 2px 0 2px;"><a href="https://www.facebook.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/facebook@2x.png" width="32" height="auto" alt="Facebook" title="facebook" style="display: block; height: auto; border: 0;"></a></td>
																			<td style="padding:0 2px 0 2px;"><a href="https://www.twitter.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/twitter@2x.png" width="32" height="auto" alt="Twitter" title="twitter" style="display: block; height: auto; border: 0;"></a></td>
																			<td style="padding:0 2px 0 2px;"><a href="https://www.linkedin.com/company/elonatech/" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/linkedin@2x.png" width="32" height="auto" alt="Linkedin" title="linkedin" style="display: block; height: auto; border: 0;"></a></td>
																			<td style="padding:0 2px 0 2px;"><a href="https://www.instagram.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/instagram@2x.png" width="32" height="auto" alt="Instagram" title="instagram" style="display: block; height: auto; border: 0;"></a></td>
																			<td style="padding:0 2px 0 2px;"><a href="https://www.youtube.com/eloatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/youtube@2x.png" width="32" height="auto" alt="YouTube" title="YouTube" style="display: block; height: auto; border: 0;"></a></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="color:#555555;font-family:Oxygen, Trebuchet MS, Helvetica, sans-serif;font-size:12px;font-weight:400;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
																	<p style="margin: 0; word-break: break-word;"><span style="color: #ffffff;"><strong>Elonatech Nigeria Limited ©&nbsp; 2024 All rights reserved</strong></span></p>
																	<p style="margin: 0; word-break: break-word;">&nbsp;</p>
																	<p style="margin: 0; word-break: break-word;"><span style="color: #ffffff;">Want to change which emails you receive from us? You can update your preferences</span> <span style="color: #c13b3b;"><a href="http://example.com/preferences" target="_blank" rel="noopener" style="text-decoration: underline; color: #56B500;">here</a></span> <span style="color: #ffffff;">or unsubscribe</span> <span style="color: #c13b3b;"><a href="http://example.com/unsubcribe" target="_blank" rel="noopener" style="text-decoration: underline; color: #56B500;">here</a>.</span> <span style="color: #ffffff;">You can view our privacy policy </span><span style="color: #c13b3b;"><a href="http://www.example.com/privacy-policy" target="_blank" rel="noopener" style="text-decoration: underline; color: #56B500;">here</a>.</span></p>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-14" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: center;">
														<tr>
															<td class="pad" style="vertical-align: middle; color: #1e0e4b; font-family: 'Inter', sans-serif; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
																<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																	<tr>
																		<td class="alignment" style="vertical-align: middle; text-align: center;"><!--[if vml]><table align="center" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
																			<!--[if !vml]><!-->
																			<table class="icons-inner" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;" cellpadding="0" cellspacing="0" role="presentation"><!--<![endif]-->
																				
																			</table>
																		</td>
																	</tr>
																</table>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table><!-- End -->
</body>

</html>
	
	
	`
	}

	try {
		await sgMail.send(mailOptions);
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
		subject: "Get in Touch with us",
		html: `
<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
  <title></title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet"
    type="text/css">
  <link href="https://fonts.googleapis.com/css2?family=Oxygen:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet"
    type="text/css"><!--<![endif]-->
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
    }

    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: inherit !important;
    }

    #MessageViewBody a {
      color: inherit;
      text-decoration: none;
    }

    p {
      line-height: inherit
    }

    .desktop_hide,
    .desktop_hide table {
      mso-hide: all;
      display: none;
      max-height: 0px;
      overflow: hidden;
    }

    .image_block img+div {
      display: none;
    }

    @media (max-width:640px) {

      .desktop_hide table.icons-inner,
      .social_block.desktop_hide .social-table {
        display: inline-block !important;
      }

      .icons-inner {
        text-align: center;
      }

      .icons-inner td {
        margin: 0 auto;
      }

      .mobile_hide {
        display: none;
      }

      .row-content {
        width: 100% !important;
      }

      .stack .column {
        width: 100%;
        display: block;
      }

      .mobile_hide {
        min-height: 0;
        max-height: 0;
        max-width: 0;
        overflow: hidden;
        font-size: 0px;
      }

      .desktop_hide,
      .desktop_hide table {
        display: table !important;
        max-height: none !important;
      }
    }
  </style>
</head>

<body style="background-color: #DFDFDF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
  <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #DFDFDF;">
    <tbody>
      <tr>
        <td>
          <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #3c5d98; color: #000000; background-size: auto; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                <div class="alignment" align="center" style="line-height:10px">
                                  <div style="max-width: 279px;"><img
                                      src="https://elonatech.com.ng/static/media/elonatech.c6083e7d06b4cbab7d90.png"
                                      style="display: block; height: auto; border: 0; width: 100%;" width="279"
                                      height="auto"></div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #3c5d98; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad" style="padding-left:60px;padding-right:60px;">
                                <div
                                  style="color:#FFFFFF;font-family:'Oswald','Lucida Sans Unicode','Lucida Grande',sans-serif;font-size:14px;line-height:180%;text-align:center;mso-line-height-alt:25.2px;">
                                  <p style="margin: 0; word-break: break-word;"><br></p>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <table class="heading_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h2
                                  style="margin: 0; color: #f5f5f5; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 30px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 36px;">
                                  <span class="tinyMce-placeholder">Reason For Call</span>
                                </h2>
                              </td>
                            </tr>
                          </table>
                          <table class="image_block mobile_hide block-3" width="100%" border="0" cellpadding="10"
                            cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="center" style="line-height:10px">
                                  <div style="max-width: 64px;"><img
                                      src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/smile.png"
                                      style="display: block; height: auto; border: 0; width: 100%;" width="64"
                                      alt="Image" title="Image" height="auto"></div>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <div class="spacer_block block-4 mobile_hide"
                            style="height:125px;line-height:125px;font-size:1px;">&#8202;</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F5F5F5; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #F5F5F5; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="center">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="divider_inner"
                                        style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
                                        <span>&#8202;</span>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="left">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="divider_inner"
                                        style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
                                        <span>&#8202;</span>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F5F5F5; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #F5F5F5; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="center">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="divider_inner"
                                        style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
                                        <span>&#8202;</span>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="left">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="divider_inner"
                                        style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
                                        <span>&#8202;</span>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-7" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Fullname:&nbsp;&nbsp;</span>
                                </h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${name}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-8" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Email:&nbsp;&nbsp;</span>
                                </h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${email}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-9" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Subject:&nbsp;&nbsp;</span>
                                </h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${subject}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-10" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Number:&nbsp;&nbsp;</span>
                                </h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${number}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-11" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                </div>
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 17px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 20.4px;">
                                  <span class="tinyMce-placeholder">Reason for the call: </span>
                                </h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 21.6px; color: #555555; line-height: 1.8;">
                                    <div
                                      style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 25.2px;">
                                      ${message}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-12" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 20px; padding-right: 20px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="left">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="divider_inner"
                                        style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
                                        <span>&#8202;</span>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-13" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F0F0F0; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #11253d; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 15px; padding-top: 15px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="social_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="center">
                                  <table class="social-table" width="180px" border="0" cellpadding="0" cellspacing="0"
                                    role="presentation"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;">
                                    <tr>
                                      <!-- Facebook -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.facebook.com/elonatech" target="_blank"><img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/facebook@2x.png"
                                            width="32" height="auto" alt="Facebook" title="facebook"
                                            style="display: block; height: auto; border: 0;">
                                        </a>
                                      </td>
                                      <!-- Instagram -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.instagram.com/elonatech" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/instagram@2x.png"
                                            width="32" height="auto" alt="Instagram" title="instagram"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                      <!-- Threads -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.threads.com/@elonatech" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/threads@2x.png"
                                            width="32" height="auto" alt="Threads" title="threads"
                                            style="display: block; height: auto; border: 0;">
                                        </a>
                                      </td>
                                      <!-- Tiktok -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.tiktok.com/@.elonatech" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/tiktok@2x.png"
                                            width="32" height="auto" alt="Tiktok" title="tiktok"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                      <!-- Twitter -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.twitter.com/elonatech" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/twitter@2x.png"
                                            width="32" height="auto" alt="Twitter" title="twitter"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                      <!-- Linkedin -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.linkedin.com/company/elonatech/" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/linkedin@2x.png"
                                            width="32" height="auto" alt="Linkedin" title="linkedin"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                      <!-- Pinterest -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.pinterest.com/Elonatechnig/" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/pinterest@2x.png"
                                            width="32" height="auto" alt="Pinterest" title="pinterest"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                      <!-- YouTube -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.youtube.com/elonatech" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/youtube@2x.png"
                                            width="32" height="auto" alt="YouTube" title="YouTube"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <table class="paragraph_block block-2" width="100%" border="0" cellpadding="10"
                            cellspacing="0" role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div
                                  style="color:#555555;font-family:Oxygen, Trebuchet MS, Helvetica, sans-serif;font-size:12px;font-weight:400;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
                                  <p style="margin: 0; word-break: break-word;">
                                    <span style="color: #ffffff;"><strong>Elonatech Nigeria Limited ©&nbsp; ${new
				Date().getFullYear()} All rights reserved</strong>
                                    </span>
                                  </p>
                                  <p style="margin: 0; word-break: break-word;">&nbsp;</p>
                                  <span style="color: #ffffff;">You can view our privacy policy </span>
                                  <span style="color: #c13b3b;"><a href="http://www.elonatech.com.ng/policy"
                                      target="_blank" rel="noopener"
                                      style="text-decoration: underline; color: #56B500;">here</a>.
                                  </span>
                                  <p style="margin-top: 10px;">This email was sent to <a href="mailto:${email}"
                                      style="text-decoration: underline; color: #3b75c1;">${email}</a> because you
                                    signed up for one of our services</p>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-14" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: center;">
                            <tr>
                              <td class="pad"
                                style="vertical-align: middle; color: #1e0e4b; font-family: 'Inter', sans-serif; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                                <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="alignment" style="vertical-align: middle; text-align: center;">
                                      <!--[if vml]><table align="center" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                      <!--[if !vml]><!-->
                                      <table class="icons-inner"
                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;"
                                        cellpadding="0" cellspacing="0" role="presentation"><!--<![endif]-->

                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table><!-- End -->
</body>

</html>`
	}

	try {
		await sgMail.send(mailOptions);
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



	const mailOptions = {
		from: "noreply@elonatech.com.ng",
		replyTo: "noreply@elonatech.com.ng",
		to: email,
		bcc: ["billing@elonatech.com.ng"],
		subject: "Check Out",
		html: `
    
    <!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
	<title></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
	<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet" type="text/css">
	<link href="https://fonts.googleapis.com/css2?family=Oxygen:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet" type="text/css"><!--<![endif]-->
	<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		.image_block img+div {
			display: none;
		}

		@media (max-width:640px) {

			.desktop_hide table.icons-inner,
			.social_block.desktop_hide .social-table {
				display: inline-block !important;
			}

			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.mobile_hide {
				display: none;
			}

			.row-content {
				width: 100% !important;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}
		}
	</style>
</head>

<body style="background-color: #DFDFDF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #DFDFDF;">
		<tbody>
			<tr>
				<td>
					<table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #3c5d98; color: #000000; background-size: auto; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
																<div class="alignment" align="center" style="line-height:10px">
																	<div style="max-width: 279px;"><img src="https://elonatech.com.ng/static/media/elonatech.c6083e7d06b4cbab7d90.png" style="display: block; height: auto; border: 0; width: 100%;" width="279" height="auto"></div>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
						<tbody>
							<tr>
								<td>
									<table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #3c5d98; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
<!------------------------------------------------------------------------------------ first name lastname  -------------------------------------------------------------------------- -->
<!------------------------------------------------------------------------------------ first name lastname  -------------------------------------------------------------------------- -->
															<td class="pad" style="padding-left:60px;padding-right:60px;padding-top:60px;">
																<div style="color:#FFFFFF;font-family:Oxygen, Trebuchet MS, Helvetica, sans-serif;font-size:34px;font-weight:400;line-height:180%;text-align:center;mso-line-height-alt:61.2px;">
																	<p style="margin: 0; word-break: break-word;"><span><span>Hi, ${firstname} ${lastname}!</span><strong><span>&nbsp;</span></strong></span></p>
																</div>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-left:60px;padding-right:60px;">
																<div style="color:#FFFFFF;font-family:Oxygen, Trebuchet MS, Helvetica, sans-serif;font-size:24px;font-weight:400;line-height:180%;text-align:center;mso-line-height-alt:43.2px;">
																	<p style="margin: 0; word-break: break-word;"><span><span>We saw your cart - great choices!</span></span></p>
																</div>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-left:60px;padding-right:60px;">
																<div style="color:#FFFFFF;font-family:'Oswald','Lucida Sans Unicode','Lucida Grande',sans-serif;font-size:14px;line-height:180%;text-align:center;mso-line-height-alt:25.2px;">
																	<p style="margin: 0; word-break: break-word;"><br></p>
																</div>
															</td>
														</tr>
													</table>
													<table class="image_block block-4 mobile_hide" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="width:100%;">
																<div class="alignment" align="center" style="line-height:10px">
																	<div style="max-width: 64px;"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/smile.png" style="display: block; height: auto; border: 0; width: 100%;" width="64" alt="Image" title="Image" height="auto"></div>
																</div>
															</td>
														</tr>
													</table>
													<div class="spacer_block block-5 mobile_hide" style="height:125px;line-height:125px;font-size:1px;">&#8202;</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto; background-color: #ebebeb; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; border-right: 1px solid #DFDFDF; padding-bottom: 10px; padding-top: 20px; vertical-align: top; border-top: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="width:100%;">
																<div class="alignment" align="center" style="line-height:10px">
																	<div style="max-width: 27px;"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/barcode.png" style="display: block; height: auto; border: 0; width: 100%;" width="27" alt="Image" title="Image" height="auto"></div>
																</div>
															</td>
														</tr>
													</table>
													<table class="text_block block-2" width="100%" border="0" cellpadding="15" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																		<!------------------------------------------------------------------------------------------------- Order Number ----------------------------------------------------------------------------------------------------- -->
																		<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><span style="color:#000000;font-size:14px;"><strong>Order Number </strong>:</span> <strong>${`2-9838CX`}</strong></p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</td>
												<td class="column column-2" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; border-right: 1px solid #DFDFDF; padding-bottom: 10px; padding-top: 15px; vertical-align: top; border-top: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="width:100%;">
																<div class="alignment" align="center" style="line-height:10px">
																	<div style="max-width: 27px;"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/calendar.png" style="display: block; height: auto; border: 0; width: 100%;" width="27" alt="Image" title="Image" height="auto"></div>
																</div>
															</td>
														</tr>
													</table>
													<table class="text_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																		<!--===================================================================================== Date of Order ===================================================================-->
																		<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><span style="color:#999999;font-size:14px;"><strong><span style="color:#000000;">Date Placed </span></strong><span style="color:#000000;">:</span></span> <strong>${dateNow}</strong></p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</td>
												<td class="column column-3" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 15px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="text_block block-1" width="100%" border="0" cellpadding="25" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
<!------------------------------------------------------------------------- Total Amount of the  cart =================================================================================== -->
																	<div class style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																		<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><strong><span style="color:#000000;font-size:14px;"><span style="font-size:18px;">Total :</span></span><span style="color:#000000;"> </span>&nbsp;<span style="font-size:18px;">₦ ${cartTotal}</span></strong></p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-left:40px;padding-right:40px;padding-top:5px;">
																<div style="color:#000000;font-family:Oxygen, Trebuchet MS, Helvetica, sans-serif;font-size:24px;font-weight:700;line-height:150%;text-align:center;mso-line-height-alt:36px;">
																	<p style="margin: 0;">Items Ordered</p>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>


<!--=================================================================== Item  order table  ================================================================================-->
					<table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
						<tbody>
							<tr>
								<td>
									<table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #11253d; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; border-right: 1px solid #519E0A; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="color:#FFFFFF;font-family:Oxygen, Trebuchet MS, Helvetica, sans-serif;font-size:13px;font-weight:700;line-height:120%;text-align:center;mso-line-height-alt:15.6px;">
																	<p style="margin: 0; word-break: break-word;"><span><strong>Items Name</strong></span></p>
																</div>
															</td>
														</tr>
													</table>
												</td>
												<td class="column column-2" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; border-right: 1px solid #519E0A; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="color:#FFFFFF;font-family:Oxygen, Trebuchet MS, Helvetica, sans-serif;font-size:13px;font-weight:700;line-height:120%;text-align:center;mso-line-height-alt:15.6px;">
																	<p style="margin: 0; word-break: break-word;"><span><strong>Quantity</strong></span></p>
																</div>
															</td>
														</tr>
													</table>
												</td>
												<td class="column column-3" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="color:#FFFFFF;font-family:Oxygen, Trebuchet MS, Helvetica, sans-serif;font-size:13px;font-weight:700;line-height:120%;text-align:center;mso-line-height-alt:15.6px;">
																	<p style="margin: 0; word-break: break-word;"><span><strong>Price</strong></span></p>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F5F5F5; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #F5F5F5; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<div class="alignment" align="center">
																	<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;"><span>&#8202;</span></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-7" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<div class="alignment" align="left">
																	<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;"><span>&#8202;</span></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-8" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F5F5F5; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #F5F5F5; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<div class="alignment" align="center">
																	<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;"><span>&#8202;</span></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>

<!-- ======================== ====================================  Items Ordered    =========================================================== ================================-->
         <div style="margin:0" class="border="0" ">
         ${itemsOrdered}
         </div>
<!--============================================================================================================= table item ======================================================================-->
					<table class="row row-11" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<div class="alignment" align="left">
																	<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;"><span>&#8202;</span></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-12" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
						<tbody>
							<tr>
								<td>
									<table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto; background-color: #11253d; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="color:#f5f5f5;direction:ltr;font-family:Oxygen, Trebuchet MS, Helvetica, sans-serif;font-size:20px;font-weight:700;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:24px;">
																	<p style="margin: 0;">Order Total:</p>
																</div>
															</td>
														</tr>
													</table>
												</td>
												<td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:10px;padding-left:60px;padding-right:60px;padding-top:10px;">
																<div style="color:#f5f5f5;direction:ltr;font-family:Oxygen, Trebuchet MS, Helvetica, sans-serif;font-size:17px;font-weight:700;letter-spacing:0px;line-height:120%;text-align:right;mso-line-height-alt:20.4px;">
																	<p style="margin: 0;">₦ ${cartTotal}</p>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-13" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
						<tbody>
							<tr>
								<td>
									<table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; background-size: auto; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="heading_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<h3 style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 17px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 20.4px;"><span class="tinyMce-placeholder">Delivery Details</span></h3>
															</td>
														</tr>
													</table>

													
													<table class="paragraph_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
<!--============================================================================================ Address =============================================================== -->
															<td class="pad">
																<div style="color:#101112;direction:ltr;font-family:Oxygen, Trebuchet MS, Helvetica, sans-serif;font-size:15px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:18px;">
																	<p style="margin: 0;">${address},<br>${state},  <br>${postal}</p>
																</div>
															</td>
														</tr>
													</table>
												</td>
												<td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="heading_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<h3 style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 17px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 20.4px;"><span class="tinyMce-placeholder">Company Name</span></h3>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
<!--=========================================================== Company Name ========================================================================================================== -->
															<td class="pad">
																<div style="color:#101112;direction:ltr;font-family:Oxygen, Trebuchet MS, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:19.2px;">
																	<p style="margin: 0;">${company}&nbsp;</p>
																</div>
															</td>
														</tr>
													</table>
													<table class="heading_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<h3 style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 17px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 20.4px;"><span class="tinyMce-placeholder">Phone Number</span></h3>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
<!--=========================================================== Phone Number ========================================================================================================== -->
															<td class="pad">
																<div style="color:#101112;direction:ltr;font-family:Oxygen, Trebuchet MS, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:19.2px;">
																	<p style="margin: 0;">${number}&nbsp;</p>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-14" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; background-size: auto; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="heading_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<h3 style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 17px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 20.4px;"><span class="tinyMce-placeholder">Order Notes: </span></h3>
															</td>
														</tr>
													</table>
													<table class="text_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																		<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;">${notes}</p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-15" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 20px; padding-right: 20px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<div class="alignment" align="left">
																	<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;"><span>&#8202;</span></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-16" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F0F0F0; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #11253d; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 15px; padding-top: 15px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="social_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<div class="alignment" align="center">
																	<table class="social-table" width="180px" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;">
																		<tr>
																			<td style="padding:0 2px 0 2px;"><a href="https://www.facebook.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/facebook@2x.png" width="32" height="auto" alt="Facebook" title="facebook" style="display: block; height: auto; border: 0;"></a></td>
																			<td style="padding:0 2px 0 2px;"><a href="https://www.twitter.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/twitter@2x.png" width="32" height="auto" alt="Twitter" title="twitter" style="display: block; height: auto; border: 0;"></a></td>
																			<td style="padding:0 2px 0 2px;"><a href="https://www.linkedin.com/company/elonatech/" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/linkedin@2x.png" width="32" height="auto" alt="Linkedin" title="linkedin" style="display: block; height: auto; border: 0;"></a></td>
																			<td style="padding:0 2px 0 2px;"><a href="https://www.instagram.com/elonatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/instagram@2x.png" width="32" height="auto" alt="Instagram" title="instagram" style="display: block; height: auto; border: 0;"></a></td>
																			<td style="padding:0 2px 0 2px;"><a href="https://www.youtube.com/eloatech" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/youtube@2x.png" width="32" height="auto" alt="YouTube" title="YouTube" style="display: block; height: auto; border: 0;"></a></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
                                <div
                                  style="color:#555555;font-family:Oxygen, Trebuchet MS, Helvetica, sans-serif;font-size:12px;font-weight:400;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
                                  <p style="margin: 0; word-break: break-word;">
                                    <span style="color: #ffffff;"><strong>Elonatech Nigeria Limited ©&nbsp; ${new
				Date().getFullYear()} All rights reserved</strong>
                                    </span>
                                  </p>
                                  <p style="margin: 0; word-break: break-word;">&nbsp;</p>
                                  <span style="color: #ffffff;">You can view our privacy policy </span>
                                  <span style="color: #c13b3b;"><a href="http://www.elonatech.com.ng/policy"
                                      target="_blank" rel="noopener"
                                      style="text-decoration: underline; color: #56B500;">here</a>.
                                  </span>
                                  <p style="margin-top: 10px;">This email was sent to <a href="mailto:${email}"
                                      style="text-decoration: underline; color: #3b75c1;">${email}</a> because you
                                    signed up for one of our services</p>
                                </div>
                              </td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-17" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: center;">
														<tr>
															<td class="pad" style="vertical-align: middle; color: #1e0e4b; font-family: 'Inter', sans-serif; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
																<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																	<tr>
																		<td class="alignment" style="vertical-align: middle; text-align: center;"><!--[if vml]><table align="center" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
																			<!--[if !vml]><!-->
																			<table class="icons-inner" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;" cellpadding="0" cellspacing="0" role="presentation"><!--<![endif]-->
																				
																			</table>
																		</td>
																	</tr>
																</table>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table><!-- End -->
</body>

</html>
    `
	}

	try {
		await sgMail.send(mailOptions);
		console.log("Email sent successfully");

		return res.json({
			status: "success",
			message: "Order placed successfully"
		});

	} catch (error) {
		console.error("Email sending error:", error);
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
		subject: "Retainership",
		html: `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
  <title></title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet"
    type="text/css">
  <link href="https://fonts.googleapis.com/css2?family=Oxygen:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet"
    type="text/css"><!--<![endif]-->
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
    }

    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: inherit !important;
    }

    #MessageViewBody a {
      color: inherit;
      text-decoration: none;
    }

    p {
      line-height: inherit
    }

    .desktop_hide,
    .desktop_hide table {
      mso-hide: all;
      display: none;
      max-height: 0px;
      overflow: hidden;
    }

    .image_block img+div {
      display: none;
    }

    @media (max-width:640px) {

      .desktop_hide table.icons-inner,
      .social_block.desktop_hide .social-table {
        display: inline-block !important;
      }

      .icons-inner {
        text-align: center;
      }

      .icons-inner td {
        margin: 0 auto;
      }

      .mobile_hide {
        display: none;
      }

      .row-content {
        width: 100% !important;
      }

      .stack .column {
        width: 100%;
        display: block;
      }

      .mobile_hide {
        min-height: 0;
        max-height: 0;
        max-width: 0;
        overflow: hidden;
        font-size: 0px;
      }

      .desktop_hide,
      .desktop_hide table {
        display: table !important;
        max-height: none !important;
      }
    }
  </style>
</head>

<body style="background-color: #DFDFDF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
  <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #DFDFDF;">
    <tbody>
      <tr>
        <td>
          <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #3c5d98; color: #000000; background-size: auto; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                <div class="alignment" align="center" style="line-height:10px">
                                  <div style="max-width: 279px;"><img
                                      src="https://elonatech.com.ng/static/media/elonatech.c6083e7d06b4cbab7d90.png"
                                      style="display: block; height: auto; border: 0; width: 100%;" width="279"
                                      height="auto"></div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #3c5d98; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad" style="padding-left:60px;padding-right:60px;">
                                <div
                                  style="color:#FFFFFF;font-family:'Oswald','Lucida Sans Unicode','Lucida Grande',sans-serif;font-size:14px;line-height:180%;text-align:center;mso-line-height-alt:25.2px;">
                                  <p style="margin: 0; word-break: break-word;"><br></p>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <table class="heading_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h2
                                  style="margin: 0; color: #f5f5f5; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 30px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 36px;">
                                  <span class="tinyMce-placeholder">Retainership</span></h2>
                              </td>
                            </tr>
                          </table>
                          <table class="image_block mobile_hide block-3" width="100%" border="0" cellpadding="10"
                            cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="center" style="line-height:10px">
                                  <div style="max-width: 64px;"><img
                                      src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/smile.png"
                                      style="display: block; height: auto; border: 0; width: 100%;" width="64"
                                      alt="Image" title="Image" height="auto"></div>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <div class="spacer_block block-4 mobile_hide"
                            style="height:125px;line-height:125px;font-size:1px;">&#8202;</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F5F5F5; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #F5F5F5; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="center">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="divider_inner"
                                        style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
                                        <span>&#8202;</span></td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="left">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="divider_inner"
                                        style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
                                        <span>&#8202;</span></td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F5F5F5; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #F5F5F5; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="center">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="divider_inner"
                                        style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
                                        <span>&#8202;</span></td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="left">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="divider_inner"
                                        style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
                                        <span>&#8202;</span></td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-7" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Fullname:&nbsp;&nbsp;</span></h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${fullname}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-8" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Email:&nbsp;&nbsp;</span></h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${email}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-9" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Company:&nbsp;&nbsp;</span></h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${company}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-10" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Phone:&nbsp;&nbsp;</span></h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${number}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-11" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Service:&nbsp;&nbsp;</span></h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${service}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-12" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Contract:&nbsp;&nbsp;</span></h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${contract}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-13" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Frequency:&nbsp;&nbsp;</span></h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${frequency}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-14" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Days:&nbsp;&nbsp;</span></h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${days}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-15" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">State:&nbsp;&nbsp;</span></h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${state}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-16" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Address:&nbsp;&nbsp;</span></h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${address}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-17" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 17px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 20.4px;">
                                  <span class="tinyMce-placeholder">Others: </span></h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 21.6px; color: #555555; line-height: 1.8;">
                                    <div
                                      style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 25.2px;">
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-18" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 20px; padding-right: 20px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="left">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="divider_inner"
                                        style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
                                        <span>&#8202;</span></td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-19" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F0F0F0; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #11253d; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 15px; padding-top: 15px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="social_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="center">
                                  <table class="social-table" width="180px" border="0" cellpadding="0" cellspacing="0"
                                    role="presentation"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;">
                                    <tr>
                                      <!-- Facebook -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.facebook.com/elonatech" target="_blank"><img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/facebook@2x.png"
                                            width="32" height="auto" alt="Facebook" title="facebook"
                                            style="display: block; height: auto; border: 0;">
                                        </a>
                                      </td>
                                      <!-- Instagram -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.instagram.com/elonatech" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/instagram@2x.png"
                                            width="32" height="auto" alt="Instagram" title="instagram"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                      <!-- Threads -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.threads.com/@elonatech" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/threads@2x.png"
                                            width="32" height="auto" alt="Threads" title="threads"
                                            style="display: block; height: auto; border: 0;">
                                        </a>
                                      </td>
                                      <!-- Tiktok -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.tiktok.com/@.elonatech" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/tiktok@2x.png"
                                            width="32" height="auto" alt="Tiktok" title="tiktok"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                      <!-- Twitter -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.twitter.com/elonatech" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/twitter@2x.png"
                                            width="32" height="auto" alt="Twitter" title="twitter"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                      <!-- Linkedin -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.linkedin.com/company/elonatech/" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/linkedin@2x.png"
                                            width="32" height="auto" alt="Linkedin" title="linkedin"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                      <!-- Pinterest -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.pinterest.com/Elonatechnig/" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/pinterest@2x.png"
                                            width="32" height="auto" alt="Pinterest" title="pinterest"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                      <!-- YouTube -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.youtube.com/elonatech" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/youtube@2x.png"
                                            width="32" height="auto" alt="YouTube" title="YouTube"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <table class="paragraph_block block-2" width="100%" border="0" cellpadding="10"
                            cellspacing="0" role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div
                                  style="color:#555555;font-family:Oxygen, Trebuchet MS, Helvetica, sans-serif;font-size:12px;font-weight:400;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
                                  <p style="margin: 0; word-break: break-word;">
                                    <span style="color: #ffffff;"><strong>Elonatech Nigeria Limited ©&nbsp; ${new
				Date().getFullYear()} All rights reserved</strong>
                                    </span>
                                  </p>
                                  <p style="margin: 0; word-break: break-word;">&nbsp;</p>
                                  <span style="color: #ffffff;">You can view our privacy policy </span>
                                  <span style="color: #c13b3b;"><a href="http://www.elonatech.com.ng/policy"
                                      target="_blank" rel="noopener"
                                      style="text-decoration: underline; color: #56B500;">here</a>.
                                  </span>
                                  <p style="margin-top: 10px;">This email was sent to <a href="mailto:${email}"
                                      style="text-decoration: underline; color: #3b75c1;">${email}</a> because you
                                    signed up for one of our services</p>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-20" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: center;">
                            <tr>
                              <td class="pad"
                                style="vertical-align: middle; color: #1e0e4b; font-family: 'Inter', sans-serif; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                                <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="alignment" style="vertical-align: middle; text-align: center;">
                                      <!--[if vml]><table align="center" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                      <!--[if !vml]><!-->
                                      <table class="icons-inner"
                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;"
                                        cellpadding="0" cellspacing="0" role="presentation"><!--<![endif]-->

                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table><!-- End -->
</body>

</html>	`
	}

	try {
		await sgMail.send(mailOptions);
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
			subject: "Book Session",
			html: `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
  <title></title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet"
    type="text/css">
  <link href="https://fonts.googleapis.com/css2?family=Oxygen:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet"
    type="text/css"><!--<![endif]-->
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
    }

    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: inherit !important;
    }

    #MessageViewBody a {
      color: inherit;
      text-decoration: none;
    }

    p {
      line-height: inherit
    }

    .desktop_hide,
    .desktop_hide table {
      mso-hide: all;
      display: none;
      max-height: 0px;
      overflow: hidden;
    }

    .image_block img+div {
      display: none;
    }

    @media (max-width:640px) {

      .desktop_hide table.icons-inner,
      .social_block.desktop_hide .social-table {
        display: inline-block !important;
      }

      .icons-inner {
        text-align: center;
      }

      .icons-inner td {
        margin: 0 auto;
      }

      .mobile_hide {
        display: none;
      }

      .row-content {
        width: 100% !important;
      }

      .stack .column {
        width: 100%;
        display: block;
      }

      .mobile_hide {
        min-height: 0;
        max-height: 0;
        max-width: 0;
        overflow: hidden;
        font-size: 0px;
      }

      .desktop_hide,
      .desktop_hide table {
        display: table !important;
        max-height: none !important;
      }
    }
  </style>
</head>

<body style="background-color: #DFDFDF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
  <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #DFDFDF;">
    <tbody>
      <tr>
        <td>
          <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #3c5d98; color: #000000; background-size: auto; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                <div class="alignment" align="center" style="line-height:10px">
                                  <div style="max-width: 279px;"><img
                                      src="https://elonatech.com.ng/static/media/elonatech.c6083e7d06b4cbab7d90.png"
                                      style="display: block; height: auto; border: 0; width: 100%;" width="279"
                                      height="auto"></div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #3c5d98; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad" style="padding-left:60px;padding-right:60px;">
                                <div
                                  style="color:#FFFFFF;font-family:'Oswald','Lucida Sans Unicode','Lucida Grande',sans-serif;font-size:14px;line-height:180%;text-align:center;mso-line-height-alt:25.2px;">
                                  <p style="margin: 0; word-break: break-word;"><br></p>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <table class="heading_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h2
                                  style="margin: 0; color: #f5f5f5; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 30px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 36px;">
                                  <span class="tinyMce-placeholder">Session</span>
                                </h2>
                              </td>
                            </tr>
                          </table>
                          <table class="image_block mobile_hide block-3" width="100%" border="0" cellpadding="10"
                            cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="center" style="line-height:10px">
                                  <div style="max-width: 64px;"><img
                                      src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/smile.png"
                                      style="display: block; height: auto; border: 0; width: 100%;" width="64"
                                      alt="Image" title="Image" height="auto"></div>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <div class="spacer_block block-4 mobile_hide"
                            style="height:125px;line-height:125px;font-size:1px;">&#8202;</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F5F5F5; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #F5F5F5; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="center">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="divider_inner"
                                        style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
                                        <span>&#8202;</span>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="left">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="divider_inner"
                                        style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
                                        <span>&#8202;</span>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F5F5F5; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #F5F5F5; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="center">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="divider_inner"
                                        style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
                                        <span>&#8202;</span>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="left">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="divider_inner"
                                        style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
                                        <span>&#8202;</span>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-7" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Fullname:&nbsp;&nbsp;</span>
                                </h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${name}</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-8" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Email:&nbsp;&nbsp;</span>
                                </h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${email}</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-9" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Phone:&nbsp;&nbsp;</span>
                                </h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${phone}</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          <table class="row row-10" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Meeting Platform:&nbsp;&nbsp;</span>
                                </h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${online}</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-13" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Meeting ID:&nbsp;&nbsp;</span>
                                </h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${meet}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-12" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Meeting Time:&nbsp;&nbsp;</span>
                                </h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${hour} : ${minute} : ${gmt}</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-11" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Meeting Date:&nbsp;&nbsp;</span>
                                </h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${date}</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          <table class="row row-12" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Address:&nbsp;&nbsp;</span>
                                </h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${address}</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-13" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat; background-size: auto;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dfdfdf; background-size: auto; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <h3
                                  style="margin: 0; color: #000000; direction: ltr; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 19.2px;">
                                  <span class="tinyMce-placeholder">Discuss:&nbsp;&nbsp;</span>
                                </h3>
                              </td>
                            </tr>
                          </table>
                          <table class="text_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class
                                    style="font-size: 12px; font-family: Oxygen, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
                                      ${discuss}&nbsp;</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          <table class="row row-15" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 20px; padding-right: 20px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="left">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="divider_inner"
                                        style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;">
                                        <span>&#8202;</span>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-16" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F0F0F0; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/121/groovepaper_1.png'); background-position: top center; background-repeat: repeat;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #11253d; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 15px; padding-top: 15px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="social_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0"
                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="pad">
                                <div class="alignment" align="center">
                                  <table class="social-table" width="180px" border="0" cellpadding="0" cellspacing="0"
                                    role="presentation"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;">
                                    <tr>
                                      <!-- Facebook -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.facebook.com/elonatech" target="_blank"><img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/facebook@2x.png"
                                            width="32" height="auto" alt="Facebook" title="facebook"
                                            style="display: block; height: auto; border: 0;">
                                        </a>
                                      </td>
                                      <!-- Instagram -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.instagram.com/elonatech" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/instagram@2x.png"
                                            width="32" height="auto" alt="Instagram" title="instagram"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                      <!-- Threads -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.threads.com/@elonatech" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/threads@2x.png"
                                            width="32" height="auto" alt="Threads" title="threads"
                                            style="display: block; height: auto; border: 0;">
                                        </a>
                                      </td>
                                      <!-- Tiktok -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.tiktok.com/@.elonatech" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/tiktok@2x.png"
                                            width="32" height="auto" alt="Tiktok" title="tiktok"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                      <!-- Twitter -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.twitter.com/elonatech" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/twitter@2x.png"
                                            width="32" height="auto" alt="Twitter" title="twitter"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                      <!-- Linkedin -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.linkedin.com/company/elonatech/" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/linkedin@2x.png"
                                            width="32" height="auto" alt="Linkedin" title="linkedin"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                      <!-- Pinterest -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.pinterest.com/Elonatechnig/" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/pinterest@2x.png"
                                            width="32" height="auto" alt="Pinterest" title="pinterest"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                      <!-- YouTube -->
                                      <td style="padding:0 2px 0 2px;">
                                        <a href="https://www.youtube.com/elonatech" target="_blank">
                                          <img
                                            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/youtube@2x.png"
                                            width="32" height="auto" alt="YouTube" title="YouTube"
                                            style="display: block; height: auto; border: 0;"></a>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <table class="paragraph_block block-2" width="100%" border="0" cellpadding="10"
                            cellspacing="0" role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td class="pad">
                                <div
                                  style="color:#555555;font-family:Oxygen, Trebuchet MS, Helvetica, sans-serif;font-size:12px;font-weight:400;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
                                  <p style="margin: 0; word-break: break-word;">
                                    <span style="color: #ffffff;"><strong>Elonatech Nigeria Limited ©&nbsp; ${new
					Date().getFullYear()} All rights reserved</strong>
                                    </span>
                                  </p>
                                  <p style="margin: 0; word-break: break-word;">&nbsp;</p>
                                  <span style="color: #ffffff;">You can view our privacy policy </span>
                                  <span style="color: #c13b3b;"><a href="http://www.elonatech.com.ng/policy"
                                      target="_blank" rel="noopener"
                                      style="text-decoration: underline; color: #56B500;">here</a>.
                                  </span>
                                  <p style="margin-top: 10px;">This email was sent to <a href="mailto:${email}"
                                      style="text-decoration: underline; color: #3b75c1;">${email}</a> because you
                                    signed up for one of our services</p>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row row-17" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation"
                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 620px; margin: 0 auto;"
                    width="620">
                    <tbody>
                      <tr>
                        <td class="column column-1" width="100%"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: center;">
                            <tr>
                              <td class="pad"
                                style="vertical-align: middle; color: #1e0e4b; font-family: 'Inter', sans-serif; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                                <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="alignment" style="vertical-align: middle; text-align: center;">
                                      <!--[if vml]><table align="center" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                      <!--[if !vml]><!-->
                                      <table class="icons-inner"
                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;"
                                        cellpadding="0" cellspacing="0" role="presentation"><!--<![endif]-->

                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table><!-- End -->
</body>

</html>`
		}
		try {
			await sgMail.send(mailOptions);
			console.log("Email sent successfully");
		} catch (error) {
			console.error("Error sending email:", error);
		}

		return res.json({
			status: "success",
			message: "Session booked successfully"
		});

	} catch (error) {
		console.error("Email sending error:", error);
		return res.status(500).json({
			status: "error",
			message: "Failed to send email"
		});
	}

}


module.exports = { jobEmail, quoteEmail, consultEmail, contactEmail, checkoutEmail, retainerEmail, sessionEmail, reasonContactEmail }