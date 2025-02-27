import { createDecipheriv } from "crypto";

export const decrypt = (encpass: {
    iv: string;
    password: string;
    tag: string;
}) => {
    const decipher = createDecipheriv(
      "aes-256-gcm",
      Buffer.from(process.env.ENCRYPT_KEY!),
      Buffer.from(encpass.iv, "hex")
    );
    decipher.setAuthTag(Buffer.from(encpass.tag, "hex"));
    const decpass = Buffer.concat([
      decipher.update(Buffer.from(encpass.password, "hex")),
      decipher.final(),
    ]);
    return decpass.toString();
};