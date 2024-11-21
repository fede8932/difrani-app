import React from 'react';
import {
  DropdownMenu,
  DropdownItem,
  DropdownDivider,
  Dropdown,
} from 'semantic-ui-react';
import CustomMenu from '../menu/CustomMenu';
import ProtectedComponent from '../../protected/protectedComponent/ProtectedComponent';
const redirect_url = import.meta.env.VITE_REDIRECT_URL;
const entorno = import.meta.env.VITE_ENTORNO;

function NewMenu(props) {
  const { logOutFn, perfilFn, ...rest } = props;

  const redirectToGoogle = () => {
    window.location.href = redirect_url;
  };
  return (
    <Dropdown text="File" trigger={<CustomMenu />} icon={null} {...rest}>
      <DropdownMenu>
        <DropdownItem
          text="Perfil"
          onClick={() => {
            perfilFn();
          }}
        />
        <DropdownDivider />
        <ProtectedComponent listAccesss={[1]}>
          <DropdownItem
            text={
              entorno == 'BLASE'
                ? 'Ir a Difrani'
                : 'Ir a Blase'
            }
            onClick={redirectToGoogle}
          />
        </ProtectedComponent>
        <DropdownItem text="Cerrar sesión" onClick={() => logOutFn()} />
      </DropdownMenu>
    </Dropdown>
  );
}
export default NewMenu;
