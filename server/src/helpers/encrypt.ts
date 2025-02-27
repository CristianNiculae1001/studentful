import { createCipheriv, randomBytes } from "crypto";

export const encrypt = (password: string) => {
    const iv = Buffer.from(randomBytes(16));
    // iv : initialization vector
    const cipher = createCipheriv(
      "aes-256-gcm",
      Buffer.from(process.env.ENCRYPT_KEY!),
      iv
    );
    const encpass = Buffer.concat([cipher.update(password), cipher.final()]);
    return {
      iv: iv.toString("hex"),
      password: encpass.toString("hex"),
      tag: cipher.getAuthTag().toString("hex"),
    };
};