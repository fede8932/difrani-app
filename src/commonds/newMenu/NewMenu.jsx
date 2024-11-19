import React from 'react';
import {
  DropdownMenu,
  DropdownItem,
  DropdownDivider,
  Dropdown,
} from 'semantic-ui-react';
import CustomMenu from '../menu/CustomMenu';

function NewMenu(props) {
  const { logOutFn, perfilFn, ...rest } = props;
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
        <DropdownItem text="Cerrar sesión" onClick={() => logOutFn()} />
      </DropdownMenu>
    </Dropdown>
  );
}
export default NewMenu;
