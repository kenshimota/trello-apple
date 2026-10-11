export type User = {
  id: string;
  name: string;
  email: string;
};

type StoredUser = User & { password: string };

const USERS_KEY = "gym.users";

const DEMO_USER: StoredUser = {
  id: "demo",
  name: "Atleta Demo",
  email: "demo@gym.app",
  password: "demo1234",
};

function isBrowser() {
  return typeof window !== "undefined";
}

function readUsers(): StoredUser[] {
  if (!isBrowser()) return [DEMO_USER];
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    const parsed = raw ? (JSON.parse(raw) as StoredUser[]) : [];
    if (!parsed.some((u) => u.email === DEMO_USER.email)) {
      parsed.unshift(DEMO_USER);
    }
    return parsed;
  } catch {
    return [DEMO_USER];
  }
}

function writeUsers(users: StoredUser[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toUser({ id, name, email }: StoredUser): User {
  return { id, name, email };
}

export async function signIn(email: string, password: string): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 450));
  const normalized = email.trim().toLowerCase();
  const match = readUsers().find(
    (u) => u.email.toLowerCase() === normalized && u.password === password,
  );
  if (!match) throw new Error("Correo o contraseña incorrectos.");
  return toUser(match);
}

export async function signUp(
  name: string,
  email: string,
  password: string,
): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 450));
  const normalized = email.trim().toLowerCase();
  const users = readUsers();
  if (users.some((u) => u.email.toLowerCase() === normalized)) {
    throw new Error("Ya existe una cuenta con ese correo.");
  }
  const created: StoredUser = {
    id: crypto.randomUUID(),
    name: name.trim() || normalized.split("@")[0],
    email: normalized,
    password,
  };
  writeUsers([...users, created]);
  return toUser(created);
}

export const DEMO_CREDENTIALS = {
  email: DEMO_USER.email,
  password: DEMO_USER.password,
};
