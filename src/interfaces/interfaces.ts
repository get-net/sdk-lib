interface Iconfig {
    redirectUrl: string,
    clientId: string,
    baseUrl: string,
    store: "localStorage" | "session" | "cookie"
}

interface Icustom {
    [key: string]: string;
}

interface Ipkcekeys {
    def_key: string;
    sha256_key: string;
}

export {Iconfig, Icustom, Ipkcekeys}
