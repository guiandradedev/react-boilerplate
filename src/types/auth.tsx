import type { User } from "@/contexts/AuthContext"
import type { ResponseAdapter } from "./api"

export interface UserToken {
    access_token: string,
    refresh_token: string
}

export interface UserAuthenticateResponse {
    data: ResponseAdapter<User> & { token: UserToken }
}