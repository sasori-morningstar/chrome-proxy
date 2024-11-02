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
    chrome.contextMenus.create({
        id: "setProxy2",
        title: "Set Proxy 02",
        contexts: ["action"]
    })
    chrome.contextMenus.create({
        id: "disableProxy",
        title: "Disable Proxy",
        contexts: ["action"]
    })
})

function setProxy(proxyConfig){
    chrome.proxy.settings.set(
        {
            value: proxyConfig,
            scope: "regular"
        }, function() {
            if (chrome.runtime.lastError) {
                console.log("Error setting proxy:", chrome.runtime.lastError);
                showNotification("Error", "Failed to set proxy.");
            } else {
                console.log("Proxy set:", proxyConfig);
            }
        }
    )
}
/*function saveCredentials(proxyUser, proxyPass) {
    chrome.storage.local.set({ proxyUser, proxyPass }, function() {
        console.log("Credentials saved.");
    });
}
function getCredentials(callback) {
    chrome.storage.local.get(["proxyUser", "proxyPass"], function(result) {
        if (chrome.runtime.lastError) {
            console.log("Error retrieving credentials:", chrome.runtime.lastError);
            callback(null, null); 
        } else {
            callback(result.proxyUser, result.proxyPass);
        }
    });
}*/


let username=null
let password=null
chrome.contextMenus.onClicked.addListener((info, tab)=>{
    let proxyConfig;
    if(info.menuItemId==="setProxy"){
        proxyConfig = {
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
        password="package-10001-country-fr-sessionid-01k4ahfe-sessionlength-3600"
        username="AcpVQtYstcLT4Q7d"
        //saveCredentials("package-10001-country-fr-sessionid-01k4ahfe-sessionlength-3600", "AcpVQtYstcLT4Q7d")
        setProxy(proxyConfig)
        showNotification("Chrome's Proxy", `Proxy set to  ${proxyConfig.rules.singleProxy.host}:${proxyConfig.rules.singleProxy.port}`)
    }else if(info.menuItemId==="setProxy2"){
        proxyConfig = {
            mode: "fixed_servers",
            rules: {
                singleProxy: {
                    scheme: "http",
                    host: "rotating.proxyempire.io",
                    port: 9009,
                },
                bypassList: ["localhost"]
            }
        }
        password="wifi;gb;;;"
        username="AcpVQtYstcLT4Q7d"
        //saveCredentials("wifi;gb;;;", "AcpVQtYstcLT4Q7d")
        setProxy(proxyConfig)
        showNotification("Chrome's Proxy", `Proxy set to  ${proxyConfig.rules.singleProxy.host}:${proxyConfig.rules.singleProxy.port}`)
    }else if(info.menuItemId==="disableProxy"){
        username=null
        password=null
        //saveCredentials(null, null)
        proxyConfig = {
            mode: "direct"
        }
        setProxy(proxyConfig)
        showNotification("Chrome's Proxy", "Proxy disabled")
    }
})

chrome.webRequest.onAuthRequired.addListener(
    function(details) {
        if(username&&password){
            return {
                authCredentials: {
                    username: username,
                    password: password
                }
            };
        }else{
             console.log("No credentials found.")
             return {}
        }
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);
chrome.proxy.onProxyError.addListener((error)=>{
        console.log(error)
    }
)