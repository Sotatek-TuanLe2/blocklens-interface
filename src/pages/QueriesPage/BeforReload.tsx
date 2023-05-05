import React, { useEffect } from 'react';
import { Prompt } from 'react-router';

interface IBeforeReload {
  msg: string;
}
const BeforeReload = ({ msg }: IBeforeReload) => {
  useEffect(() => {
    const handleBeforeReload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeReload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeReload);
    };
  }, []);

  return <Prompt message={msg} />;
};

export default BeforeReload;
