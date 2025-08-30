import Contact from '@entities/Contact';
import { NotFound, Unauthorized } from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';

export default async function updateWorkspaceService(id: string, body: any) {
  const { name, phone }: Contact = body;

  try {
    const workspace = await Contact.findOne(id);

    if (!workspace) {
      throw new NotFound('Workspace não encontrado.');
    }

    const valuesToUpdate = {
      name: name || workspace.name,
      phone: phone || workspace.phone
    };

    await Contact.update(workspace.id, { ...valuesToUpdate });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError('Erro ao buscar atualizar o usuário.');
  }
}
