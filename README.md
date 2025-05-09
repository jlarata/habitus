# Habitus

Una app mobile enfocada en hábitos saludables para aprobar la materia _Desarrollo de aplicaciones para dispositivos_
Instituto de Formación Superior N° 11 - Carrera: Desarrollo de Software

Mónica Melgarejo | Nadine Nahuel | Cristian Purpura | Ariel Wasserman 


## instrucciones

1. Clonar el repositorio en local
2. Ejecutar npm i (hay que tener instalado npm)
3. Ejecutar "ionic serve" (hay que tener instalado ionic cli)
4. Abrir en el explorador la url http://localhost:8100

-----------------------------------------------------------------
### Login(sin enrutamiento)

- Se recomienda crearla como Page por que:
    - Una page tiene navegación propia: Se usa para pantallas independientes, como Login, Registro, o Dashboard.
    - Se carga dinámicamente: Ionic organiza las páginas para que puedan ser navegadas sin estar siempre activas, lo que optimiza el rendimiento.
    - Incluye su propio módulo (login.module.ts): Esto ayuda a organizar mejor la estructura de la app.
*no se si se ajuste a nuestro caso, es prueba.
1. Instalar Firebase
```console
npm install firebase @angular/fire
```
2. Configurar credenciales firebase en enviroment.ts
-copie pegue las credenciales que me dieron en firebase.. peligroso.. hay que usar variables de entorno(segun leí)
3. Importar Firebase a appmodule.ts
*para que este disponible al iniciar y en toda la app
4. Crear Page Login
```Typescript
ionic generate page pages/login
```
- login.page.ts → Lógica del componente.
- login.page.html → Diseño de la interfaz.
- login.page.scss → Estilos.
- login.module.ts → Configuración del módulo

5. Crear servicio de Autenticación en carpeta services
* si no existe services lo crea

```
ionic generate service services/auth
```
6. crear plantilla login en login.page.html (solo usuarios registrados)
7. prueba login valido-> usuario: faltoganas@gmail.com - contraseña: faltoganas

