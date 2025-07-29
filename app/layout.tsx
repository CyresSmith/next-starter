import type { Metadata } from 'next';

import './globals.css';

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
        <html lang="en">
            <body className={`antialiased`}>{children}</body>
        </html>
    );
}
