import {
  formatNumberWithLeadingZeros,
  redondearADosDecimales,
} from '../utils';

export const debitNoteHtml = (
  debitNoteData,
  client,
  logoBase64
) => {
  function convertirAFechaDDMMYYYY(fechaISO) {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getUTCDate()).padStart(2, '0');
    const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0');
    const año = fecha.getUTCFullYear();
    return `${dia}-${mes}-${año}`;
  }

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Nota de Débito</title>
      <style type="text/css">
        * {
          box-sizing: border-box;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        body {
          width: 800px;
          height: 1100px;
        }
        .encabezado {
          display: flex;
          width: 100%;
          justify-content: space-between;
        }
        .logo {
          width: 225px;
        }
        .infoEminContainer {
          display: flex;
          flex-direction: column;
          width: 225px;
          align-items: center;
          padding-left: 15px;
        }
        .infoEmisTex {
          width: 100%;
        }
        .tipeFact {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 70px;
          height: 70px;
          border: 2px solid black;
          font-size: 24px;
          letter-spacing: -1;
          font-weight: 600;
        }
        .cod {
          font-size: 12px;
          display: flex;
          justify-content: center;
        }
        .factCode {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .dataFact {
          width: 310px;
          height: 175px;
          border: 2px solid black;
        }
        .leftCont {
          width: 50%;
          display: flex;
          justify-content: space-between;
        }
        .factCont {
          border-bottom: 2px solid black;
        }
        .hojaCont {
          font-size: 23px;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
        }
        .numberFact {
          display: flex;
          justify-content: center;
          font-size: 21px;
          font-weight: 600;
        }
        .fechaFact {
          border-bottom: 2px solid black;
          font-size: 19px;
          font-weight: 500;
        }
        .dataFact p {
          margin: 0px;
          margin-bottom: 7px;
        }
        .dataFact span {
          margin: 0px;
          margin-bottom: 10px;
          font-weight: 600;
        }
        .datFisc {
          margin-top: 2px;
        }
        .clientContainer {
          width: 100%;
          height: 185px;
          border: 1px solid black;
          margin: 10px 0px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 12px;
        }
        .tableContainer {
          width: 100%;
          height: 520px;
        }
        .afipDataDosContainer {
          width: 100%;
          border-top: 2px solid black;
          padding: 10px;
          display: flex;
        }
        .totalCont {
          width: 33%;
          margin-top: 35px;
          height: 110px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-between;
        }
        .pesosSpanCont {
          font-size: 17px;
          font-weight: 500;
        }
        .pesosSpan {
          margin-left: 15px;
          font-weight: 600;
        }
        .ivaClient {
          width: 100%;
          display: flex;
        }
        .clientInfoText {
          width: 100%;
          font-size: 18px;
        }
        .clientInfoTextDos {
          font-weight: 600;
          margin-left: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid black;
          padding: 8px;
          text-align: center;
        }
        .descrip-cell {
          text-align: left;
        }
      </style>
    </head>
    <body>
      <div class="encabezado">
        <div class="leftCont">
          <div class="dataEmisor">
            <img class="logo" src="${logoBase64}" alt="logo" />
            <div class="infoEminContainer">
              <span class="infoEmisTex">Repuestos San Jorge</span>
              <span class="infoEmisTex">Dirección comercial</span>
              <span class="infoEmisTex">Tel: contacto</span>
              <span class="infoEmisTex">IVA: Responsable Inscripto</span>
            </div>
          </div>
          <div class="factCode">
            <div class="tipeFact">ND</div>
            <span class="cod">No válido como factura</span>
          </div>
        </div>
        <div class="dataFact">
          <div class="factCont">
            <div class="hojaCont">
              <span>NOTA DE DÉBITO</span>
              <span>HOJA 1 DE 1</span>
            </div>
            <div class="numberFact"><span>${formatNumberWithLeadingZeros(
              debitNoteData.numComprobante,
              8
            )}</span></div>
          </div>
          <div class="fechaFact">FECHA: ${convertirAFechaDDMMYYYY(
            debitNoteData.fecha
          )}</div>
          <div class="datFisc">
          </div>
        </div>
      </div>
      <div class="clientContainer">
        <div class="ivaClient">
          <span class="clientInfoText">Razón Social: <span class="clientInfoTextDos">${
            client?.razonSocial ?? ''
          }</span></span>
          <span class="clientInfoText">Teléfono: <span class="clientInfoTextDos">${
            client?.telefono ?? ''
          }</span></span>
        </div>
        <div class="ivaClient">
          <span class="clientInfoText">Dirección: <span class="clientInfoTextDos">${
            client?.calle ? `${client.calle} ${client.altura ?? ''}, ${client.localidad ?? ''}` : ''
          }</span></span>
        </div>
        <div class="ivaClient">
          <span class="clientInfoText">IVA: <span class="clientInfoTextDos">${
            client?.iva ? `IVA ${client.iva}` : ''
          }</span></span>
          <span class="clientInfoText">CUIT: <span class="clientInfoTextDos">${
            client?.cuit ?? ''
          }</span></span>
        </div>
      </div>
      <div class="tableContainer">
        <table class="table">
          <tr class="header">
            <th>DESCRIPCIÓN</th>
            <th>IMPORTE</th>
            <th>IVA</th>
            <th>TOTAL</th>
          </tr>
          <tr>
            <td class="descrip-cell">${debitNoteData.descripcion}</td>
            <td>$${redondearADosDecimales(debitNoteData.total - (debitNoteData.iva ?? 0))}</td>
            <td>$${redondearADosDecimales(debitNoteData.iva ?? 0)}</td>
            <td>$${redondearADosDecimales(debitNoteData.total)}</td>
          </tr>
        </table>
      </div>
      <div class="afipDataDosContainer">
        <div style="width: 67%;">
        </div>
        <div class="totalCont">
          <span class="pesosSpanCont">SUBTOTAL<span class="pesosSpan">$${redondearADosDecimales(
            debitNoteData.total - (debitNoteData.iva ?? 0)
          )}</span></span>
          <span class="pesosSpanCont">IVA 21%<span class="pesosSpan">$${redondearADosDecimales(
            debitNoteData.iva ?? 0
          )}</span></span>
          <span class="pesosSpanCont">TOTAL<span class="pesosSpan">$${redondearADosDecimales(
            debitNoteData.total
          )}</span></span>
        </div>
      </div>
    </body>
  </html>
  `;
};
