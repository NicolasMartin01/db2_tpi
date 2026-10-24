# TPI Bases de Datos 2 – API Gimnasio

Backend Express + Mongoose en capas (`routes → controllers → services → repositories → models`) para las colecciones `socios`, `clases` y `reservas` de la base `gimnasio_tpi`.

## Uso
```bash
npm install
cp .env.example .env     # completar MONGODB_URI
npm run init-db          # opcional: aplica los validadores $jsonSchema
npm run seed             # opcional: carga datos de prueba
npm run dev              # http://localhost:3000
```
- Swagger UI: `http://localhost:3000/api-docs`
- Especificación OpenAPI (importable en Postman): `http://localhost:3000/api-docs.json`

## Endpoints (`<col>` = socios | clases | reservas)
| Verbo | Ruta | Descripción |
|---|---|---|
| POST | /api/`<col>` | Crear |
| GET | /api/`<col>`?activo=true\|false\|all | Listar (activos por defecto) |
| GET | /api/`<col>`/:id | Obtener |
| PUT | /api/`<col>`/:id | Reemplazo completo |
| PATCH | /api/`<col>`/:id | Actualización parcial |
| DELETE | /api/`<col>`/:id | Baja lógica (`activo=false`, `deletedAt=now`) |
| PATCH | /api/reservas/:id/cancelar | Cancelar reserva (`estado=CANCELADA`) |

## Datos de prueba
`npm run seed` inserta 10 socios, 6 clases y 25 reservas (con un socio y una clase dados de baja, y 5 reservas canceladas).
Si las colecciones ya tienen datos aborta; usar `npm run seed -- --reset` para vaciarlas y volver a cargar.

## Decisiones
- `timestamps: true` → `createdAt`/`updatedAt` reemplazan `fechaAlta` y `fechaReserva`.
- `deletedAt` reemplaza a `fechaBaja`.
- `activo`, `deletedAt`, `createdAt`, `updatedAt` no se pueden escribir desde el body.
- Reservas (POST, PUT y PATCH): el socio y la clase deben existir y estar activos; un socio no puede tener dos reservas CONFIRMADAS en la misma clase y las confirmadas no pueden superar `cupoMaximo` (409 en ambos casos). Las canceladas o dadas de baja no ocupan lugar, así que se puede volver a reservar tras cancelar.
- `cupoMaximo` se guarda como `Int32` para cumplir `bsonType: "int"`.
- Subcampos asumidos: `membresia {plan, precio, fechaVencimiento}`, `instructor {nombre, apellido, email}`.
