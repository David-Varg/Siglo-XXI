# El Siglo XXI — Aplicación web interactiva

Proyecto académico desarrollado para la asignatura **Introducción a la Ingeniería de Software** de la **Universidad Surcolombiana**, con la tutoría del docente **Juan Manuel González**.

La aplicación presenta hitos históricos, sus inventores y el impacto que han tenido en la sociedad. La propuesta combina contenido editorial con una experiencia visual interactiva: un recorrido espacial en 3D, una línea de tiempo, búsqueda de artículos y una sección dedicada al equipo.

> El sitio y su estructura están desarrollados. La selección y redacción de los artículos, junto con varias imágenes y modelos asociados a los inventos, se incorporarán cuando el equipo de investigación y contenido los entregue.

## Qué incluye

- **Hero 3D:** escena de la Voyager y Saturno, con cámara y viaje coordinados con el scroll.
- **Línea de tiempo:** carrusel circular de hitos que se puede explorar con el puntero o el teclado. Al abrir una tarjeta se muestran su categoría y un enlace al artículo.
- **Artículos:** páginas individuales con datos del hito, contenido, imágenes o modelo 3D cuando estén disponibles.
- **Búsqueda:** sugerencias de artículos, navegación con teclado e índice compartido en el cliente.
- **Equipo:** tarjetas de integrantes y fondo de partículas.
- **Transiciones y audio:** transiciones entre páginas y reproductor de audio persistente.

La interfaz contempla tamaños de pantalla pequeños, movimiento reducido y pausas de animación cuando algunas escenas dejan de estar visibles.

## Tecnologías

- [Astro](https://astro.build/) para páginas, layouts, rutas y colecciones de contenido.
- [React](https://react.dev/) y TypeScript para componentes interactivos.
- [Three.js](https://threejs.org/) para la escena 3D.
- [GSAP](https://gsap.com/) y ScrollTrigger para animaciones ligadas al desplazamiento.
- [Tailwind CSS](https://tailwindcss.com/) para estilos y diseño adaptable.
- Nano Stores para compartir el estado de búsqueda.
- Zod, mediante Astro Content Collections, para validar la información editorial.
- pnpm, ESLint y Prettier para dependencias, análisis estático y formato.

## Requisitos

- Node.js `>=22.12.0`
- pnpm

## Instalación y desarrollo

Clona el repositorio e instala las dependencias:

```bash
git clone https://github.com/David-Varg/el-siglo-xxi.git
cd el-siglo-xxi
pnpm install
```

Inicia Astro en segundo plano:

```bash
pnpm exec astro dev --background
```

Abre [http://localhost:4321](http://localhost:4321). Para administrar ese servidor:

```bash
pnpm exec astro dev status
pnpm exec astro dev logs
pnpm exec astro dev stop
```

También puedes iniciar Astro en primer plano con `pnpm dev`.

## Comandos disponibles

| Comando | Acción |
| --- | --- |
| `pnpm dev` | Inicia el servidor de desarrollo de Astro. |
| `pnpm build` | Genera la versión de producción en `dist/`. |
| `pnpm preview` | Sirve localmente la compilación de producción. |
| `pnpm lint` | Ejecuta ESLint sobre el código de `src/`. |
| `pnpm lint:fix` | Aplica las correcciones automáticas de ESLint. |
| `pnpm format` | Formatea los archivos compatibles con Prettier. |
| `pnpm test:unit` | Ejecuta las pruebas unitarias de la lógica del carrusel. |

## Organización del proyecto

```text
src/
├── components/     Componentes de layout, navegación, artículos y secciones
├── content/        Datos de hitos y miembros del equipo
├── hooks/          Lógica reutilizable de búsqueda
├── layouts/        Estructura compartida entre páginas
├── lib/            Funciones independientes y pruebas unitarias
├── pages/          Inicio, artículos y endpoint de búsqueda
├── scripts/        Animaciones y comportamiento del cliente
├── store/          Estado compartido
├── styles/         Tema y estilos globales de Tailwind
└── types/          Tipos de TypeScript agrupados por dominio
public/
├── images/         Imágenes usadas por los artículos
├── models/         Modelos y recursos de la escena 3D
└── sounds/         Recursos de audio
```

Astro genera páginas estáticas para los artículos a partir de la colección `hitos`. React se hidrata en los componentes que necesitan interacción, mientras que los scripts del cliente controlan la escena 3D y las animaciones de scroll.

## Cómo añadir un hito

Cada archivo Markdown de `src/content/blog/` representa un hito. Su frontmatter debe cumplir el esquema definido en `src/content.config.ts`:

```md
---
title: "Nombre del hito"
year: 2024
century: "XXI"
inventor:
  - name: "Nombre de la persona"
    role: "Rol relacionado con el hito"
    avatar: "/inventors/nombre.webp"
category: "tecnologia"
place: "Lugar"
precededBy: []
description: "Resumen breve para las vistas previas."
impactScore: 8
heroImage: "/images/nombre-del-hito.webp"
# model3d: "/models/nombre-del-hito.glb"
---

Contenido del artículo en Markdown.
```

Las categorías válidas son `astronomia`, `tecnologia`, `salud`, `ciencia` y `sociedad`. `model3d` es opcional. Los valores de las rutas de imágenes y modelos deben corresponder a archivos disponibles en `public/`.

Los datos del equipo están en `src/content/team/miembros.json`; los avatares y enlaces se definen ahí.

## Pruebas y estado

La suite unitaria actual cubre funciones matemáticas del carrusel y se ejecuta con `pnpm test:unit`. Aún no hay una suite E2E que recorra la experiencia completa. Antes de publicar cambios visuales en el hero, el carrusel o los artículos, conviene revisar también la interacción en móvil y con teclado.

## Equipo del proyecto

| Integrante | Rol | GitHub / redes |
| --- | --- | --- |
| **David Vargas** | Lead Team / Desarrollo Frontend | [@David-Varg](https://github.com/David-Varg) |
| **Helmuth Ramirez** | Diseño y redacción de contenido | [@Helmuth-Ramirez](https://github.com/HelmuthRamirez) |
| **Tomas Bautista** | Investigación y documentación | [@Tomas-Bautista](https://github.com/tomiu8) |
| **Anderson Medina** | Diseño UI | [@Anderson-2205](https://github.com/Anderson-2205) |

## Contexto académico

- **Institución:** Universidad Surcolombiana
- **Programa:** Ingeniería de Software
- **Asignatura:** Introducción a la Ingeniería de Software
- **Docente:** Juan Manuel González
- **Semestre:** 1
- **Año:** 2026
