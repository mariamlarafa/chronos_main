import ejs from "ejs";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "../environment.config.js";


export const transporter = nodemailer.createTransport({

    host: config.email_host,
    port: config.email_port,
    auth: {
        user: config.email_username,
        pass: config.email_password,
    },
    secure:false,
    tls: {
        rejectUnauthorized:config.email_use_tls
    }
});

export const send = ({ template, args, ...options }) =>
    new Promise((resolve, reject) => {
        ejs.renderFile(
            path.join(
                path.dirname(fileURLToPath(import.meta.url)),
                "templates",
                template + ".ejs"
            ),
            args || {},
            (err, html) => {
                if (err) {
                    console.log(err);
                    return reject(err);}
                const mailOptions = {
                    from: config.EMAIL_USERNAME,
                    html: html,
                    ...options,
                };
                transporter.sendMail(mailOptions).then(resolve).catch(reject);
            }
        );
    });
