export const authConfig = {
    jwt: {
        secret: String(process.env.JWT_SECRET || "erro"),
        expiresIn: String(process.env.JWT_EXPIRATION || "1d")
    }
}