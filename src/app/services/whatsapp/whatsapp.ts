import axios from 'axios';
import Agent from '@entities/Workspace';
import { BadRequest, NotFound } from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { formatToWhatsAppNumber } from '@utils/formats';
import { InternalServerError } from '@utils/http/errors/internal-errors';
// Session as workspaceId

const secret = process.env.SECRET;

export async function sendMessage(
  session: string,
  token: string,
  phone: string,
  message: string,
) {
  try {
    const data = {
      phone: formatToWhatsAppNumber(phone),
      message,
      isGroup: false,
      isNewsletter: false,
      options: null,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.post(
      `${process.env.WPP_CONNECT_URL}/api/${session}/send-message`,
      data,
      config,
    );
    return response.status;
  } catch (error: any) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError('Erro ao enviar mensagem');
  }
}

export async function generateToken(session_id: string): Promise<any> {
  try {
    if (!session_id) {
      throw new BadRequest('Session ID não informado');
    }

    const response = await axios.post(
      `${process.env.WPP_CONNECT_URL}/api/${session_id}/${secret}/generate-token`,
    );

    const data = response.data;

    return data;
  } catch (error: any) {
    console.log(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError('Erro ao gerar token');
  }
}

export async function startSession(session_id: string) {
  try {
    const data = {
      session: `${session_id}`,
      waitQrCode: true,
    };

    const { token, session } = await generateToken(session_id);

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.post(
      `${process.env.WPP_CONNECT_URL}/api/${session_id}/start-session`,
      data,
      { headers },
    );

    const qrCode = response.data;

    return { qr_code: qrCode.qrcode, token, session };
  } catch (error) {
    console.log(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError('Erro ao iniciar a sessão.');
  }
}

export async function getConnection(
  session_id: string,
  session_token: string,
): Promise<string> {
  try {
    if (!session_id || !session_token) {
      throw new BadRequest('Valores inválidos para getConnection');
    }

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session_token}`,
    };

    console.log(headers);
    console.log(session_id, session_token);
    const response = await axios.get(
      `${process.env.WPP_CONNECT_URL}/api/${session_id}/status-session`,
      { headers },
    );

    const {
      data: { status },
    } = response;

    return status;
  } catch (error) {
    console.log(error);
    return 'DISCONNECTED';
  }
}
