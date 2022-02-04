import axios from "axios";
import EncodePKCE from './utils/utils';
import SdkStore from "./store/store";
import {Iconfig, Ipkcekeys} from "./interfaces/interfaces";

window.onload = () => {
    if (window.location.href.includes("code")) {
        const id = instSdkStore().searchOrDelStorage("client_state")
        const copy = new GetNetSdk(undefined)
        instSdkStore().searchOrDelStorage("client_state", true)
        copy.saveToken(<string>helperFnUtils().parseQueryString(), <string>id)
    }
}

const helperFnUtils = () => new EncodePKCE()
const instSdkStore = () => new SdkStore()

class GetNetSdk {
    readonly config: Iconfig | undefined

    constructor(config?: Iconfig) {
        this.config = config
    }

    private static async create_code_verifier(): Promise<Ipkcekeys> {
        const num: number = Math.floor(Math.random() * 127) + 43
        return helperFnUtils().getCryptoCodes(num);
    }

    public async oauth(): Promise<void> {
        if (!this.config) {
            return new Promise((res, rej) => {
                rej("error")
            })
        }

        const req = await GetNetSdk.create_code_verifier()

        instSdkStore().init(this.config.store, req.def_key, "pkce_code_verifier")
        instSdkStore().init(this.config.store, this.config.clientId, "client_state")
        instSdkStore().init(this.config.store, this.config.store, "state")
        instSdkStore().init(this.config.store, this.config.baseUrl, "config_url")


        const searchParams = new URLSearchParams()
        searchParams.append("client_id", this.config.clientId)
        searchParams.append("response_type", "code")
        searchParams.append("code_challenge", req.sha256_key)
        searchParams.append("code_challenge_method", "s256")
        searchParams.append("redirect_uri", this.config.redirectUrl)

        window.location.href = `${this.config.baseUrl}/oauth/v3/authorize?${searchParams.toString()}`
    }

    public async saveToken(code: string, id: string): Promise<void> {
        const verCode = instSdkStore().searchOrDelStorage("pkce_code_verifier")
        if (typeof code === "object" || typeof id === "object") {
            throw new Error("Error with code auth")
        }
        if (verCode) {
            const params = new URLSearchParams()
            const url = instSdkStore().searchOrDelStorage("config_url")

            params.append("grant_type", "authorization_code")
            params.append("client_id", id)
            params.append("code", code)
            params.append("code_verifier", <string>verCode)

            await axios.post(`${url}/oauth/v3/token`
                , params, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                    }
                }).then((data) => {
                if (data.data.access_token) {
                    const state = instSdkStore().searchOrDelStorage("state")
                    instSdkStore().searchOrDelStorage("pkce_code_verifier", true)
                    instSdkStore().init(<string>state, data.data.access_token, "access_token")
                    instSdkStore().init(<string>state, data.data.refresh_token, "refresh_token")
                } else {
                    throw new Error("Problems with access_token")
                }
            })
        } else {
            throw new Error("Problems with localStorage")
        }
    }

    public getToken(): string {
        const tk = instSdkStore().searchOrDelStorage("access_token")
        if (tk) return <string>tk
        else throw new Error("nothing to returned")
    }

    public getRefreshToken(): string {
        const tk = instSdkStore().searchOrDelStorage("refresh_token")
        if (tk) return <string>tk
        else throw new Error("nothing to returned")
    }

    public async getUserInfo(): Promise<any> {
        const tk = instSdkStore().searchOrDelStorage("access_token")
        const url = instSdkStore().searchOrDelStorage("config_url")
        if (tk && url) {
            const config = {
                headers: {Authorization: `Bearer ${tk}`}
            }
            const data = await axios.get(`${url}/oauth/userinfo/`, config)
            return data.data
        }
    }

    public async refreshToken(id: string): Promise<void> {
        const refToken = instSdkStore().searchOrDelStorage("refresh_token")
        const url = instSdkStore().searchOrDelStorage("config_url")
        if (refToken) {
            const params = new URLSearchParams()

            params.append("grant_type", "refresh_token")
            params.append("client_id", id)
            params.append("refresh_token", <string>refToken)

            await axios.post(`${url}/oauth/token`, params, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                }
            }).then(data => {
                if (data.data.success) {
                    const state = instSdkStore().searchOrDelStorage("state")
                    instSdkStore().init(<string>state, data.data.result.access_token, "access_token")
                    instSdkStore().init(<string>state, data.data.result.refresh_token, "refresh_token")
                } else {
                    throw new Error("Problems with request")
                }
            })
        } else {
            throw new Error("Missing refresh token in localStorage")
        }
    }
}

export default GetNetSdk;
