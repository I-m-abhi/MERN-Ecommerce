import crypto from "crypto";

const resettoken = crypto.randomBytes(20).toString("hex");

console.log (resettoken);

const resetPasswordToken = crypto.createHash("sha256")

console.log   (resetPasswordToken); 