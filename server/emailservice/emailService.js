import {
    VERIFICATION_EMAIL_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE
} from "./emailTemplate.js";
import transporter from "./nodemailerconfig.js";


// Send verification email
export const sendVerificationEmail = async (email, verificationToken) => {
	const mailOptions = {
		from: 'aadityarayyadav@gmail.com', // Sender address
		to: email, // Recipient address
		subject: "Verify your email", // Subject line
		html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken), // HTML body
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Verification email sent:", info.messageId);
	} catch (error) {
		console.error("Error sending verification email:", error);
		throw new Error("Error sending verification email");
	}
};

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
	const mailOptions = {
		from: 'aadityarayyadav@gmail.com', // Sender address
		to: email, // Recipient address
		subject: "Welcome to Our App!", // Subject line
		html: `
			<p>Hello ${name},</p>
			<p>Welcome to Auth Company! We're excited to have you on board.</p>
		`, // HTML body
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Welcome email sent:", info.messageId);
	} catch (error) {
		console.error("Error sending welcome email:", error);
		throw new Error("Error sending welcome email");
	}
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetURL) => {
	const mailOptions = {
		from: 'aadityarayyadav@gmail.com', // Sender address
		to: email, // Recipient address
		subject: "Reset your password", // Subject line
		html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL), // HTML body
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Password reset email sent:", info.messageId);
	} catch (error) {
		console.error("Error sending password reset email:", error);
		throw new Error("Error sending password reset email");
	}
};

// Send password reset success email
export const sendResetSuccessEmail = async (email) => {
	const mailOptions = {
		from: 'aadityarayyadav@gmail.com', // Sender address
		to: email, // Recipient address
		subject: "Password Reset Successful", // Subject line
		html: PASSWORD_RESET_SUCCESS_TEMPLATE, // HTML body
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Password reset success email sent:", info.messageId);
	} catch (error) {
		console.error("Error sending password reset success email:", error);
		throw new Error("Error sending password reset success email");
	}
};