# El Siglo XXI — Aplicación Web Interactiva

Proyecto académico desarrollado para la asignatura **Introducción a la Ingeniería de Software** de la **Universidad Surcolombiana**, bajo la tutoría del docente **Juan Manuel González**

Se intentó crear una plataforma web interactiva inspirada en los hitos, inventores y transformaciones tecnológicas, científicas y sociales más relevantes del **Siglo XXI** (basado en la investigación y exposición del grupo asignado)

---

## Descripción del Proyecto

Esta aplicación recopila la información histórica del siglo XXI —desde el auge de los teléfonos inteligentes, la edición genética (CRISPR), la computación cuántica y la Inteligencia Artificial hasta la exploración espacial— en una interfaz web animada y lo más interactiva posible para un blog.

### Características Principales

- **Timeline:** Visualización de los principales eventos del 2000 a la actualidad.
- **Búsqueda Avanzada:** Barra de búsqueda central con autocompletado tokenizado.
- **Visuales Cinemáticas:** Integración de partículas interactivas (`tsParticles`) y animaciones fluidas con GSAP/Framer Motion.
- **Scroll Snap & Transiciones:** Sección de créditos y tecnologías organizada por vistas fijas.
- **Colecciones en Markdown:** Artículos e hitos procesados mediante Content Collections de Astro.

---

## Tecnologías Utilizadas

- **Framework:** [Astro v7](https://astro.build/) + [React v19](https://react.dev/)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animaciones & Interactividad:**
  - GSAP v3
  - Framer Motion
  - @tsparticles/astro
- **Iconos:** Lucide Astro (`@lucide/astro`)
- **Despliegue:** [Vercel](https://vercel.com/)

---

## 👥 Equipo del Proyecto

| Integrante          | Rol                             | GitHub / Redes                               |
| :------------------ | :------------------------------ | :------------------------------------------- |
| **David Vargas**    | Lead Team / Desarrollo Frontend | [@David-Varg](https://github.com/David-Varg) |
| **Helmuth Ramirez** | Diseño & Redacción de Contenido | [@Helmuth-Ramirez](#)                        |
| **Tomas Bautista**  | Investigación & Documentación   | [@Tomas-Bautista](#)                         |
| **Anderson Medina** | Diseño UI                       | [@Anderson-Medina](#)                        |

---

## 🚀 Instalación y Ejecución Local

### Requisitos Previos

- **Node.js**: `>=22.12.0`
- **Gestor de paquetes**: `pnpm`, `npm` o `yarn`

### Pasos

1. **Clonar el repositorio**

```bash
   git clone [https://github.com/David-Varg/el-siglo-xxi.git](https://github.com/David-Varg/el-siglo-xxi.git)
   cd el-siglo-xxi
```

2. Instalar dependencias:

```bash
pnpm install
# o: npm i
```

3. Iniciar el servidor de desarrollo:

```bash
pnpm dev
# o: npm run dev
```

4. Abrir en el navegador en [http://localhost:4321](http://localhost:4321)

## Scripts Disponibles

- `pnpm dev`: Inicia el entorno de desarrollo local con Astro.
- `pnpm build`: Compila la aplicación para producción.
- `pnpm preview`: Vista previa local de la compilación de producción.
- `pnpm lint`: Ejecuta ESLint en archivos `.js` y `.astro`.
- `pnpm lint:fix`: Corrige errores automáticos de estilo de código.

## Contexto Académico

- **Institución:** Universidad Surcolombiana
- **Programa:** Ingeniería de Software
- **Asignatura:** Introducción a la Ingeniería de Software
- **Docente:** Juan Manuel González
- **Semestre:** 1
- **Año:** 2026
