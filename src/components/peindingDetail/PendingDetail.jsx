import PendingRegistryTable from '../tables/pendingRegistryTable/PendingRegistryTable';
import styles from './pendingDetail.module.css';
import { useSelector } from 'react-redux';

function PendingDetail(props) {
  const { data } = props;

  // Usar siempre la versión más reciente del pending desde Redux,
  // para que al eliminar registros se actualicen los datos en el modal.
  const pendingsState = useSelector((state) => state.pendings?.data?.list || []);
  const pending = pendingsState.find((p) => p.id === data?.id) || data;

  return (
    <div className={styles.tableCont}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>
          <i class="fa-solid fa-barcode"></i>
          <span>{pending?.product?.article}</span>
        </span>
        <span>
          <i class="fa-solid fa-copyright"></i>
          <span>{pending?.product?.brand?.name}</span>
        </span>
        <span>
          <i class="fa-solid fa-check-double"></i>
          <span>{pending?.amount}</span>
        </span>
      </div>
      <PendingRegistryTable {...props} data={pending} />
    </div>
  );
}

export default PendingDetail;
