import './globals.css';

export const metadata = {
  title: 'n8n Mix Integration Builder',
  description: 'Design and launch mix integrations for n8n automations.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
