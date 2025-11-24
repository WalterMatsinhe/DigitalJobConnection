const nodemailer = require('nodemailer')

// Configure your email service here
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your preferred email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

// Generate acceptance email template
const generateAcceptanceEmail = (candidateName, jobTitle, companyName, contactEmail, contactPhone) => {
  return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background-color: #2c3e50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { background-color: #2c3e50; color: white; padding: 15px; text-align: center; font-size: 12px; }
        .btn { display: inline-block; margin-top: 20px; padding: 12px 30px; background-color: #27ae60; color: white; text-decoration: none; border-radius: 5px; }
        .highlight { color: #27ae60; font-weight: bold; }
        h2 { color: #2c3e50; }
        p { line-height: 1.6; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Congratulations!</h1>
        </div>
        <div class="content">
            <h2>Dear ${candidateName},</h2>
            
            <p>We are delighted to inform you that your application for the position of <span class="highlight">${jobTitle}</span> at <span class="highlight">${companyName}</span> has been <span class="highlight">ACCEPTED</span>.</p>
            
            <p>Your skills and qualifications impressed us, and we believe you would be a great fit for our team. We are excited about the possibility of working with you.</p>
            
            <h3>Next Steps:</h3>
            <ul>
                <li>Please review the position details at your convenience</li>
                <li>Prepare any questions you may have about the role</li>
                <li>Contact our recruitment team to schedule an interview or discuss salary and benefits</li>
            </ul>
            
            <h3>Get in Touch:</h3>
            <p>
                <strong>Email:</strong> ${contactEmail}<br>
                <strong>Phone:</strong> ${contactPhone}
            </p>
            
            <p>We look forward to hearing from you soon.</p>
            
            <p>Best regards,<br>
            <strong>${companyName}</strong> Recruitment Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 ${companyName}. All rights reserved.</p>
            <p>This is an automated email. Please do not reply directly to this message.</p>
        </div>
    </div>
</body>
</html>
  `
}

// Generate rejection email template
const generateRejectionEmail = (candidateName, jobTitle, companyName, contactEmail, feedback = null) => {
  return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background-color: #2c3e50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { background-color: #2c3e50; color: white; padding: 15px; text-align: center; font-size: 12px; }
        .highlight { color: #e74c3c; font-weight: bold; }
        h2 { color: #2c3e50; }
        p { line-height: 1.6; }
        .feedback { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Application Status Update</h1>
        </div>
        <div class="content">
            <h2>Dear ${candidateName},</h2>
            
            <p>Thank you for your interest in the <span class="highlight">${jobTitle}</span> position at <span class="highlight">${companyName}</span>.</p>
            
            <p>After careful consideration of all applications received, we regret to inform you that we have decided not to move forward with your application at this time. This decision was made based on the specific requirements of the role and the qualifications of other candidates.</p>
            
            <p>We truly appreciate the time and effort you invested in your application. Your background and experience are valuable, and we encourage you to apply for other positions that match your skills in the future.</p>
            
            ${feedback ? `
            <div class="feedback">
                <h3>Feedback from our team:</h3>
                <p>${feedback}</p>
            </div>
            ` : ''}
            
            <h3>Stay Connected:</h3>
            <p>We would like to keep you updated about other opportunities at <strong>${companyName}</strong>. Feel free to reach out to us at <strong>${contactEmail}</strong> if you have any questions.</p>
            
            <p>We wish you the very best in your job search and future endeavors.</p>
            
            <p>Best regards,<br>
            <strong>${companyName}</strong> Recruitment Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 ${companyName}. All rights reserved.</p>
            <p>This is an automated email. Please do not reply directly to this message.</p>
        </div>
    </div>
</body>
</html>
  `
}

// Send acceptance email
const sendAcceptanceEmail = async (candidateEmail, candidateName, jobTitle, companyName, contactEmail, contactPhone) => {
  try {
    console.log(`📧 Sending acceptance email to ${candidateEmail}...`)
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: candidateEmail,
      subject: `🎉 Congratulations! Your Application for ${jobTitle} at ${companyName} Has Been Accepted`,
      html: generateAcceptanceEmail(candidateName, jobTitle, companyName, contactEmail, contactPhone)
    }
    
    const result = await transporter.sendMail(mailOptions)
    console.log(`✅ Acceptance email sent to ${candidateEmail}`)
    return result
  } catch (err) {
    console.error(`❌ Failed to send acceptance email to ${candidateEmail}:`, err.message)
    throw err
  }
}

// Send rejection email
const sendRejectionEmail = async (candidateEmail, candidateName, jobTitle, companyName, contactEmail, feedback = null) => {
  try {
    console.log(`📧 Sending rejection email to ${candidateEmail}...`)
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: candidateEmail,
      subject: `Application Status: ${jobTitle} at ${companyName}`,
      html: generateRejectionEmail(candidateName, jobTitle, companyName, contactEmail, feedback)
    }
    
    const result = await transporter.sendMail(mailOptions)
    console.log(`✅ Rejection email sent to ${candidateEmail}`)
    return result
  } catch (err) {
    console.error(`❌ Failed to send rejection email to ${candidateEmail}:`, err.message)
    throw err
  }
}

module.exports = {
  sendAcceptanceEmail,
  sendRejectionEmail
}
