import type { MenuProps } from "antd";
import { Button, Dropdown, theme } from "antd";
import { MdMoreVert } from "react-icons/md";
import { getRecColor } from "@/utils/common";
import ChangeUserStatus from "./ActDecUser";
import Permissions from "./Permissions";
import { TbLockAccess } from "react-icons/tb";

const UserActionDropDown = ({ merchant }: { merchant: any }) => {
  const { token } = theme.useToken();

  const items: MenuProps["items"] = [
    {
      key: "1",
      icon: <TbLockAccess />,
      label: <Permissions user={merchant} />,
    },
    {
      key: "2",
      label: <ChangeUserStatus user={merchant} />,
      danger: merchant?.active ? true : false,
    },
  ];

  return (
    <Dropdown menu={{ items }}>
      <Button
        type="default"
        icon={<MdMoreVert />}
        size="middle"
        style={{
          color: getRecColor(merchant.active, token),
          borderColor: getRecColor(merchant.active, token),
        }}
      />
    </Dropdown>
  );
};

export default UserActionDropDown;
