# Documentación del Backend

El backend actualmente solo requiere de dos inputs en la terminal, ubicado en el root:
* `npm install`
* `npm run start`

Esto ejecutará el back-end, conectándolo a la base de datos y ports designados en el archivo `.env` necesario para la ejecución.

`.env`
```
PORT=1025
PG_USER=<your postgres user>
PG_PASSWORD=<your postgres password>
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=pokemon

SECRET_KEY=p0k3m0nk3y
```

Aquí recomiendo conservar el PORT en 1025 ya que es con el que tiene conexión el front-end.