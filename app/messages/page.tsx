"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getThreads,
  replyToThread,
  type MessageSender,
  type MessageThread,
} from "../../lib/messages";

export default function MessagesPage() {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [currentRole, setCurrentRole] = useState<MessageSender>("client");

  function refreshThreads() {
    const loadedThreads = getThreads();
    setThreads(loadedThreads);

    if (loadedThreads.length === 0) {
      setSelectedThreadId(null);
      return;
    }

    setSelectedThreadId((prev) => {
      const stillExists = loadedThreads.some((thread) => thread.id === prev);
      return stillExists ? prev : loadedThreads[0].id;
    });
  }

  useEffect(() => {
    refreshThreads();

    const handleUpdate = () => refreshThreads();

    window.addEventListener("threadsUpdated", handleUpdate);
    window.addEventListener("messagesUpdated", handleUpdate);
    window.addEventListener("focus", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("threadsUpdated", handleUpdate);
      window.removeEventListener("messagesUpdated", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const selectedThread = useMemo(() => {
    return threads.find((thread) => thread.id === selectedThreadId) ?? null;
  }, [threads, selectedThreadId]);

  function handleSendReply() {
    if (!selectedThread) return;

    const trimmedText = replyText.trim();
    if (!trimmedText) return;

    replyToThread({
      threadId: selectedThread.id,
      text: trimmedText,
      sender: currentRole,
    });

    setReplyText("");
    refreshThreads();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 via-white to-stone-50 px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <div>
          <p className="text-sm font-medium text-green-700">Wiadomości</p>
          <h1 className="mt-2 text-4xl font-bold text-stone-900">
            Moje wiadomości
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
            Tutaj możesz wracać do rozmów o produktach i odpowiadać jako klient
            albo rolnik.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr]">
          <aside className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900">Rozmowy</h2>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                {threads.length}
              </span>
            </div>

            {threads.length === 0 ? (
              <div className="rounded-2xl bg-stone-50 p-5 text-sm text-stone-500">
                Nie masz jeszcze żadnych rozmów.
              </div>
            ) : (
              <div className="space-y-3">
                {threads.map((thread) => {
                  const lastMessage =
                    thread.messages[thread.messages.length - 1] ?? null;
                  const isActive = thread.id === selectedThreadId;

                  return (
                    <button
                      key={thread.id}
                      type="button"
                      onClick={() => setSelectedThreadId(thread.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        isActive
                          ? "border-green-300 bg-green-50"
                          : "border-stone-200 bg-white hover:bg-stone-50"
                      }`}
                    >
                      <p className="text-sm font-semibold text-green-700">
                        {thread.productName}
                      </p>

                      <p className="mt-1 text-xs text-stone-500">
                        Gospodarstwo ID: {thread.farmId}
                      </p>

                      {lastMessage && (
                        <>
                          <p className="mt-3 line-clamp-2 text-sm text-stone-700">
                            {lastMessage.text}
                          </p>
                          <p className="mt-2 text-xs text-stone-400">
                            {lastMessage.date}
                          </p>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </aside>

          <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            {!selectedThread ? (
              <div className="rounded-2xl bg-stone-50 p-8 text-center">
                <p className="text-lg font-semibold text-stone-800">
                  Wybierz rozmowę
                </p>
                <p className="mt-2 text-sm text-stone-500">
                  Gdy ktoś zapyta o produkt, rozmowa pojawi się tutaj.
                </p>
              </div>
            ) : (
              <>
                <div className="border-b border-stone-200 pb-4">
                  <p className="text-sm font-medium text-green-700">
                    Rozmowa o produkcie
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-stone-900">
                    {selectedThread.productName}
                  </h2>
                  <p className="mt-1 text-sm text-stone-500">
                    Gospodarstwo ID: {selectedThread.farmId}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium text-stone-600">
                    Odpowiadasz jako:
                  </span>

                  <button
                    type="button"
                    onClick={() => setCurrentRole("client")}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      currentRole === "client"
                        ? "bg-green-700 text-white"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    Klient
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentRole("farmer")}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      currentRole === "farmer"
                        ? "bg-green-700 text-white"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    Rolnik
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  {selectedThread.messages.map((message) => {
                    const isClient = message.sender === "client";

                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          isClient ? "justify-start" : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                            isClient
                              ? "bg-stone-100 text-stone-800"
                              : "bg-green-700 text-white"
                          }`}
                        >
                          <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
                            {isClient ? "Klient" : "Rolnik"}
                          </p>

                          <p className="mt-2 text-sm leading-6">
                            {message.text}
                          </p>

                          <p
                            className={`mt-3 text-xs ${
                              isClient ? "text-stone-500" : "text-green-100"
                            }`}
                          >
                            {message.date}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 border-t border-stone-200 pt-6">
                  <label className="block text-sm font-medium text-stone-700">
                    Odpowiedz
                  </label>

                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={
                      currentRole === "client"
                        ? "Napisz wiadomość do rolnika..."
                        : "Napisz odpowiedź do klienta..."
                    }
                    className="mt-3 h-28 w-full rounded-2xl border border-stone-300 p-4 text-sm outline-none transition focus:border-green-600"
                  />

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSendReply}
                      className="rounded-2xl bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
                    >
                      Wyślij odpowiedź
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}