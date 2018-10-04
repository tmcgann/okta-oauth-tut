require('dotenv').config()
const request = require('request-promise')
const btoa = require('btoa')

const { ISSUER, CLIENT_ID, CLIENT_SECRET, SCOPE } = process.env

const [, , uri, method, body] = process.argv
if (!uri) {
    console.log('Usage: node client {uri} [{method}] [{jsonData}]')
    process.exit(1)
}

const getOAuthToken = async () => {
    const token = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
    return request({
        uri: `${ISSUER}/v1/token`,
        json: true,
        method: 'POST',
        headers: {
            authorization: `Basic ${token}`
        },
        form: {
            grant_type: 'client_credentials',
            scope: SCOPE
        }
    })
}

const sendAPIRequest = async () => {
    try {
        const auth = await getOAuthToken()

        const response = await request({
            uri,
            method,
            body,
            headers: {
                authorization: `${auth.token_type} ${auth.access_token}`
            }
        })

        console.log(response)
    } catch (error) {
        console.error(`Error: ${error.message}`)
    }
}

sendAPIRequest()
