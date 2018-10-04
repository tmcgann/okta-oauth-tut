const OktaJwtVerifier = require('@okta/jwt-verifier')

const { ISSUER, SCOPE } = process.env

const oktaJwtVerifier = new OktaJwtVerifier({ issuer: ISSUER })

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers
    if (!authorization) throw new Error('You must send an Authorization header')

    const [authType, token] = authorization.trim().split(' ')
    if (authType !== 'Bearer') throw new Error('Expected a Bearer token')

    const { claims } = await oktaJwtVerifier.verifyAccessToken(token)
    if (!claims.scp.includes(SCOPE)) {
      throw new Error('Could not verify the proper scope')
    }
    next()
  } catch (error) {
    next(error.message)
  }
}
