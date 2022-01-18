/**
 * gatherResponse awaits and returns a response body as a string.
 * Use await gatherResponse(..) in an async function to get the response body
 * @param {Response} response
 */
 async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json())
  }
  else if (contentType.includes("application/text")) {
    return response.text()
  }
  else if (contentType.includes("text/html")) {
    return response.text()
  }
  else {
    return response.text()
  }
}

async function handleRequest(request) {
  let reqHeader = {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  }

  let url = new URL(request.url)
  const { search } = url

  let apiUrl = "";
  let isMarketStack = search.indexOf("symbols");
  let queryData = search.replace("?","");
  queryData = queryData.replace("%40","?");
  if(isMarketStack <= 0){
   //Should be Crypto
   apiUrl = "https://deep-index.moralis.io/api/v2/erc20/"+queryData+"/price?chain=eth";
   reqHeader = {
     headers: {
       "content-type": "application/json;charset=UTF-8",
       "X-API-Key": MORALIS_APPKEY
     },
   }
  }else{
   apiUrl = "http://api.marketstack.com/v1/eod/"+queryData+"&access_key="+MARKETSTACK_API_TOKEN+"&limit=1";
  }


  // return new Response(apiUrl, reqHeader)
  const response = await fetch(apiUrl, reqHeader)
  const results = await gatherResponse(response)
  return new Response(results, reqHeader)
}

addEventListener("fetch", event => {
  return event.respondWith(handleRequest(event.request))
})
