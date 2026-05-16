export function generarDivisiones(filas, columnas) {
  const divisiones = [];

  for (let fila = 0; fila < filas; fila++) {
    for (let columna = 0; columna < columnas; columna++) {

      const letra = String.fromCharCode(65 + fila);

      divisiones.push({
        nombre: `${letra}${columna + 1}`,
      });
    }
  }

  return divisiones;
}