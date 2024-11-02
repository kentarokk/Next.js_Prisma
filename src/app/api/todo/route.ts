import { PrismaClient } from "@prisma/client";
import { log } from "console";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const connect = async () => {
  try {
    prisma.$connect();
  } catch (error) {
    console.log(error);

    return Error("Error connecting to database");
  }
};

export const GET = async (req: Request) => {
  try {
    const todos = await prisma.todo.findMany();

    return NextResponse.json({ todos }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Error fetching todos" },
      { status: 500 }
    );
  } finally {
    prisma.$disconnect();
  }
};

export const POST = async (req: Request, res: NextResponse) => {
  const req_body = await req.json();
  const title = req_body.title;

  try {
    await connect();
    const todo = await prisma.todo.create({
      data: {
        title: title,
      },
    });

    return NextResponse.json({ message: "post successfully" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error creating todo" }, { status: 500 });
  } finally {
    prisma.$disconnect();
  }
};
