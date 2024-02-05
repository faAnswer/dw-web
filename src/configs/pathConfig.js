// common

export const getUserProfileLayout = () => `users/profile/layout`
export const updateUserProfileLayout = () => `users/profile/layout`
export const saveUserProfileLayout = () => `users/profile/layout`
export const fetchExcelChartFile = () => 'excel-chart-file'
export const fetchExcelTemplate = (type) => `excel-template/${type}`
export const uploadFile = (type) => `excel-file/${type}`
export const fetchUploadedExcelFileList = () => 'uploaded-excel-file'
export const deleteUploadedExcelFile = (fileName) => `uploaded-excel-file/${fileName}`
export const updateLoginLog = (userId) => `users/login-log/${userId}`
export const login = () => 'users/login'
export const updateProfilePermission = () => 'users/profile/permission'
export const fetchShareLink = () => '/users/share-link'
export const fetchShareLinkData = (sharedLinkId) => `users/share-link/${sharedLinkId}`
export const deleteProfile = (profileName) => `users/profile/${profileName}`
export const updateProfileName = (profileName) => `users/profile/name/${profileName}`

export const fetchInfo = () => 'info'
export const fetchAnalytic = () => 'analytics'
export const fetchTradeSchedue = () => 'trade-schedue'
export const fetchOptimizedParams = () => 'optimized-params'
export const fetchAdditionalParams = () => 'input-params'
export const fetchVolumeCurve = () => 'volume-curve'
export const fetchInputData = () => 'input-data'
// export const fetchSpreadCurve = () => 'spread-curve'
// export const fetchVolatilityCurve = () => 'volatility-curve'
// export const fetchCurrencyRate = () => 'ccy-rate'

export const fetchProfilePermissionValidation = () => 'users/profile/permission-validation'

export const createActionLoggerRecord = () => 'logger'
