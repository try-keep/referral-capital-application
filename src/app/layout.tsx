import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Referral Capital Application",
  description: "Multi-step referral application for capital funding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/favicon.ico" />
        {/* Facebook Pixel Script */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '477553342087750');
            fbq('track', 'PageView');
          `}
        </Script>
        
        <Script 
          src="https://widget.senja.io/widget/846e80aa-0de3-4620-9375-cddaa7715b56/platform.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} antialiased bg-gray-50`}>
        {/* Facebook Pixel NoScript */}
        <noscript>
          <img height="1" width="1" style={{display:'none'}}
               src="https://www.facebook.com/tr?id=477553342087750&ev=PageView&noscript=1"/>
        </noscript>
        
        {/* LogRocket Script */}
        <Script id="logrocket" strategy="afterInteractive">
          {`
            window._LRLogger = window._LRLogger || [];
            window._LRLogger.push(['init', { appId: 'mglw7a/keep-dev' }]);
            (function(d, s) {
              var j = d.createElement(s); j.async = true; j.src = 'https://cdn.lr-in.com/LogRocket.min.js';
              var h = d.getElementsByTagName(s)[0]; h.parentNode.insertBefore(j, h);
            })(document, 'script');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
