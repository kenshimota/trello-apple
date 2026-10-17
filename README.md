# Gym Board (trello-apple)

Aplicación web para organizar rutinas de entrenamiento por día, con una interfaz inspirada en las Apple Human Interface Guidelines. A pesar del nombre del repositorio, el proyecto es un tablero de gimnasio, no un clon de Trello.

## Funcionalidad

- Registro e inicio de sesión con sesión persistente en el navegador.
- Rutas protegidas: el tablero solo se muestra con sesión activa.
- Crear, renombrar y eliminar días de entrenamiento.
- Agregar y eliminar ejercicios con series y repeticiones.
- Marcar ejercicios completados.
- Estadísticas de días, ejercicios totales y completados.
- Persistencia en `localStorage` por usuario.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

## Uso

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Credenciales de demostración:

```text
Correo: demo@gym.app
Contraseña: demo1234
```

## Scripts

```bash
npm run dev    # servidor de desarrollo
npm run build  # build de producción
npm run start  # servir el build
npm run lint   # ESLint
```

## Nota

La autenticación y los datos viven en `localStorage`; es una demo de frontend y no debe usarse como sistema de autenticación en producción.
