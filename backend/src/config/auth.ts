export default {
  jwt: {
    secret: String(process.env.APP_SECRET) || 'default',
    expiresIn: '30d'
  }
}
