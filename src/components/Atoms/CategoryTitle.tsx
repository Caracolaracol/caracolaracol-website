
import React from 'react';

interface childrenProps {
    children: React.ReactNode | string;
    text?: string;
    
}

export default function CategoryTitle({ children, text = 'text-dark' }: childrenProps) {
    return (
        <div className="my-1 mt-4">
            <div className="">
                <h2 className={`font-chrono text-platinum/90 text-opacity-70  antialiased leading-4 tracking-wider ${text}`}>{children}</h2>
            </div>
        </div>
    )
}