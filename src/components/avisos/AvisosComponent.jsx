import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import {
  ChangeViewMode,
  CreateBanner,
  DeleteBanById,
  GetBanners,
  GetViewMode,
} from "../../request/productRequest";
import Swal from "sweetalert2";
import {
  Checkbox,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";

function AvisosComponent(props) {
  const [reference, setReference] = useState("");
  const [detalles, setDetalles] = useState("");
  const [check, setCheck] = useState(false);
  const [imagen, setImagen] = useState(null);
  const [pending, setPending] = useState(null);
  const [newsList, setNewsList] = useState([]);

  const handleSubmit = (e) => {
    setPending(true);
    e.preventDefault();

    const formData = new FormData();
    formData.append("reference", reference);
    formData.append("detail", detalles);

    if (imagen) {
      formData.append("images", imagen);
    }
    CreateBanner(formData)
      .then((res) => {
        if (res.error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Ocurrió un error: ${res.error.message}`,
            timer: 3000, // se cierra en 3 segundos
            showConfirmButton: false,
          });
          return;
        }
        Swal.fire({
          title: "Registrado",
          icon: "success",
          timer: 700,
          showConfirmButton: false,
        }).then(() => {
          setDetalles(""); // Limpiar input de texto
          setImagen(null); // Limpiar imagen seleccionada
          document.getElementById("imagen").value = null; // Limpiar input file manualmente
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Ocurrió un error: ${err.message}`,
          timer: 3000, // se cierra en 3 segundos
          showConfirmButton: false,
        });
        return;
      })
      .finally(() => setPending(false));
  };

  const deleteBan = (id) => {
    setPending(true);
    DeleteBanById(id)
      .then((res) => {
        if (res.error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Ocurrió un error: ${res.error.message}`,
            timer: 3000, // se cierra en 3 segundos
            showConfirmButton: false,
          });
          return;
        }
        Swal.fire({
          title: "Eliminado",
          icon: "success",
          timer: 700,
          showConfirmButton: false,
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Ocurrió un error: ${err.message}`,
          timer: 3000, // se cierra en 3 segundos
          showConfirmButton: false,
        });
        return;
      })
      .finally(() => setPending(false));
  };

  useEffect(() => {
    GetBanners().then((res) => setNewsList(res));
  }, [pending]);

  useEffect(() => {
    GetViewMode().then(res => {
      if(res?.mode == "BAN"){
        setCheck(true)
      }
    })
  }, [])

  const onCheckChange = (e, d) => {
    let mode = "NONE";
    if (d.checked) {
      mode = "BAN";
    }
    ChangeViewMode(mode).then((res) => setCheck(res));
  };

  return (
    <>
      <Row style={{ margin: "15px 0px" }}>
        <Col>
          <Checkbox label="Avisos activos" onChange={onCheckChange} checked={check} />
        </Col>
      </Row>
      <Row>
        <Col>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="detalles" className="form-label">
                Referencia
              </label>
              <input
                type="text"
                className="form-control"
                id="reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                required
                placeholder="Nombre o referencia del banner"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="detalles" className="form-label">
                Detalles
              </label>
              <input
                type="text"
                className="form-control"
                id="detalles"
                value={detalles}
                onChange={(e) => setDetalles(e.target.value)}
                required
                placeholder="Detalle adicionales"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="imagen" className="form-label">
                Cargar imagen
              </label>
              <input
                type="file"
                className="form-control"
                id="imagen"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files[0])}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
          </form>
        </Col>
        <Col style={{ paddingTop: "10px" }}>
          <Table celled striped>
            <TableHeader>
              <TableRow>
                <TableHeaderCell colSpan="3">Lista de avisos</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell collapsing>Imagen</TableCell>
                <TableCell>Referencia</TableCell>
                <TableCell collapsing textAlign="right">
                  Acciones
                </TableCell>
              </TableRow>
              {newsList.map((ban) => (
                <TableRow>
                  <TableCell collapsing>
                    <a
                      href={ban.image}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Link
                    </a>
                  </TableCell>
                  <TableCell>{ban.reference}</TableCell>
                  <TableCell collapsing textAlign="right">
                    <div
                      onClick={() => deleteBan(ban.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <Icon name="trash" color="red" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Col>
      </Row>
    </>
  );
}

export default AvisosComponent;
