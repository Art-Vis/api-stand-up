import { CLIENTS } from "../index.js";
import fs from "node:fs/promises";
import { sendData, sendError } from "./send.js";

export const handleUpdateClient = (req, res, segments) => {
  let body = "";
  const ticketNumber = segments[1];
  try {
    req.on('data', chunk => {
      body += chunk;
    });

  } catch (error) { 
    sendError(res, 500, "Ошибка сервера при чтении запроса");
  }

  req.on('end', async () => {

    try {
      const updateDataClient = JSON.parse(body);

      if (!updateDataClient.fullName) {
        sendError(res, 400, 'Заполните поле имя');
        return;
      }

      if (!updateDataClient.phone) {
        sendError(res, 400, 'Номер телефона не указан');
        return;
      }

      if (!updateDataClient.ticketNumber) {
        sendError(res, 400, 'Номер билета не указан');
        return;
      }

      if (
        !updateDataClient.booking || !updateDataClient.booking.length && (Array.isArray(updateDataClient.booking) ||
          !updateDataClient.booking.every(item => item.comedian && item.time))
      ) {
        sendError(res, 400, 'Неверно заполнены поля бронирования');
        return;
      }

      const clientData = await fs.readFile(CLIENTS, 'utf8');
      const clients = JSON.parse(clientData);

      const clientIndex = clients.findIndex(c => c.ticketNumber === ticketNumber);

      if (clientIndex === -1) {
        sendError(res, 404, 'Клиент c данным билетом не найден');
        return;
      }

      clients[clientIndex] = {
        ...clients[clientIndex],
        ...updateDataClient,
      };

      await fs.writeFile(CLIENTS, JSON.stringify(clients));
      sendData(res, clients[clientIndex]);
    } catch (error) {
      console.error(`error: ${error}`);
      sendError(res, 500, 'Ошибка сервера при обновлении данных');
    }

  });
}