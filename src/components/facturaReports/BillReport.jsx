import { Checkbox, Loader } from 'semantic-ui-react';
import styles from './billReport.module.css';
import { DatePicker } from 'antd';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getBillReportRequest } from '../../request/billRequest';
import Swal from 'sweetalert2';

function BillReport(props) {
  const { closeModal } = props;
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(true);
  const [dateRange, setDateRange] = useState([]);
  const { RangePicker } = DatePicker;

  const handleDateChange = (dates, dateStrings) => {
    // `dates` es un array de objetos moment
    // `dateStrings` es un array de strings en formato 'YYYY-MM-DD'
    setDateRange(dates);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const filters = {
      initDate: dateRange[0],
      endDate: dateRange[1],
      oficial: check,
    };
    try {
      await getBillReportRequest(filters);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Ocurrió un error: ${err.message}`,
      });
    } finally {
      setLoading(false);
      closeModal();
    }
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.boxInput}>
          <label>Selecioná el rango de fechas</label>
          <RangePicker
            onChange={handleDateChange}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            placeholder={['Inicio', 'Fin']}
            format="DD/MM/YYYY"
            allowClear={false}
          />
        </div>
        <div className={styles.check}>
          <Checkbox
            label="Oficial"
            checked={check}
            onChange={() => setCheck(!check)}
          />
        </div>
      </div>
      <div className={styles.buttonCont}>
        <Button
          disabled={dateRange.length == 0}
          type="button"
          onClick={handleSubmit}
        >
          {loading ? <Loader size="tiny" /> : 'Descargar'}
        </Button>
      </div>
    </>
  );
}

export default BillReport;
