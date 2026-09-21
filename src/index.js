import bootstrap from "./app.bootstrap.js";
import { sendEmail } from "./DB/services/send_email.js";

bootstrap()
// sendEmail({
//   to: "nouramohamed01097690991@gmail.com",
//   subject: "hello ",
//   html: " <h1>hello from saraha app</h1>",
//   attachments: [
//     {
//       filename: "image.png",
//       path: "./uploads/users/1788705454465_668027726_p5.jpg",
//     },
//   ],
// });