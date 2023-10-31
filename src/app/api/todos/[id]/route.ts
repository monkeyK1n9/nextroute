import { NextResponse } from "next/server";

const DATA_SOURCE: string = "https://jsonplaceholder.typicode.com/todos";

type Props = {
    params: {
        id: string
    }
}

export async function GET(request: Request, {params: {id}}: Props) {
    // to get the id, we can use this to extract from the url localhost:port/todos/id
    // const id = request.url.slice(request.url.lastIndexOf("/") + 1);

    //or we can take from the params object passed in as props above

    const response = await fetch(`${DATA_SOURCE}/${id}`);

    const todo: Todo = await response.json();

    if (!todo.id) return NextResponse.json({ message: "Invalid todo id" })

    return NextResponse.json(todo);
}