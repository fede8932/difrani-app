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
      const items = c.currentAcount.movements?.map((i) => {
        let concep = '';
        if (i.type == 0) {
          //type = 0 es factura o presupuesto
          if (i.billType == 0) {
            //billType = 0 es presupuesto
            concep = 'Presupuesto';
          }
        }
        if (i.type == 0) {
          //type = 0 es factura o presupuesto
          if (i.billType != 0) {
            //billType = 0 es presupuesto
            concep = 'Factura';
          }
        }
        if (i.type == 1) {
          //type = 1 es nc oficial
          concep = 'Nota de crédito';
        }
        if (i.type == 3) {
          //type = 1 es nc oficial
          concep = 'Nota de crédito X';
        }
        return `<tr>
        <td>${convertirFecha(i?.fecha)}</td>
        <td>${i?.numComprobante}</td>
        <td>${concep}</td>
        <td>$${i?.saldoPend ? `${formatoNumero(i?.saldoPend)} ${i?.saldoPend == i?.total ? '' : '(P)'}` : formatoNumero(i?.total)}</td>
      </tr>`;
      });
      return `<div>
          <h3>Cliente: ${c?.razonSocial}</h3>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Comprobante</th>
                <th>Concepto</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${items}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="total">Total:</td>
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
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
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
