const message_require: (string | undefined)[] = []
function iteratorToStream(iterator: any) {
    return new ReadableStream({
        async pull(controller) {
            const { value, done } = await iterator.next()

            if (done) {
                controller.close()
            } else {
                controller.enqueue(value)
            }
        },
    })
}

function sleep(time: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    })
}

export function sendMessage(message: string) {
    message_require.push(message)
}


const encoder = new TextEncoder()

async function* makeIterator() {
    while (true) {
        if (message_require.length != 0) {
            yield encoder.encode(message_require.pop())
        }
        await sleep(80)
    }
}

export async function GET() {
    const iterator = makeIterator()
    const stream = iteratorToStream(iterator)

    return new Response(stream)
}