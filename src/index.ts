import axios from "axios";
import EncodePKCE from './utils/utils';

interface IobjectData {
  def_key: string;
  sha256_key: string;
}
interface Iconfig {
    redirectUrl: string,
    clientId: string,
    url: string,
}

window.onload = () => {
    if(window.location.href.includes("code")) {
      const id = localStorage.getItem("client_state")
      const copy = new GetNetSdk(undefined)
      localStorage.removeItem("client_state")
      copy.saveToken(<string>helperFn().parseQueryString(), <string>id)
    }
}

const helperFn = () => new EncodePKCE()

class GetNetSdk {
  readonly config:Iconfig | undefined

  constructor(config?:Iconfig) {
    this.config = config
  }

  private async create_code_verifier(): Promise<IobjectData> {
    const num:number = Math.floor(Math.random() * 127) + 43
    return helperFn().getCryptoCodes(num);
  }

  public async oauth(): Promise<void> {
      if(!this.config) {
          return new Promise((res,rej) => {
              rej("error")
          })
      }

      const req = await this.create_code_verifier()

      localStorage.setItem("pkce_code_verifier", req.def_key);
      localStorage.setItem("client_state", this.config.clientId)

      window.location.href = `${this.config.url}`
          +`?client_id=${this.config.clientId}`
          +`&response_type=code`
          +`&code_challenge=${req.sha256_key}`
          +`&code_challenge_method=s256`
          +`&redirect_uri=${this.config.redirectUrl}`
  }

  public async saveToken(code:string, id:string):Promise<void> {
    if(typeof code === "object" || typeof id === "object") {
      throw new Error("Error with code auth")
    }
    if(localStorage.getItem("pkce_code_verifier")) {
      const params = new URLSearchParams()

      params.append("grant_type", "authorization_code")
      params.append("client_id", id)
      params.append("code", code)
      params.append("code_verifier", <string>localStorage.getItem("pkce_code_verifier"))

      await axios.post(`https://test.id.gtn.ee/oauth/v3/token`
        ,params,{
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
      }).then((data) => {
        if(data.data.access_token) {
          localStorage.removeItem("pkce_code_verifier")
          localStorage.setItem("access_token", data.data.access_token)
          localStorage.setItem("refresh_token", data.data.refresh_token)
        } else {
          throw new Error("Problems with access_token")
        }
      })
    } else {
      throw new Error("Problems with localStorage")
    }
  }
  public getToken():string {
    if(localStorage.getItem("access_token")) return <string>localStorage.getItem("access_token")
    else throw new Error("nothing to returned")
  }
  public getRefreshToken():string {
    if(localStorage.getItem("refresh_token")) return <string>localStorage.getItem("refresh_token")
    else throw new Error("nothing to returned")
  }
  public async getUserInfo():Promise<any> {
    if(localStorage.getItem("access_token")) {
      const config = {
        headers: {Authorization: `Bearer ${localStorage.getItem("access_token")}`}
      }
      const data = await axios.get("https://test.id.gtn.ee/oauth/userinfo/", config)
      return data.data
    }
  }
  public async refreshToken(id:string):Promise<void> {
    if(localStorage.getItem("refresh_token")) {
      const params = new URLSearchParams()

      params.append("grant_type", "refresh_token")
      params.append("client_id", id)
      params.append("refresh_token", <string>localStorage.getItem("refresh_token"))

      await axios.post("https://test.id.gtn.ee/oauth/token", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
      }).then(data => {
        if(data.data.success) {
          localStorage.setItem("access_token", data.data.result.access_token)
          localStorage.setItem("refresh_token", data.data.result.refresh_token)
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
