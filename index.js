async function gatherResponse(response) {
 const { headers } = response
 const contentType = headers.get("content-type") || ""
 if (contentType.includes("application/json")) {
  return JSON.stringify(await response.json())
 }
}

async function handleRequest(request) {
 const init = {
  method: 'POST',
  headers: {
    "content-type": "application/json;charset=UTF-8",
  },
  body: {
    "apiKey": SERVER_API_KEY,
    "walletAddress": walletAddress,
    "walletEncryptionKey": walletEncryptionKey
  }
 }

 let url = new URL(request.url);
 const { search } = url;

 let data = await request.json()
 let walletAddress = data.walletAddress;
 let walletEncryptionKey = data.walletEncryptionKey;
 let functionName = data.functionName;
 
 let apiUrl = "https://dapp-locker-api.netlify.app/.netlify/functions/"+functionName;

 const response = await fetch(apiUrl, init)
 const results = await gatherResponse(response)
 return new Response(results, init)
}

addEventListener("fetch", event => {
 return event.respondWith(handleRequest(event.request))
})
