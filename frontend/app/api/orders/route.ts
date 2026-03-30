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

import http from "node:http"

function requestUpstream(urlString: string, method: "GET" | "POST", payload?: unknown): Promise<UpstreamResponse> {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString)
    const body = method === "POST" ? JSON.stringify(payload ?? {}) : ""
    const isHttps = url.protocol === "https:"
    const reqModule = isHttps ? https : http

    const options: any = {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: `${url.pathname}${url.search}`,
        method,
        headers: {},
    }

    if (method === "POST") {
      options.headers["Content-Type"] = "application/json"
      options.headers["Content-Length"] = Buffer.byteLength(body)
    }

    if (isHttps) {
        options.agent = insecureTlsAgent
    }

    const request = reqModule.request(
      options,
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
    if (method === "POST") {
      request.write(body)
    }
    request.end()
  })
}

function parseUpstreamBody(upstreamResponse: UpstreamResponse) {
  const rawBody = upstreamResponse.body
  try {
    return rawBody ? JSON.parse(rawBody) : null
  } catch {
    return {
      success: false,
      message: rawBody || `Upstream request failed with status ${upstreamResponse.status}`,
    }
  }
}

function getOrdersEndpoint(backendBaseUrl: string) {
  const parsed = new URL(backendBaseUrl)
  const segments = parsed.pathname.split("/").filter(Boolean)
  const lastSegment = segments[segments.length - 1]?.toLowerCase() || ""
  const pathLooksApiScoped = lastSegment === "api" || lastSegment.endsWith("-api")

  return pathLooksApiScoped ? `${backendBaseUrl}/orders` : `${backendBaseUrl}/api/orders`
}

export async function GET(request: NextRequest) {
  try {
    const backendBaseUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "").replace(/\/+$/, "")

    if (!backendBaseUrl) {
      // Return empty orders list if backend not configured
      return NextResponse.json(
        { success: true, orders: [] },
        { status: 200 },
      )
    }

    const userEmail = request.nextUrl.searchParams.get("userEmail")
    const ordersEndpoint = getOrdersEndpoint(backendBaseUrl)
    const upstreamUrl = userEmail
      ? `${ordersEndpoint}?userEmail=${encodeURIComponent(userEmail)}`
      : ordersEndpoint

    const upstreamResponse = await requestUpstream(upstreamUrl, "GET")
    const data = parseUpstreamBody(upstreamResponse)

    if (upstreamResponse.status === 404 && userEmail) {
      return NextResponse.json({ success: true, orders: [] }, { status: 200 })
    }

    return NextResponse.json(data, { status: upstreamResponse.status })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to fetch orders",
      },
      { status: 502 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const backendBaseUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "").replace(/\/+$/, "")

    if (!backendBaseUrl) {
      return NextResponse.json(
        { success: false, message: "Backend API is not available. Please try again later." },
        { status: 503 },
      )
    }

    const upstreamUrl = getOrdersEndpoint(backendBaseUrl)

    const upstreamResponse = await requestUpstream(upstreamUrl, "POST", payload)
    const data = parseUpstreamBody(upstreamResponse)

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