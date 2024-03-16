import {sendMessage} from "../../stream/connect/route"
export async function POST(request: Request) {
    const res = await request.json()
    sendMessage(JSON.parse(JSON.stringify(res))["message"])
    return Response.json({ "answer": "sending" })
}