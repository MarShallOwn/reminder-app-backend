export const DATABASE_URI: string = process.env.DATABASE_AUTHENTICATION === "true" ? `mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOSTNAME}:${process.env.DATABASE_PORT}` : `mongodb://${process.env.DATABASE_HOSTNAME}:${process.env.DATABASE_PORT}`