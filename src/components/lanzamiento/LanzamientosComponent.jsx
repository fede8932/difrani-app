import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductIdRequest,
  resetSelectProduct,
} from "../../redux/selectProduct";
import { useLocation } from "react-router";
import { CreateNews } from "../../request/productRequest";
import Swal from "sweetalert2";

function LanzamientosComponent(props) {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const id = Number(pathname.split("/")[3]);
  const { data, loading } = useSelector((state) => state.selectProduct);
  const [detalles, setDetalles] = useState("");
  const [imagen, setImagen] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productId", id);
    formData.append("detail", detalles);

    if (imagen) {
      formData.append("images", imagen);
    }
    CreateNews(formData)
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
      });
  };
  useEffect(() => {
    dispatch(getProductIdRequest(id));
    return () => dispatch(resetSelectProduct());
  }, []);
  return (
    <>
      <Row>
        <Col>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="detalles" className="form-label">
                Artículo
              </label>
              <input
                disabled
                type="text"
                className="form-control"
                value={data?.article ?? ""}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="detalles" className="form-label">
                Descripción
              </label>
              <input
                disabled
                type="text"
                className="form-control"
                value={data?.description ?? ""}
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
                placeholder="Detalle o referencia al lanzamiento"
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
        <Col></Col>
      </Row>
    </>
  );
}

export default LanzamientosComponent;
