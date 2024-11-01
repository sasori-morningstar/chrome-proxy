function showNotification(title, message){
    chrome.notifications.create({
        type: "basic",
        iconUrl: "icon48.png",
        title: title,
        message: message
    })
}

chrome.runtime.onInstalled.addListener(() => {
    console.log("Chrome's Proxy extension installed successfully :)")

    chrome.contextMenus.create({
        id: "setProxy",
        title: "Set Proxy",
        contexts: ["action"]
    })
})

function setProxy(proxyConfig){
    chrome.proxy.settings.set(
        {
            value: proxyConfig,
            scope: "regular"
        }, function() {
            console.log("Proxy set:", proxyConfig)
        }
    )
}


chrome.contextMenus.onClicked.addListener((info, tab)=>{
    if(info.menuItemId==="setProxy"){
        const proxyConfig = {
            mode: "fixed_servers",
            rules: {
                singleProxy: {
                    scheme: "http",
                    host: "rotating.proxyempire.io",
                    port: 5000
                },
                bypassList: ["localhost"]
            }
        }
        setProxy(proxyConfig)
        showNotification("Chrome's Proxy", `Proxy set to  ${proxyConfig.rules.singleProxy.host}:${proxyConfig.rules.singleProxy.port}`)
    }
})
/*chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
    if(request.type === "authRequired"){
        const username = "package-10001-country-fr-sessionid-01k4ahfe-sessionlength-3600"
        const password = "AcpVQtYstcLT4Q7d"
        sendResponse({
            authCredentials: {
                username: username,
                password: password
            }
        })
    }
})*/
const username = "package-10001-country-fr-sessionid-01k4ahfe-sessionlength-3600"
const password = "AcpVQtYstcLT4Q7d"
chrome.webRequest.onAuthRequired.addListener(
    function(details) {
        return {
            authCredentials: {
                username: username,
                password: password
            }
        };
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);
chrome.proxy.onProxyError.addListener((error)=>{
        console.log(error)
    }
)