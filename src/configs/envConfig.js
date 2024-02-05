module.exports = {
    apiHost: process.env.NEXT_PUBLIC_API_HOST,
    basePath: process.env.NEXT_PUBLIC_BASE_PATH,
    baseURL: process.env.NEXT_PUBLIC_API_HOST + process.env.NEXT_PUBLIC_BASE_PATH,
    imageHost: process.env.NEXT_PUBLIC_IMAGE_HOST,
    imagePath: process.env.NEXT_PUBLIC_IMAGE_PATH,
    imageBaseURL: process.env.NEXT_PUBLIC_IMAGE_HOST + process.env.NEXT_PUBLIC_IMAGE_PATH,
    socketHost: process.env.NEXT_PUBLIC_SOCKET_HOST,
    profileHost: process.env.NEXT_PUBLIC_PROFILE_HOST,
    apiTimeoutPerStock: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT_PER_STOCK, 10),
    authenticationTimeout: parseInt(process.env.NEXT_PUBLIC_AUTHENTICATION_TIMEOUT, 10),
    marketConditionEnable: process.env.NEXT_PUBLIC_ENABLE_MARKET_CONDITION === '1' ? true : false
}
