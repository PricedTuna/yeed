# Yeed

**Yeed** es una plataforma web de búsqueda y recomendación de contenido educativo, diseñada para estudiantes de Ingeniería de Software que complementan su formación mediante aprendizaje autodidacta.

La plataforma centraliza recursos educativos disponibles en Internet, permitiendo buscar y filtrar contenido según diferentes criterios y conservar la valoración que los estudiantes realizan sobre los recursos consultados. A partir de los intereses y valoraciones de cada usuario, Yeed genera recomendaciones personalizadas que se adaptan conforme se utiliza el sistema.

## Características

* Registro e inicio de sesión de usuarios.
* Selección y modificación de temas de interés.
* Catálogo de recursos educativos.
* Búsqueda por título, descripción y etiquetas.
* Filtrado por tipo de contenido.
* Valoración de recursos en una escala de 1 a 5.
* Recomendaciones personalizadas basadas en los intereses y valoraciones del usuario.
* Consulta de información y enlace de acceso a cada recurso.
* Diseño adaptable para computadoras y dispositivos móviles.
* Despliegue en infraestructura de nube mediante HTTPS.

## Tipos de contenido

El catálogo puede incluir diferentes tipos de recursos educativos:

* Documentos
* Videos
* Audio
* Imágenes
* Markdown

Yeed almacena la información y referencia de cada recurso, pero no aloja ni reproduce directamente el contenido externo.

## Sistema de recomendación

El sistema utiliza la información proporcionada por los usuarios para generar recomendaciones relevantes. Las recomendaciones consideran principalmente:

* Temas de interés seleccionados por el usuario.
* Valoraciones realizadas sobre recursos consultados.
* Similitud entre los intereses y valoraciones de los usuarios.

De esta manera, dos usuarios con intereses o valoraciones diferentes pueden recibir recomendaciones distintas.

## Usuarios

Yeed contempla dos tipos principales de acceso:

### Visitante

Puede buscar recursos, aplicar filtros y consultar la información disponible sin necesidad de crear una cuenta.

### Estudiante registrado

Además de las funciones disponibles para visitantes, puede:

* Crear y administrar su cuenta.
* Seleccionar sus temas de interés.
* Valorar recursos.
* Consultar recomendaciones personalizadas.

## Arquitectura

La plataforma está diseñada como una aplicación web desplegada en infraestructura de nube, utilizando componentes separados para la interfaz, la lógica de aplicación y el almacenamiento de información.

La arquitectura contempla mecanismos de autenticación, control de acceso y aislamiento de los componentes que almacenan información interna.

## Seguridad

El proyecto contempla buenas prácticas básicas de seguridad, entre ellas:

* Almacenamiento seguro de contraseñas mediante algoritmos adaptativos como bcrypt o Argon2.
* Uso de HTTPS.
* Principio de mínimo privilegio para los permisos de los componentes.
* Protección de la base de datos frente al acceso directo desde Internet.
* Manejo de credenciales mediante variables de entorno.
* Exclusión de secretos y credenciales mediante `.gitignore`.

## Alcance

Yeed está orientado a proporcionar un prototipo funcional capaz de centralizar la búsqueda de recursos educativos y ofrecer recomendaciones personalizadas a estudiantes.

La plataforma **no aloja ni reproduce contenido externo**, no realiza indexación automática de Internet, no integra APIs de plataformas externas y no contempla aplicaciones móviles nativas. El acceso desde dispositivos móviles se realiza mediante el navegador.

## Objetivo

El objetivo principal de Yeed es **reducir el tiempo y esfuerzo que los estudiantes dedican a localizar y evaluar recursos educativos**, aprovechando la información generada por la comunidad de usuarios para ofrecer recomendaciones cada vez más relevantes.
