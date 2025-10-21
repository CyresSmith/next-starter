import { type SVGProps } from 'react';

import { IconNameType } from '@types';

import { cn } from '@utils';

type Props = {
    height?: number;
    name: IconNameType;
    width?: number;
} & SVGProps<SVGSVGElement>;

export const Icon = ({ className, height = 24, name, width = 24, ...props }: Props) => {
    const href = `/icons/sprite.svg#${name}`;

    return (
        <svg
            {...props}
            className={cn(className, className?.includes('fill') ? '' : 'fill-inherit')}
            height={height}
            width={width}
        >
            <use href={href} suppressHydrationWarning />
        </svg>
    );
};
