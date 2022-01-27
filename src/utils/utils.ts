interface Icustom {
  [key: string]: string;
}

interface Ipkcekeys {
  def_key: string;
  sha256_key: string;
}

class EncodePKCE {
  protected defKey: string;
  constructor() {
    this.defKey = '';
  }
  private sha256(message: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    return window.crypto.subtle.digest('SHA-256', data);
  }
  private toCharCodes(arr: Uint8Array) {
    const validChars = '._-~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return arr.map((x) => validChars.charCodeAt(x % validChars.length));
  }
  private urlEncodeBase64(input: string) {
    const chars: Icustom = { '+': '-', '/': '_', '=': '' };
    return input.replace(/[\+\/=]/g, (m) => chars[m]);
  }
  private randomStr(len: number) {
    const arr = new Uint8Array(len);
    window.crypto.getRandomValues(arr);
    this.defKey = String.fromCharCode(...this.toCharCodes(arr));
    return this.defKey;
  }
  private bufferToBase64UrlEncoded(input: ArrayBuffer) {
    const bytes = new Uint8Array(input);
    return this.urlEncodeBase64(window.btoa(String.fromCharCode(...bytes)));
  }
  public async getCryptoCodes(num: number): Promise<Ipkcekeys> {
    try {
      const shaBuffer = await this.sha256(this.randomStr(num));
      const encoded = this.bufferToBase64UrlEncoded(shaBuffer);
      return {
        sha256_key: encoded,
        def_key: this.defKey,
      };
    } catch (e) {
      throw e;
    }
  }
  public parseQueryString():string | null {
    const params = (new URL(document.location.href)).searchParams
    const saveCode = params.get("code")
    window.history.pushState({}, document.title, window.location.pathname);
    return saveCode
  }
}

export default EncodePKCE;
