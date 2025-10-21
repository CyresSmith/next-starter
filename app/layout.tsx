import type { Metadata } from 'next';
import { Comfortaa, Kiwi_Maru } from 'next/font/google';

import './globals.css';

const sans = Comfortaa({
    subsets: ['cyrillic-ext', 'cyrillic', 'latin'],
    variable: '--sans',
});

const heading = Kiwi_Maru({
    subsets: ['cyrillic', 'latin'],
    variable: '--heading',
    weight: ['300', '400', '500'],
});

export const metadata: Metadata = {
    title: 'New Next App',
    description: 'New nex app',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${sans.variable} ${heading.variable} antialiased`}>
            <body>{children}</body>
        </html>
    );
}
