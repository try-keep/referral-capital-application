import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import Analytics from '@/components/analytics';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Referral Capital Application',
  description: 'Keep Capital Application',
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

        {/* Keep Capital CSS */}
        <link href="/css/normalize.css" rel="stylesheet" type="text/css" />
        <link href="/css/components.css" rel="stylesheet" type="text/css" />
        <link href="/css/keep-capital.css" rel="stylesheet" type="text/css" />

        {/* Google Fonts */}
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          href="https://fonts.gstatic.com"
          rel="preconnect"
          crossOrigin="anonymous"
        />

        {/* WebFont loader for Inter */}
        <Script
          src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
          strategy="beforeInteractive"
        />
        <Script id="webfont-loader" strategy="beforeInteractive">
          {`WebFont.load({ google: { families: ["Inter:regular,500,600,700"] } });`}
        </Script>

        {/* Webflow modernizr */}
        <Script id="webflow-modernizr" strategy="beforeInteractive">
          {`!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);`}
        </Script>

        {/* Favicon and touch icons */}
        <link
          href="/images/favicon.png"
          rel="shortcut icon"
          type="image/x-icon"
        />
        <link href="/images/webclip.png" rel="apple-touch-icon" />

        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-W8P2Z7C7');
          `}
        </Script>

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

        {/* Microsoft Clarity Script */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "s4542yrw9q");
          `}
        </Script>

        <Script
          src="https://widget.senja.io/widget/846e80aa-0de3-4620-9375-cddaa7715b56/platform.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W8P2Z7C7"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>

        {/* Facebook Pixel NoScript */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=477553342087750&ev=PageView&noscript=1"
          />
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

        {/* jQuery - load first */}
        <Script
          src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js"
          strategy="beforeInteractive"
          integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
          crossOrigin="anonymous"
        />

        {/* Navbar Color Change Script */}
        <Script
          src="https://cdn.jsdelivr.net/gh/Joao-Aquino/webflow-scripts@refs/heads/main/keep/navbar-color-change.js"
          strategy="afterInteractive"
        />
      </body>
      <Analytics />
    </html>
  );
}
