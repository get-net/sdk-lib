import axios from "axios";
import EncodePKCE from './utils/utils';
import SdkStore from "./store/store";

interface IobjectData {
  def_key: string;
  sha256_key: string;
}
interface Iconfig {
    redirectUrl: string,
    clientId: string,
    baseUrl: string,
    store: "localStorage" | "session" | "cookie"
}

window.onload = () => {
    if(window.location.href.includes("code")) {
      const id = instSdkStore().searchOrDelStorage("client_state")
      const copy = new GetNetSdk(undefined)
      instSdkStore().searchOrDelStorage("client_state", true)
      copy.saveToken(<string>helperFnUtils().parseQueryString(), <string>id)
    }
}

const helperFnUtils = () => new EncodePKCE()
const instSdkStore = () => new SdkStore()

class GetNetSdk {
  readonly config:Iconfig | undefined

  constructor(config?:Iconfig) {
    this.config = config
  }

  private async create_code_verifier(): Promise<IobjectData> {
    const num:number = Math.floor(Math.random() * 127) + 43
    return helperFnUtils().getCryptoCodes(num);
  }

  public async oauth(): Promise<void> {
      if(!this.config) {
          return new Promise((res,rej) => {
              rej("error")
          })
      }

      const req = await this.create_code_verifier()

      instSdkStore().init(this.config.store, req.def_key, "gtn.id.pkce_code_verifier")
      instSdkStore().init(this.config.store, this.config.clientId, "client_state")
      instSdkStore().init(this.config.store, this.config.store, "gtn.id.state")


      const searchParams = new URLSearchParams()
      searchParams.append("client_id", this.config.clientId)
      searchParams.append("response_type", "code")
      searchParams.append("code_challenge", req.sha256_key)
      searchParams.append("code_challenge_method", "s256")
      searchParams.append("redirect_uri", this.config.redirectUrl)

      window.location.href = `${this.config.baseUrl}?${searchParams.toString()}`
  }

  public async saveToken(code:string, id:string):Promise<void> {
    const verCode = instSdkStore().searchOrDelStorage("gtn.id.pkce_code_verifier")
    if(typeof code === "object" || typeof id === "object") {
      throw new Error("Error with code auth")
    }
    if(verCode) {
      const params = new URLSearchParams()

      params.append("grant_type", "authorization_code")
      params.append("client_id", id)
      params.append("code", code)
      params.append("code_verifier", verCode)

      await axios.post(`https://test.id.gtn.ee/oauth/v3/token`
        ,params,{
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
      }).then((data) => {
        if(data.data.access_token) {
          const state = instSdkStore().searchOrDelStorage("gtn.id.state")
          instSdkStore().searchOrDelStorage("gtn.id.pkce_code_verifier", true)
          instSdkStore().init(state, data.data.access_token, "gtn.id.access_token")
          instSdkStore().init(state, data.data.refresh_token, "gtn.id.refresh_token")
        } else {
          throw new Error("Problems with access_token")
        }
      })
    } else {
      throw new Error("Problems with localStorage")
    }
  }
  public getToken():string {
    const tk = instSdkStore().searchOrDelStorage("gtn.id.access_token")
    if(tk) return tk
    else throw new Error("nothing to returned")
  }
  public getRefreshToken():string {
    const tk = instSdkStore().searchOrDelStorage("gtn.id.refresh_token")
    if(tk) return tk
    else throw new Error("nothing to returned")
  }
  public async getUserInfo():Promise<any> {
    const tk = instSdkStore().searchOrDelStorage("gtn.id.access_token")
    if(tk) {
      const config = {
        headers: {Authorization: `Bearer ${tk}`}
      }
      const data = await axios.get("https://test.id.gtn.ee/oauth/userinfo/", config)
      return data.data
    }
  }
  public async refreshToken(id:string):Promise<void> {
    const refToken = instSdkStore().searchOrDelStorage("gtn.id.refresh_token")
    if(refToken) {
      const params = new URLSearchParams()

      params.append("grant_type", "refresh_token")
      params.append("client_id", id)
      params.append("refresh_token", refToken)

      await axios.post("https://test.id.gtn.ee/oauth/token", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
      }).then(data => {
        if(data.data.success) {
          const state = instSdkStore().searchOrDelStorage("gtn.id.state")
          instSdkStore().init(state, data.data.result.access_token, "gtn.id.access_token")
          instSdkStore().init(state, data.data.result.refresh_token, "gtn.id.refresh_token")
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
