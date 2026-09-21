import nodemailer from "nodemailer";

export const sendEmail = async ({ to,
    subject= "hello",
    html= "<h1>hello from saraha app</h1>",
    attachments } = {}) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: {
         rejectedUnauthorized: false   
        },
      auth: {
        user: "nouramohamed01097690991@gmail.com",
        pass: "qfskllhhxsonofzt",
      },
    });

    try {
      const info = await transporter.sendMail({
          from: '"saraha team" <nouramohamed01097690991@gmail.com>',
          to ,
        subject ,
          html,
        attachments
      });

      
      
        console.log("Preview URL: %s", info.accepted);
        return info.accepted.length >0 ? true : false
    } catch (err) {
      console.error("Error while sending mail:", err);
    }
}
export const generateOtp = async () => {
    return Math.floor(Math.random() *900000) + 100000
}