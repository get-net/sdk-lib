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
      const copy = new CustomSdk(undefined)
      copy.getToken(helperFn().parseQueryString())
    }
}

const helperFn = () => new EncodePKCE()

class CustomSdk {
  readonly config:Iconfig | undefined

  constructor(config?:Iconfig) {
    this.config = config
  }

  private async create_code_verifier(): Promise<IobjectData> {
    const num:number = Math.floor(Math.random() * 127) + 43
    return helperFn().getCryptoCodes(num);
  }

  public async getCode(): Promise<string> {
      if(!this.config) {
          return new Promise((res,rej) => {
              rej("error")
          })
      }
      const req = await this.create_code_verifier()
      localStorage.setItem("pkce_code_verifier", req.def_key);
      window.location.href = `${this.config.url}`
          +`?client_id=${this.config.clientId}`
          +`&response_type=code`
          +`&code_challenge=${req.sha256_key}`
          +`&code_challenge_method=s256`
          +`&redirect_uri=${this.config.redirectUrl}`
      return new Promise((res,rej) => {
          res("good")
      })
  }

  public getToken(code:string | null):string {
    if(typeof code === null) {
      throw new Error("Error with code auth")
    }
    if(localStorage.getItem("pkce_code_verifier")) {
      console.log(code)
      const tk = axios.post(`https://test.id.gtn.ee/oauth/v3/token?code=${code}&code_verifier=${localStorage.getItem("pkce_code_verifier")}`)
      console.log(tk)
    }
    throw new Error("Problems with localStorage")
  }
}

export default CustomSdk;
