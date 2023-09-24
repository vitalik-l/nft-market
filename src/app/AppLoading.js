import { Spinner } from '../shared/ui-kit';
import React from 'react';

export const AppLoading = () => {
  return (
    <div>
      <div className="flex justify-center items-center h-[100vh]">
        <Spinner className="text-[60px] text-primary-500" />
      </div>
    </div>
  );
};
