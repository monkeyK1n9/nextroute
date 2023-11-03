import { NextResponse } from "next/server";
import { limiter } from "../config/limiter";

const DATA_SOURCE: string = "https://jsonplaceholder.typicode.com/todos";
const API_KEY: string = process.env.DATA_API_KEY as string;

export async function GET(request: Request) {
    const response = await fetch(DATA_SOURCE);

    const origin = request.headers.get('origin');

    const todos: Todo[] = await response.json();

    /**
     * We use the limiter here to restrict the number of time the user can
     * get the resource from the server. This is a useful trick.
     * When the remaining tokens is negative we give a different response
     */
    const remainingTokens = await limiter.removeTokens(1)
    console.log("Remaining tokens: ", remainingTokens);

    if (remainingTokens < 0) {
        return new NextResponse(null, {
            status: 429,
            statusText: "You exceeded the limit",
            headers: {
                'Access-Control-Allow-Origin': origin || "*", //you could also obtain the origin from the request or any other like thunderclient. Since origin was validated in the middleware(see middleware file), we allow this response to the valid origin
                'Content-Type': "text/plain"
            }
        })
    }

    return NextResponse.json(todos);
}

export async function DELETE(request: Request) {
    const { id }: Partial<Todo> = await request.json();

    if (!id) return NextResponse.json({ message: 'Id is required' });

    await fetch(`${DATA_SOURCE}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'API-Key': API_KEY
        }
    });

    return NextResponse.json({ message: `Todo with id ${id} deleted successfully` });
}

export async function POST(request: Request) {
    const { userId, title }: Partial<Todo> = await request.json();

    if (!userId || !title) return NextResponse.json({ message: 'Missing required data' });

    const res = await fetch(`${DATA_SOURCE}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'API-Key': API_KEY
        },
        body: JSON.stringify({
            userId,
            title,
            completed: false
        })
    });

    const todo: Todo = await res.json();

    return NextResponse.json(todo);
}

export async function PUT(request: Request) {
    const { userId, id, title, completed }: Partial<Todo> = await request.json();

    if (!userId || !id || !title || typeof(completed) !== 'boolean') return NextResponse.json({ message: 'Missing required data' });

    const res = await fetch(`${DATA_SOURCE}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'API-Key': API_KEY
        },
        body: JSON.stringify({
            userId,
            title,
            completed
        })
    });

    const todo: Todo = await res.json();

    return NextResponse.json(todo);
}