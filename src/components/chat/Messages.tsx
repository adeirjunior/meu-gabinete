"use client";

import { pusherClient } from "@/lib/configs/pusherClient";
import { FC, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Message, User, UserRole } from "@prisma/client";
import { CldImage } from "next-cloudinary";
import { Card, ScrollShadow } from "@nextui-org/react";
import { AspectRatio } from "../ui/aspect-ratio";

export interface MessagesProps {
  initialMessages: Message[];
  roomId: string;
  sessionUser: {
    id: string;
    name: string;
    username: string;
    email: string;
    image: string;
    stripeCustomerId: string;
    role: UserRole;
  };
  chatPartner: User;
}

const Messages: FC<MessagesProps> = ({
  initialMessages,
  roomId,
  sessionUser,
  chatPartner,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    pusherClient.subscribe(roomId);

    const messageHandler = (message: Message) => {
      setMessages((prev) => [message, ...prev]);
    };

    pusherClient.bind("incoming-message", messageHandler);

    return () => {
      pusherClient.unsubscribe(roomId);
      pusherClient.unbind("incoming-message", messageHandler);
    };
  }, [roomId]);

  const scrollDownRef = useRef<HTMLDivElement | null>(null);

  const formatTimestamp = (timestamp?: Date) => {
    if (!timestamp) {
      return format(new Date(), "HH:mm");
    }
    return format(timestamp, "HH:mm");
  };

  return (
    <ScrollShadow
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 overflow-y-auto p-3"
    >
      <div ref={scrollDownRef} />

      {messages.map((message, index) => {
        const isCurrentUser = message.userId === sessionUser.id;
        const isDifferenttUser = message.userId === chatPartner.id;

        const hasNextMessageFromSameUser =
          messages[index - 1]?.userId === messages[index].userId;

        return (
          <div
            className="chat-message"
            key={`${message.id}-${message.createdAt}`}
          >
            <div
              className={cn("flex items-end", {
                "justify-end": isCurrentUser,
              })}
            >
              <div
                className={cn(
                  "mx-2 flex max-w-xs flex-col space-y-2 text-base",
                  {
                    "order-1 items-end": isCurrentUser,
                    "order-2 items-start": !isCurrentUser,
                  },
                )}
              >
                <Card
                  className={cn("inline-block space-y-2 rounded-lg px-4 py-2", {
                    "bg-indigo-600 text-white": isCurrentUser,
                    "bg-gray-200 text-gray-900": !isCurrentUser,
                    "rounded-br-none":
                      !hasNextMessageFromSameUser && isCurrentUser,
                    "rounded-bl-none":
                      !hasNextMessageFromSameUser && !isCurrentUser,
                  })}
                >
                  <span>
                    {message.text}{" "}
                    {message.file && (
                      <CldImage
                        src={message.file}
                        width={250}
                        height={250}
                        className="rounded-md"
                        alt=""
                      />
                    )}
                    <span
                      className={cn("ml-2 text-xs text-gray-400", {
                        "mt-2 block w-full text-right": message.file,
                      })}
                    >
                      {formatTimestamp(message.createdAt)}
                    </span>
                  </span>
                </Card>
              </div>

              <div
                className={cn("relative h-6 w-6", {
                  "order-2": isCurrentUser,
                  "order-1": !isCurrentUser,
                  invisible: hasNextMessageFromSameUser,
                })}
              >
                <AspectRatio
                  className="grid place-content-center overflow-hidden rounded-full"
                  ratio={1 / 1}
                >
                  <CldImage
                    src={
                      isDifferenttUser ? chatPartner.image : sessionUser.image
                    }
                    width={50}
                    height={50}
                    alt="Profile picture"
                  />
                </AspectRatio>
              </div>
            </div>
          </div>
        );
      })}
    </ScrollShadow>
  );
};

export default Messages;
