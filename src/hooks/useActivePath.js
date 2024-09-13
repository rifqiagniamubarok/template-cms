import { usePathname } from 'next/navigation';
import React from 'react';
import { useState, useEffect } from 'react';

export default function useActivePath(pathList) {
  const pathname = usePathname();

  const currentPath = pathList.find((path) => path.href == pathname);
  if (currentPath) {
    return currentPath.label;
  }

  const activePath = pathname.split('/admin')[1];

  return activePath;
}
