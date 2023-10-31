import { NextResponse } from "next/server";

const DATA_SOURCE: string = "https://jsonplaceholder.typicode.com/todos";
const API_KEY: string = process.env.DATA_API_KEY as string;

export async function GET(request: Request) {
    const id = request.url.slice(request.url.lastIndexOf("/") + 1);

    const response = await fetch(`${DATA_SOURCE}/${id}`);

    const todo: Todo = await response.json();

    if (!todo.id) return NextResponse.json({ message: "Invalid todo id" })

    return NextResponse.json(todo);
}