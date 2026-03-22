export type MessageSender = "client" | "farmer";

export type ThreadMessage = {
  id: number;
  sender: MessageSender;
  text: string;
  date: string;
};

export type MessageThread = {
  id: number;
  farmId: number;
  productName: string;
  status: "new" | "answered";
  messages: ThreadMessage[];
};

const THREADS_KEY = "plonbli_threads";

function notifyThreadsUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("threadsUpdated"));
    window.dispatchEvent(new Event("messagesUpdated"));
  }
}

export function getThreads(): MessageThread[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(THREADS_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch {
    return [];
  }
}

export function saveThreads(threads: MessageThread[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
  notifyThreadsUpdated();
}

export function createThread({
  farmId,
  productName,
  text,
  sender,
}: {
  farmId: number;
  productName: string;
  text: string;
  sender: MessageSender;
}) {
  const threads = getThreads();

  const newThread: MessageThread = {
    id: Date.now(),
    farmId,
    productName,
    status: "new",
    messages: [
      {
        id: Date.now() + 1,
        sender,
        text,
        date: new Date().toLocaleString("pl-PL"),
      },
    ],
  };

  const updatedThreads = [newThread, ...threads];
  saveThreads(updatedThreads);

  return newThread;
}

export function replyToThread({
  threadId,
  text,
  sender,
}: {
  threadId: number;
  text: string;
  sender: MessageSender;
}) {
  const threads = getThreads();

  const updatedThreads = threads.map((thread) => {
    if (thread.id !== threadId) return thread;

    return {
      ...thread,
      status: sender === "farmer" ? "answered" : thread.status,
      messages: [
        ...thread.messages,
        {
          id: Date.now(),
          sender,
          text,
          date: new Date().toLocaleString("pl-PL"),
        },
      ],
    };
  });

  saveThreads(updatedThreads);
}

export function getThreadById(threadId: number) {
  const threads = getThreads();
  return threads.find((thread) => thread.id === threadId) ?? null;
}