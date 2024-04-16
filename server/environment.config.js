import dotenv from "dotenv";

if (process.argv.includes("--prod")) {
  dotenv.config({ path: ".env" });
} else {
  dotenv.config({ path: ".env.dev" });
}




export const config = {
    env_dev: process.argv.includes("--prod"),
    port:process.env.PORT,
    salt_rounds_bcrypt:process.env.SALT_ROUNDS_BCRYPT,
    jwt_secret:process.env.JWT_SECRET,
    session_secret_key:process.env.SESSION_SECRET_KEY,
    force_db_sync:process.env.FORCE_DB_SYNC,
    alter_db_sync:process.env.ALTER_DB_SYNC,
    server_url:process.env.SERVER_URL,
    jwt_expires_in:process.env.JWT_EXPIRES_IN,
    service:process.env.SERVICE,
    email_host:process.env.EMAIL_HOST,
    email_port:process.env.EMAIL_PORT,
    email_username:process.env.EMAIL_USERNAME,
    email_password:process.env.EMAIL_PASSWORD,
    email_use_tls:process.env.EMAIL_USE_TLS,
    lms_host:process.env.LMS_HOST,
    verify_token_expires_in:process.env.VERIF_TOKEN_EXPIRES_IN,
    reset_password_token_expires_in:process.env.RESET_PASSWORD_TOKEN_EXPIRES_IN,
    reset_password_request_limit:process.env.RESET_PASSWORD_REQUEST_LIMIT,
    db_user:process.env.DB_USER,
    db_name:process.env.DB_NAME,
    db_password:process.env.DB_PASSWORd,
    file_limit_size : process.env.FILE_LIMIT_SIZE,
    db_log:process.env.DB_LOG ,
    admin_email :process.env.ADMIN_EMAIL,
    defaultPassword :process.env.DEFAULT_PASSWORD,
    db_host:process.env.DB_HOST,
    db_port:process.env.DB_PORT
}