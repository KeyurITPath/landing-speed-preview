import React from 'react';

export const metadata = {
  title: 'Dashboard | Architecture',
  description: 'Dashboard layout for the Project Architecture Next.js Template',
};
const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default PrivateLayout;
