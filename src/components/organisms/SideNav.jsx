import useActivePath from '@/hooks/useActivePath';
import { Divider, Link } from '@nextui-org/react';
import Avvvatars from 'avvvatars-react';
import classNames from 'classnames';
import { LogOut, PanelLeftOpen, PanelRightOpen, Slack } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import ThisAvatar from '../atoms/ThisAvatar';

const NAV_OPEN_WIDTH = 'w-48';
const NAV_CLOSE_WIDTH = 'w-12';
const NAV_VISIBILITY = 'nav-visibility';

const SideNav = ({ navItems }) => {
  const {
    data: { user },
  } = useSession();
  const navRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const pathActive = useActivePath(navItems);

  const toggleNav = (visiblility) => {
    const { current: currentNav } = navRef;
    if (!currentNav) return;
    const { classList } = currentNav;
    if (visiblility) {
      classList.remove(NAV_OPEN_WIDTH);
      classList.add(NAV_CLOSE_WIDTH);
    } else {
      setVisible(!visible);
      classList.remove(NAV_CLOSE_WIDTH);
      classList.add(NAV_OPEN_WIDTH);
    }
  };

  const updateNavState = () => {
    toggleNav(visible);
    const newState = !visible;
    setVisible(newState);
    localStorage.setItem(NAV_VISIBILITY, JSON.stringify(newState));
  };

  const pathStyle = {
    active: 'bg-primary text-white shadow-md hover:bg-opacity-95 hover:text-white ',
    inactive: 'bg-white text-primary hover:bg-gray-300 hover:text-primary ',
    general: 'flex items-center text-primary px-3 py-2 text-sm tarnsition hover:scale-[0.98] rounded-md w-full text-semibold',
  };

  return (
    <div ref={navRef} className="h-screen w-48 shadow-lg bg-white  flex flex-col justify-between transition-width overflow-hidden z-20">
      {/* Body */}
      <div>
        {/* Logo */}
        <div className="flex items-center space-x-2 p-3 mb-10">
          <Slack size={30} className="text-primary" />
          {visible && <span className="text-primary dark:text-highlight-dark text-xl leading-none">Admin</span>}
        </div>
        <div className="w-full px-1 flex flex-col items-center gap-y-2">
          <Link href="/admin/profile" className={classNames(pathActive == '/profile' ? 'p-0.5 bg-primary rounded-full' : '')}>
            <ThisAvatar noView />
          </Link>
          {visible && <p className="text-center">{user.name}</p>}
        </div>
        <div className="px-2">
          <Divider className="my-4" />
        </div>
        {/* Items */}
        <div className="w-full px-1">
          <div className=" w-full space-y-0.5">
            {navItems.length !== 0 &&
              navItems.map((item, index) => {
                return (
                  <Link href={item.href} key={index} className="w-full">
                    <div className={classNames(pathActive == item.label ? pathStyle.active : pathStyle.inactive, pathStyle.general)}>
                      <item.icon size={24} />
                      {visible && <span className="ml-2 leading-none capitalize">{item.label}</span>}
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
      {/* Toggle */}
      <div className="p-1 w-full space-y-2">
        <div className="w-full">
          <button className={classNames('flex items-center gap-1 text-sm hover:bg-red-500 hover:text-white text-primary w-full p-2 rounded-md')} onClick={signOut}>
            <LogOut size={24} />
            {visible && <span className="ml-2 leading-none">Logout</span>}
          </button>
        </div>
        <div className="p-2 w-full  flex justify-end">
          <button onClick={updateNavState} className="text-primary self-end  hover:scale-[0.98] transition ">
            {visible ? <PanelRightOpen size={25} /> : <PanelLeftOpen size={26} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
