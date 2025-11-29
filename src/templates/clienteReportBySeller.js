import { fechaConverter } from '../utils';

export const clienteReportBySeller = async (cuil, name, lastName, clients) => {
  function convertirFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
    const anio = fecha.getFullYear();

    return `${dia}/${mes}/${anio}`;
  }
  function formatoNumero(valor) {
    const numero = parseFloat(valor).toFixed(2);
    let [entero, decimales] = numero.split('.');
    entero = entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${entero},${decimales}`;
  }

  const lista = clients.map((c) => {
    if (c?.currentAcount?.resume < -0.5) {
      let totalFacturas = 0;
      let totalNotasCredito = 0;

      const items = c.currentAcount.movements?.map((i) => {
        // Monto base que se muestra en el reporte
        const tieneSaldoPendiente = i?.saldoPend != null && i?.saldoPend !== undefined;
        const monto = tieneSaldoPendiente ? i.saldoPend : i.total;

        // Indicador de saldo pendiente (P) cuando corresponde, como estaba antes
        const indicadorPendiente = tieneSaldoPendiente && i.saldoPend !== i.total ? ' (P)' : '';

        let facturaCol = '';
        let notaCreditoCol = '';

        // type = 0 es factura o presupuesto (va a columna Factura)
        if (i.type == 0) {
          totalFacturas += monto;
          facturaCol = `$${formatoNumero(monto)}${indicadorPendiente}`;
        }

        // type = 1 es NC oficial, type = 3 es NC X (van a columna Nota de crédito)
        if (i.type == 1 || i.type == 3) {
          totalNotasCredito += monto;
          notaCreditoCol = `$${formatoNumero(monto)}`;
        }

        return `<tr>
        <td>${convertirFecha(i?.fecha)}</td>
        <td>${i?.numComprobante}</td>
        <td>${facturaCol}</td>
        <td>${notaCreditoCol}</td>
      </tr>`;
      });

      return `<div>
          <h3>Cliente: ${c?.razonSocial}</h3>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Comprobante</th>
                <th>Factura</th>
                <th>Nota de crédito</th>
              </tr>
            </thead>
            <tbody>
              ${items}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" class="total">Totales:</td>
                <td>$${formatoNumero(totalFacturas)}</td>
                <td>$${formatoNumero(totalNotasCredito)}</td>
              </tr>
              <tr>
                <td colspan="3" class="total">Total general:</td>
                <td>$${formatoNumero(c?.currentAcount?.resume)}</td>
              </tr>
            </tfoot>
          </table>
        </div>`;
    }
  });

  return `<!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Reporte de Cuentas</title>
      <style>
        * {
          font-family: 'Helvetica', 'Arial', sans-serif;
        }
        body {
          margin: 20px;
        }
        td, th, span, p, h5, h6 {
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        h5,
        h6 {
          text-align: center;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th,
        td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f4f4f4;
        }
        .total {
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <h5>REPORTE DE CTAS. CTES.</h1>
      <h6>${cuil}  ${name} ${lastName}</h2>
      <h6>${fechaConverter(new Date())}</h2>
  
      <!-- Estructura de tabla para un cliente -->
      ${lista}
    </body>
  </html>
  `;
};
