import wahaInstance from "./wahaInstance";

interface RequestSendWhatsappMessageArgs {
  targetNumber: string;
  text: string;
}

const requestSendWhatsappMessage = async ({ targetNumber, text }: RequestSendWhatsappMessageArgs) => {
    try {
        const { data } = await wahaInstance.post('/api/sendText', {
            chatId: `${targetNumber}@c.us`,
            text,
            session: "default"
        });   
        return { data };

    } catch (error) {
        throw new Error(error.message);
    }
}

export { requestSendWhatsappMessage };