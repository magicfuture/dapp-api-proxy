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
  const init = {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  }

  let url = new URL(request.url)
  const { search } = url

  let queryData = search.replace("?","");
  queryData = queryData.replace("%40","?");
  let apiUrl = "http://api.marketstack.com/v1/eod/"+queryData+"&access_key="+MARKETSTACK_API_TOKEN+"&limit=1";
  
  // return new Response(apiUrl, init)
  const response = await fetch(apiUrl, init)
  const results = await gatherResponse(response)
  return new Response(results, init)
}

addEventListener("fetch", event => {
  return event.respondWith(handleRequest(event.request))
})
