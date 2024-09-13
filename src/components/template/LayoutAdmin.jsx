import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import { Button, Switch } from '@nextui-org/react';

import { BookUser, FileText, Gauge, Images, PanelLeftOpen } from 'lucide-react';
import SideNav from '../organisms/SideNav';
import useActivePath from '@/hooks/useActivePath';

const LayoutAdmin = ({ titlePage, children }) => {
  const mainRef = useRef(null);
  const navItems = [
    {
      href: '/admin',
      icon: Gauge,
      label: 'dashboard',
    },
    {
      href: '/admin/gallery',
      icon: Images,
      label: 'gallery',
    },
    {
      href: '/admin/content',
      icon: FileText,
      label: 'content',
    },
    {
      href: '/admin/user',
      icon: BookUser,
      label: 'user',
    },
  ];

  const pathActive = useActivePath(navItems);

  return (
    <div className="flex bg-white max-h-screen" ref={mainRef}>
      <SideNav navItems={navItems} />
      <div className="grow max-h-screen overflow-auto">
        <div className="bg-white w-full shadow-md p-4 z-10 capitalize text-2xl font-semibold text-primary">{titlePage || pathActive}</div>
        <div className="p-2 md:p-5 ">
          <div className="">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default LayoutAdmin;
