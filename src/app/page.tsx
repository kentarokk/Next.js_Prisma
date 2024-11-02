import { revalidatePath } from "next/cache";

const getTodoList = async () => {
  const res = await fetch("http://localhost:3000/api/todo");
  const json = await res.json();
  return json.todos;
};

const addPost = async (formData: FormData) => {
  "use server";
  const text: FormDataEntryValue | null = formData.get("text");
  if (!text) return;

  const res = await fetch("http://localhost:3000/api/todo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: text,
    }),
  });
  revalidatePath("/");
};

type todo = {
  id: number;
  title: string;
  created_at: Date;
};

export default async function Home() {
  const todoList = await getTodoList();

  return (
    <main>
      <h1>Next.js + TypeScript + Prisma + supabase</h1>

      {todoList.map((todo: todo) => (
        <div key={todo.id}>
          <h2>{todo.title}</h2>
        </div>
      ))}

      <form action={addPost}>
        <input type="text" name="text" placeholder="New task..." />
        <button>Add Task</button>
      </form>
    </main>
  );
}
