import React, { useCallback } from 'react';
import classnames from 'classnames';

const ButtonToolbar = ({ children, active, disabled, onMouseDown, onClick }) => {
  const getActiveStyle = useCallback(() => {
    if (active) return 'bg-zinc-600 text-white';
    else return 'text-white bg-primary';
  }, [active]);

  const commonClasses = 'p-2 rounded text-lg hover:scale-110 hover:shadow-md transition';

  return (
    <button type="button" onMouseDown={onMouseDown} onClick={onClick} className={classnames(commonClasses, getActiveStyle())} disabled={disabled}>
      {children}
    </button>
  );
};

export default ButtonToolbar;
