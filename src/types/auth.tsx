export interface UserToken {
    accessToken: string,
    refreshToken: string
}

export interface UserAuthenticateResponse {
    data: { token: UserToken }
}