import { NextRequest, NextResponse } from "next/server"
import https from "node:https"
import { URL } from "node:url"

export const runtime = "nodejs"

const insecureTlsAgent = new https.Agent({
  rejectUnauthorized: false,
})

type UpstreamResponse = {
  status: number
  body: string
}

function postJsonToUpstream(urlString: string, payload: unknown): Promise<UpstreamResponse> {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString)
    const body = JSON.stringify(payload)

    const request = https.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || 443,
        path: `${url.pathname}${url.search}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
        agent: insecureTlsAgent,
      },
      (response) => {
        let raw = ""
        response.setEncoding("utf8")
        response.on("data", (chunk) => {
          raw += chunk
        })
        response.on("end", () => {
          resolve({
            status: response.statusCode || 500,
            body: raw,
          })
        })
      },
    )

    request.on("error", reject)
    request.write(body)
    request.end()
  })
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const backendBaseUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/+$/, "")

    if (!backendBaseUrl) {
      return NextResponse.json(
        { success: false, message: "Backend URL is not configured" },
        { status: 500 },
      )
    }

    const upstreamUrl = `${backendBaseUrl}/orders`

    const upstreamResponse = await postJsonToUpstream(upstreamUrl, payload)
    const rawBody = upstreamResponse.body
    let data: any = null

    try {
      data = rawBody ? JSON.parse(rawBody) : null
    } catch {
      data = {
        success: false,
          message: rawBody || `Upstream request failed with status ${upstreamResponse.status}`,
      }
    }

    return NextResponse.json(data, { status: upstreamResponse.status })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to process order request",
      },
      { status: 502 },
    )
  }
}