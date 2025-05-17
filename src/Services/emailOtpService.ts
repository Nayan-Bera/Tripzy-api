import { NextFunction, Response } from 'express';
import nodemailer from 'nodemailer';
import { config } from '../config';
import generateRandomDigit from '../utils/generaterandomDigit';
import db from '../db';
import { emailOtp } from '../db/schema';

const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: Number(config.SMTP_PORT),
    secure: config.SMTP_SRC == 'true',
    auth: {
        user: config.SMTP_MAIL,
        pass: config.SMTP_PASSWORD,
    },
});

const emailOtpService = async (
    { id, email }: { id: any; email: string },
    res: Response,
    next: NextFunction,
) => {
    try {
        // generate otp
        const createOTP = generateRandomDigit(100000, 900000);

        // sent mail

        let sentEmail = {
            from: config.SMTP_MAIL,
            to: email,
            subject: 'Verify OTP - My Dear Property',
            html: `
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>MyDearProperty Verify OTP</title>
		<style>
			body {
				font-family: Arial, sans-serif;
				background-color: #f5f5f5;
				margin: 0;
				padding: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 100vh;
			}
			.main-container {
				padding: 50px;
				max-width: 600px;
				text-align: start;
			}
			.container {
				background-color: #fff;
				padding: 20px;
				text-align: start;
				margin-bottom: 30px;
			}
			.logo img {
				width: 180px;
				height: 75px;
			}

			.facode {
				font-size: 32px;
				font-weight: bold;
				color: #0e0b0b;
				margin: 20px 0;
			}
			.code {
				font-size: 20px;
				font-weight: bold;
				color: #156d40;
				margin: 20px 0;
				background-color: #f5f5f5;
				padding: 15px;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
			.code span {
				margin-right: 10px;
			}
			.note {
				font-size: 14px;
				color: #080808;
				margin-bottom: 20px;
			}
			.footer {
				font-size: 14px;
				color: #080808;
				padding: 0 25px;
			}
			.footer a {
				color: #080808;
				text-decoration: none;
			}
			.copy-tooltip {
				display: none;
				position: absolute;
				background-color: #333;
				color: white;
				padding: 5px 10px;
				border-radius: 4px;
				font-size: 12px;
				margin-left: 30px;
			}
			.link {
				color: #080808;
			}
			.link:hover {
				color: #156d40;
			}
			@media (max-width: 600px) {
				.container {
					padding: 15px;
				}
				.logo {
					font-size: 20px;
				}
				.code {
					font-size: 28px;
				}
				.note {
					font-size: 12px;
				}
				.footer {
					font-size: 10px;
				}
			}
		</style>
	</head>
	<body>
		<div class="main-container">
			<div class="container">
				<div class="logo">
					<img
						src="http://search-your-dream-minio-5ef0b0-157-173-219-77.traefik.me/website-assets/main-green.png"
						alt="Logo" title="Logo" style="display:block" width="200" height="87"
					/>
				</div>
				<div class="facode">Verify OTP</div>
				<div class="note">Here is your verification code.</div>
				<div class="code">
					<span id="otpCode">${createOTP}</span>
				</div>
				<div class="note">
					Please make sure you never share this code with anyone.
				</div>
				<div class="note">
					<b>Note</b> : The code will expire in 1 Hour.
				</div>
			</div>
			<div class="footer">
				<p>
					You have received the email because you are registered at
					<a class="link" href="https://mydearproperty.com/"
						>mydearproperty.com</a
					>, to ensure the implementation
				</p>
				<a class="link" href="https://mydearproperty.com/privacy"
					>Privacy Policy</a
				><br /><br />
				© 2025 MyDearProperty
			</div>
		</div>
	</body>
</html>`,
        };

        try {
            const val = await db
                .insert(emailOtp)
                .values({
                    user_id: id,
                    otp: createOTP.toString(),
                    generatedAt: Date.now().toString(),
                    expiresAt: (Date.now() + 3600000).toString(),
                })
                .returning();
        } catch (error) {}

		transporter.sendMail(sentEmail, (err, info) => {
            if (err) {
                console.error("Email sending failed:", err);
                return res.status(500).json({ msg: 'Server is busy, try again later' });
            }

        
            return res.status(200).json({
                msg: 'OTP sent successfully',
            });
        });
    } catch (err) {
        return next(err);
    }
};

export default emailOtpService;
