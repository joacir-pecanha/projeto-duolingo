import { delay, mockDB } from './api';
import { AuthResponse } from '../types/auth';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    await delay(1200); // Simulate network roundtrip

    const users = await mockDB.getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (!user) {
      throw new Error('E-mail não cadastrado.');
    }

    if (user.password !== password) {
      throw new Error('Senha incorreta.');
    }

    // Return user without password, and a mock JWT token
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token: `mock-jwt-token-xyz-${user.id}`,
    };
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    await delay(1500); // Simulate slightly longer network roundtrip for registration

    const users = await mockDB.getUsers();
    const emailExists = users.some(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (emailExists) {
      throw new Error('Este e-mail já está cadastrado.');
    }

    const newId = String(users.length + 1);
    const newUser = {
      id: newId,
      name,
      email: email.toLowerCase().trim(),
      xp: 0,
      level: 1,
      streak: 0,
    };

    // Save to Mock DB with password
    await mockDB.saveUser({
      ...newUser,
      password,
    });

    return {
      user: newUser,
      token: `mock-jwt-token-xyz-${newId}`,
    };
  },

  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    await delay(1000);

    const users = await mockDB.getUsers();
    const userExists = users.some(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (!userExists) {
      throw new Error('E-mail não encontrado.');
    }

    return {
      success: true,
      message: 'Link de redefinição de senha enviado com sucesso!',
    };
  },
};
