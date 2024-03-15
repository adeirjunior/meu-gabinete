"use client"

import { Button, Card, Input } from "@nextui-org/react";
import { FC } from "react";

interface MessageFieldProps {
  roomId: string;
  userId: string;
}

const MessageField: FC<MessageFieldProps> = ({ roomId, userId }) => {
  const sendMessage = async (formData: FormData) => {
    const text = formData.get("message") as string;

   await fetch("/api/message", {
     method: "POST",
     body: JSON.stringify({ text, roomId, userId }),
   });
  };

  return (
    <form className="w-full" method="POST" action={sendMessage}>
      <Card className="flex w-full flex-row items-center justify-center gap-2 p-4">
        <Input
          name="message"
          radius="full"
          placeholder="Escreva sua mensagem"
          type="text"
        />
        <Button type="submit">Enviar</Button>
      </Card>
    </form>
  );
};

export default MessageField;
