const org = "gtn.id"

class SdkStore {
    private static localStorageSDK(name: string, key?: string, del?: boolean):void | string | boolean {
        if (name && key) localStorage.setItem(`${org}.${name}`, <string>key)
        if (name && !key && !del) return <string>localStorage.getItem(`${org}.${name}`)
        if (name && del) {
            localStorage.removeItem(`${org}.${name}`)
            return true
        }
    }

    private static sessionSDK(name: string, key?: string, del?: boolean):void | string | boolean {
        if (name && key) sessionStorage.setItem(`${org}.${name}`, <string>key)
        if (name && !key && !del) return <string>sessionStorage.getItem(`${org}.${name}`)
        if (name && del) {
            sessionStorage.removeItem(`${org}.${name}`)
            return true
        }
    }

    private static cookieSDK(name: string, key?: string, del?: boolean):void | string | boolean {
        if (name && key) SdkStore.setCookie(`${org}.${name}`, <string>key)
        if (name && !key && !del) return SdkStore.getCookie(`${org}.${name}`)
        if (name && del) {
            SdkStore.setCookie(`${org}.${name}`, "", 0)
            return true
        }
    }

    private static setCookie(cName: string, cValue: string, exMins?: number) {
        let expires = "session"
        if (exMins || exMins === 0) {
            const d = new Date();
            d.setTime(d.getTime() + (exMins * 1000));
            expires = "expires=" + d.toUTCString();
        }
        document.cookie = `${cName}=${cValue};${expires};path=/`
    }

    private static getCookie(name: string) {
        const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
        if (match) return match[2];
    }

    public init(typeStore: string, key: string, name: string): void {
        if(typeStore === "localStorage") {
            SdkStore.localStorageSDK(name, key)
        } else if(typeStore === "session") {
            SdkStore.sessionSDK(name, key)
        } else {
            SdkStore.cookieSDK(name, key)
        }
    }

    public searchOrDelStorage(name: string, del?: boolean) {
        let _v: string | boolean
        if(typeof localStorage.getItem(`${org}.${name}`) === "string") {
            _v = <string | boolean>SdkStore.localStorageSDK(name, undefined, del)
        } else if(typeof sessionStorage.getItem(`${org}.${name}`) === "string") {
            _v = <string | boolean>SdkStore.sessionSDK(name, undefined, del)
        } else {
            _v = <string | boolean>SdkStore.cookieSDK(name, undefined, del)
        }
        if (typeof _v === "string" && _v.includes("error")) throw new Error(_v)
        return _v
    }
}

export default SdkStore;