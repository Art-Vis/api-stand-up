import { CLIENTS } from "../index.js";
import { sendData, sendError } from "./send.js";
import fs from "node:fs/promises";

export const handleClientsRequest = async (req, res, ticketNumber) => {

try {
  const clientsData = await fs.readFile(CLIENTS, 'utf8');
  const clients = JSON.parse(clientsData);

  const client = clients.find(c => c.ticketNumber === ticketNumber);

  if (!client) {
    sendError(res, 404, 'Клиент с данным номером билета отсутcвует');
    return;
  }

  sendData(res, client);
  
} catch (error) {
  console.log(`Ошибка при обработке запроса ${error}`);
  sendError(res, 500, 'Оштбка сервера при обработке запроса клиента');
}
};