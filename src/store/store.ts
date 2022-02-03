class SdkStore {
  private static localStorageSDK(name:string, key?:string, del?:boolean) {
    if(name && key) localStorage.setItem(name, <string>key)
    if(name && !key && !del) return <string>localStorage.getItem(name)
    if(name && del) {
      localStorage.removeItem(name)
      return "success"
    }
    else return "error with localStorage def"
  }
  private static sessionSDK(name:string, key?:string, del?:boolean) {
    if(name && key) sessionStorage.setItem(name, <string>key)
    if(name && !key && !del) return <string>sessionStorage.getItem(name)
    if(name && del) {
      sessionStorage.removeItem(name)
      return "success"
    }
  }
  private static cookieSDK(name:string, key?:string, del?:boolean) {
    if(name && key) SdkStore.setCookie(name, <string>key)
    if(name && !key && !del) return SdkStore.getCookie(name)
    if(name && del) {
      SdkStore.setCookie(name, "", 0)
      return "success"
    }
  }
  private static setCookie(cName:string, cValue:string, exMins?:number) {
    let expires = "session"
    if(exMins || exMins === 0) {
      const d = new Date();
      d.setTime(d.getTime() + (exMins*60*1000));
      expires = "expires="+d.toUTCString();
    }
    document.cookie = cName + "=" + cValue + ";" + expires + ";path=/";
  }
  private static getCookie(name:string) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
  }
  public init(typeStore:string, key:string, name:string):void {
    typeStore === "localStorage" ? SdkStore.localStorageSDK(name,key) : typeStore === "session" ? SdkStore.sessionSDK(name,key) : SdkStore.cookieSDK(name,key)
  }
  public searchOrDelStorage(name:string, del?:boolean) {
    let _v:string
    typeof localStorage.getItem(name) === "string"
      ? _v = <string>SdkStore.localStorageSDK(name, undefined, del)
      : typeof sessionStorage.getItem(name) === "string"
        ? _v = <string>SdkStore.sessionSDK(name, undefined, del)
        : _v = <string>SdkStore.cookieSDK(name, undefined, del)
    if(_v.includes("error")) throw new Error(_v)
    return _v
  }
}

export default SdkStore;