# Gen-Net SDK-lib
### Version: 1.1.3

##1)How to use?
####Npm install
`npm install @gtn.ee/sdk-lib-ts`
####Import library in your project
`import GetNetSdk from "@gtn.ee/sdk-lib-ts";`
####Init class
`const sdk = GetNetSdk(config)`
####Example config
#####*Config* is not a required parameter, but if you specified it, all 4 parameters must be filled in.
`const config = {
    baseUrl: "https://test.id.gtn.ee/oauth/v3/authorize",
    redirectUrl: "http://localhost:8080",
    clientId: <Your ID>
    store: <choice your storage>
}`
####Required options
`baseUrl - At the moment, this parameter must be taken from example config. (required parameter)`
####
`redirectUrl - The url where you want to redirect after authentication. (required parameter)`
####
`clientId - ID, that you received when creating the applocation. (required parameter)`
####
`store - At your choice, you can specify where to save your tokens. Options - localStorage, session, cookie. (required parameter)`
##2)Oauth
### For this method config is required parameter!
`const config = {...}`
#####
`const sdk = new GetNetSdk(config)`
#####
`sdk.oauth()`
#### This method does not return anything, after authentication it will return you to the specified URL. (*redirectUrl* in config)
#### And the storage you specified will store the keys for the further interaction.
##3)Get Access token
####`!!!Warn:` This method will not work if yoy are not authenticated. 
`const sdk = new GetNetSdk()`
#####
`const token = sdk.getToken()`
#####
`console.log(token)`
#### This method will return access token. *string*
##4)Get Refresh token
####`!!!Warn: `This method will not work if yoy are not authenticated.
`const sdk = new GetNetSdk()`
#####
`const token = sdk.getRefreshToken()`
#####
`console.log(token)`
#### This method will return refresh token. *string*
##5)Refresh old tokens
####`!!!Warn:` This method will not work if yoy are not authenticated.
`const sdk = new GetNetSdk()`
#####
`const token = sdk.refreshToken(<clientId>)`
#### This method returns nothing, it refreshes the stale tokens in your store. (`clientid` - required parameter)
##6)Get UserInfo
####`!!!Warn:` This method will not work if yoy are not authenticated.
`const sdk = new GetNetSdk()`
#####
`const userInfo = sdk.getUserInfo()`
####`userInfo` - object that contains the data of the authorized person

