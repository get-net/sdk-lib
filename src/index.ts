import EncodePKCE from './utils/utils';

interface IobjectData {
  def_key: string;
  sha256_key: string;
}

class CustomSdk {
  // protected url: string;
  // protected clientId: string;
  // protected redirectUrl: string;
  //
  // constructor(url: string, clientId: string, redirectUrl: string) {
  //   this.url = url;
  //   this.clientId = clientId;
  //   this.redirectUrl = redirectUrl;
  // }

  private create_code_verifier(): Promise<IobjectData> {
    const helper = new EncodePKCE();
    const num:number = Math.floor(Math.random() * 127) + 43
    return helper.getCodes(num);
  }
  //testing
  public xxx(): void {
    this.create_code_verifier()
        .then((data) => {
          if(data.def_key && data.sha256_key) {
            localStorage.setItem("pkce_code_verifier", data.def_key);
            return data
          }
        })
  }
}

export default CustomSdk;
