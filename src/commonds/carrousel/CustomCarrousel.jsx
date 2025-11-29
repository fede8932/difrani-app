import React, { useState, useEffect } from 'react';
import { Carousel } from 'antd';
import styles from './carrousel.module.css';
import Swal from 'sweetalert2';
import { deleteProductImage } from '../../request/productRequest';
import { useDispatch } from 'react-redux';
import { searchProductsExtraRequest } from '../../redux/product';

const contentStyle = {
  margin: 0,
  height: '600px',
  color: '#fff',
  lineHeight: '490px',
  textAlign: 'center',
  background: '#364d79',
  borderRadius: '5px',
  position: 'relative',
};

const deleteButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  backgroundColor: '#ff4d4f',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  cursor: 'pointer',
  fontSize: '18px',
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
};

const CustomCarrousel = (props) => {
  const { images: initialImages, filterProducts } = props;
  const [images, setImages] = useState(initialImages || []);
  const dispatch = useDispatch();

  useEffect(() => {
    setImages(initialImages || []);
  }, [initialImages]);

  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };

  const handleDeleteImage = async (imageId, e) => {
    e.stopPropagation();

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la imagen permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await deleteProductImage(imageId);

        // Actualizar el estado local
        const updatedImages = images.filter(img => img.id !== imageId);
        setImages(updatedImages);

        // Refrescar la lista de productos si filterProducts está disponible
        if (filterProducts) {
          dispatch(searchProductsExtraRequest(filterProducts));
        }

        Swal.fire({
          title: 'Eliminada',
          text: 'La imagen ha sido eliminada correctamente',
          icon: 'success',
          timer: 2000,
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error al eliminar la imagen: ${error.message}`,
        });
      }
    }
  };

  return (
    <Carousel
      afterChange={onChange}
      autoplay={true}
      className={styles.slickDots}
    >
      {images &&
        images.map((image, i) => (
          <div key={image.id || i} style={contentStyle}>
            <button
              style={deleteButtonStyle}
              onClick={(e) => handleDeleteImage(image.id, e)}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#ff7875';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ff4d4f';
                e.target.style.transform = 'scale(1)';
              }}
              title="Eliminar imagen"
            >
              <i className="fa-solid fa-trash"></i>
            </button>
            <img
              src={image.url?.toLowerCase()}
              alt={`Imagen ${i}`}
              style={{ height: '600px', maxWidth: '790px' }}
            />
          </div>
        ))}
    </Carousel>
  );
};

export default CustomCarrousel;
