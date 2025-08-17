import React from 'react';
import { IconButton as Button } from '@mui/material';

import { ReactNode, MouseEventHandler } from 'react';

interface IconButtonProps {
    children: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    [key: string]: any;
}

const IconButton = ({ children, onClick, ...props }: IconButtonProps) => {
    return (
        <Button {...props} onClick={onClick}>
            {children}
        </Button>
    );
};

export default IconButton;
