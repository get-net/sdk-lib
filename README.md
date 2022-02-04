# Gen-Net SDK-lib
### Version: 1.1.3

## 1)How to use?
#### Npm install
`npm install @gtn.ee/sdk-lib-ts`
#### Import library in your project
`import GetNetSdk from "@gtn.ee/sdk-lib-ts";`
#### Init class
`const sdk = GetNetSdk(config)`
#### Example config
##### *Config* - конфиг является обязательным параметром.
`const config = {
    baseUrl: "https://test.id.gtn.ee",
    redirectUrl: "http://localhost:8080",
    clientId: <Your ID>
    store: <choice your storage>
}`
#### Required options
`baseUrl - На данный момент, нужно указывать "https://test.id.gtn.ee". (required parameter)`
####
`redirectUrl - URL на который произойдет редирект после аутентификации. (required parameter)`
####
`clientId - ID, который вы получили при регистрации вашего приложения. (required parameter)`
####
`store - Хранилище, где вы хотите хранить свои ключи, на выбор есть 3 опции(options).`
####Options - localStorage, session, cookie. (required parameter)
## 2)Oauth
### For this method config is required parameter!
`const config = {...}`
#####
`const sdk = new GetNetSdk(config)`
#####
`sdk.oauth()`
#### Этот метод ничего не возвращает. 
####При вызове его произойдет аутентификация и редирект на URL который вы указали в config.
#### Затем в выбранном вами хранилище появятся ключи.
## 3)Get Access token
#### `!!!Warn:` Для корректной работы данного метода нужно пройти аутентификацию. 
#### Также при инициализации класса необязательно передавать в него конфиг. 
`const sdk = new GetNetSdk()`
#####
`const token = sdk.getToken()`
#####
`console.log(token)`
#### Метод вернет access token. *string*
## 4)Get Refresh token
#### `!!!Warn:` Для корректной работы данного метода нужно пройти аутентификацию.
#### Также при инициализации класса необязательно передавать в него конфиг.
`const sdk = new GetNetSdk()`
#####
`const token = sdk.getRefreshToken()`
#####
`console.log(token)`
#### Метод вернет refresh token. *string*
## 5)Refresh old tokens
#### `!!!Warn:` Для корректной работы данного метода нужно пройти аутентификацию.
#### Также при инициализации класса необязательно передавать в него конфиг.
`const sdk = new GetNetSdk()`
#####
`const token = sdk.refreshToken(<clientId>)`
#### Метод ничего не возвращает, обновляет ключи в вашем хранилище. (`clientid` - required parameter)
## 6)Get UserInfo
#### `!!!Warn:` Для корректной работы данного метода нужно пройти аутентификацию.
#### Также при инициализации класса необязательно передавать в него конфиг.
`const sdk = new GetNetSdk()`
#####
`const userInfo = sdk.getUserInfo()`
#### `userInfo` - возвращает объект в котором содержатся данные пользователя.

