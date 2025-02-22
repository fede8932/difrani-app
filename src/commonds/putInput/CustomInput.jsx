import React, { useEffect, useState } from 'react';
import styles from './customInput.module.css';
import { useFormContext } from 'react-hook-form';

const formatNumber = (value) => {
  if (value == null) return '0,00';
  const nValue = String(value);
  const cleanValue = nValue?.replace(/\D/g, ''); // Eliminar caracteres no numéricos
  const integerPart = cleanValue?.slice(0, -2) || '0'; // Parte entera
  const decimalPart = cleanValue?.slice(-2).padStart(2, '0'); // Parte decimal con dos dígitos
  const formattedValue = `${parseInt(integerPart, 10).toLocaleString('es-ES')},${decimalPart}`;
  return formattedValue;
};

function CustomInput(props) {
  const {
    width,
    icon,
    name,
    validate,
    readOnly,
    defaultValue,
    formatNum,
    ...rest
  } = props;
  const [classDivContainer, setClassDivContainer] = useState('inputContainer');
  const {
    register,
    formState: { errors },
    setValue, // Para actualizar el valor del campo en el formulario
  } = useFormContext();

  const handleChange = (e) => {
    const rawValue = e.target.value;
    const formattedValue = formatNumber(rawValue);
    setValue(name, formattedValue); // Actualiza el valor en el formulario
  };
  useEffect(() => {
    if (rest.value !== undefined) {
      setValue(name, rest.value); // Actualiza el valor en react-hook-form
    }
  }, [rest.value, name, setValue]);

  return (
    <div style={{ marginBottom: '15px' }} className={`${styles[width]}`}>
      <div
        onBlur={() => {
          setClassDivContainer('inputContainer');
        }}
        className={`${styles[classDivContainer]}`}
      >
        <i className={`${styles.searchIcon} ${icon}`}></i>
        <input
          defaultValue={!formatNum ? defaultValue || '' : ''}
          disabled={readOnly}
          {...register(name, validate)}
          onFocus={() => {
            setClassDivContainer('inputContainerActive');
          }}
          className={styles.input}
          onChange={formatNum ? handleChange : () => {}}
          {...rest}
        />
      </div>
      <div className={styles.errorContainer}>
        {errors[name] && <span>El campo es obligatorio</span>}
      </div>
    </div>
  );
}

export default CustomInput;
