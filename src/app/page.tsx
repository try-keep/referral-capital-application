'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function HomePage() {
  useEffect(() => {
    // Initialize Webflow interactions if needed
    if (typeof window !== 'undefined') {
      // Any necessary initialization
    }
  }, []);

  return (
    <>
      {/* Homepage specific styles to override Tailwind */}
      <style jsx global>{`
        body {
          background: white !important;
          margin: 0 !important;
          padding: 0 !important;
          font-family: Inter, sans-serif !important;
        }
        * {
          box-sizing: border-box;
        }
        /* Add scroll padding for FAQ anchor links to account for fixed navbar */
        html {
          scroll-padding-top: 7rem;
          scroll-behavior: smooth;
        }
      `}</style>

      <div className="page-wrapper">
        <div className="global-styles w-embed">
          <style
            dangerouslySetInnerHTML={{
              __html: `
            /* Make text look crisper and more legible in all browsers */
            body {
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              font-smoothing: antialiased;
              text-rendering: optimizeLegibility;
            }
            /* Focus state style for keyboard navigation for the focusable elements */
            *[tabindex]:focus-visible,
              input[type="file"]:focus-visible {
               outline: 0.125rem solid #4d65ff;
               outline-offset: 0.125rem;
            }
            /* Set color style to inherit */
            .inherit-color * {
                color: inherit;
            }
            /* Get rid of top margin on first element in any rich text element */
            .w-richtext > :not(div):first-child, .w-richtext > div:first-child > :first-child {
              margin-top: 0 !important;
            }
            /* Get rid of bottom margin on last element in any rich text element */
            .w-richtext>:last-child, .w-richtext ol li:last-child, .w-richtext ul li:last-child {
              margin-bottom: 0 !important;
            }
            /* Custom utility classes */
            .hide {
              display: none !important;
            }
            .margin-0 {
              margin: 0rem !important;
            }
            .padding-0 {
              padding: 0rem !important;
            }
            .spacing-clean {
              padding: 0rem !important;
              margin: 0rem !important;
            }
            .margin-top {
              margin-right: 0rem !important;
              margin-bottom: 0rem !important;
              margin-left: 0rem !important;
            }
            .padding-top {
              padding-right: 0rem !important;
              padding-bottom: 0rem !important;
              padding-left: 0rem !important;
            }
            .margin-right {
              margin-top: 0rem !important;
              margin-bottom: 0rem !important;
              margin-left: 0rem !important;
            }
            .padding-right {
              padding-top: 0rem !important;
              padding-bottom: 0rem !important;
              padding-left: 0rem !important;
            }
            .margin-bottom {
              margin-top: 0rem !important;
              margin-right: 0rem !important;
              margin-left: 0rem !important;
            }
            .padding-bottom {
              padding-top: 0rem !important;
              padding-right: 0rem !important;
              padding-left: 0rem !important;
            }
            .margin-left {
              margin-top: 0rem !important;
              margin-right: 0rem !important;
              margin-bottom: 0rem !important;
            }
            .padding-left {
              padding-top: 0rem !important;
              padding-right: 0rem !important;
              padding-bottom: 0rem !important;
            }
            .margin-horizontal {
              margin-top: 0rem !important;
              margin-bottom: 0rem !important;
            }
            .padding-horizontal {
              padding-top: 0rem !important;
              padding-bottom: 0rem !important;
            }
            .margin-vertical {
              margin-right: 0rem !important;
              margin-left: 0rem !important;
            }
            .padding-vertical {
              padding-right: 0rem !important;
              padding-left: 0rem !important;
            }
            .fs-table_header p {
              display: -webkit-box;
              overflow: hidden;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
          `,
            }}
          />
        </div>

        {/* Navigation */}
        <div
          data-animation="default"
          data-collapse="medium"
          data-duration="400"
          data-easing="ease"
          data-easing2="ease"
          role="banner"
          className="navbar back-light w-nav"
        >
          <div className="container-large is-navbar back-light-2">
            <div className="navbar_component back-light-3">
              <a
                aria-label="Link to Keep Homepage"
                id="w-node-_497b9016-2905-0b50-62b6-c2f15a8cb6fa-7e3ea030"
                href="https://www.trykeep.com"
                target="_blank"
                className="navbar_brand-wrapper back-light-4 w-nav-brand"
              >
                <div className="navbar_brand-image back-light-5 w-embed">
                  <svg
                    className="responsive-svg"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 105 30"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path
                      fill="currentcolor"
                      d="m39.0965 17.9081-1.5344 1.5875v5.1595h-3.8362V.842106h3.8362V14.8857l5.5853-5.49533h4.8182l-6.0457 6.04483 6.4549 9.2199h-4.6443l-4.634-6.747Zm19.1196 7.4797c-5.6263 0-9.1453-3.6024-9.1453-8.365 0-4.7626 3.4985-8.36513 8.5111-8.36513 1.0937-.016 2.1795.18753 3.1924.59843 1.0128.41089 1.9321 1.0207 2.7027 1.793.7706.7723 1.3768 1.6913 1.7823 2.7019.4055 1.0106.6021 2.0923.5779 3.1802v.9769H53.1217c.3376 2.8087 2.271 4.4268 5.1558 4.4268 1.948.022 3.8288-.7074 5.2478-2.0353l2.0868 2.3508c-2.018 1.8274-4.668 2.8082-7.396 2.7374Zm-4.9409-10.0442h8.4701c-.5115-2.1676-2.0459-3.5617-4.2044-3.5617-2.1584 0-3.744 1.3636-4.2657 3.5617Zm23.4459 10.0442c-5.6263 0-9.1453-3.6024-9.1453-8.365 0-4.7626 3.4985-8.36513 8.5008-8.36513 1.0938-.016 2.1795.18753 3.1924.59843 1.0129.41089 1.9321 1.0207 2.7027 1.793.7706.7723 1.3768 1.6913 1.7823 2.7019.4056 1.0106.6021 2.0923.5779 3.1802v.9769H71.6267c.3376 2.8087 2.271 4.4268 5.1557 4.4268 1.948.022 3.8289-.7074 5.2479-2.0353l2.0868 2.3508c-2.018 1.8274-4.668 2.8082-7.396 2.7374Zm-4.941-10.0442h8.4702c-.5115-2.1676-2.0459-3.5617-4.2044-3.5617-2.1584 0-3.744 1.3636-4.2658 3.5617Zm18.751 7.0523v8.762H86.695V9.39034h3.6213v2.41186c.7118-.9466 1.6395-1.7114 2.7065-2.23158 1.0671-.52016 2.2431-.78076 3.4313-.76034 4.3889 0 7.6719 3.60252 7.6719 8.18192 0 4.4878-3.283 8.243-7.6719 8.243-1.1395.0069-2.2655-.2453-3.292-.7374-1.0265-.492-1.9264-1.211-2.631-2.1019Zm4.7875-.5088c1.3023 0 2.5512-.5146 3.472-1.4307.9209-.9161 1.4384-2.1585 1.4384-3.454s-.5175-2.538-1.4384-3.4541c-.9208-.916-2.1697-1.4307-3.472-1.4307-1.3023 0-2.5512.5147-3.4721 1.4307-.9208.9161-1.4382 2.1586-1.4382 3.4541s.5174 2.5379 1.4382 3.454c.9209.9161 2.1698 1.4307 3.4721 1.4307Zm-73.28-11.0005-2.7927-2.70696 3.1047-3.16998 2.7927 2.70186c.8194.79316 1.4741 1.73916 1.9261 2.78388.4519 1.0448.6926 2.1678.7083 3.3051.0157 1.1373-.194 2.2665-.617 3.3232-.423 1.0567-1.0511 2.0201-1.8484 2.8353-.7973.8152-1.7482 1.4662-2.7984 1.9158s-2.1791.6891-3.3223.7047c-2.3088.0315-4.5357-.8507-6.1907-2.4526L10.2083 17.42l3.1047-3.17 2.7926 2.7018c.6021.5857 1.3658.9797 2.1938 1.132.8281.1522 1.6829.0557 2.4556-.2771.5135-.2183.9778-.5367 1.3657-.9363.5887-.5989.9848-1.3586 1.1378-2.1824.1531-.8237.0561-1.6741-.2785-2.4428-.2195-.5108-.5398-.9728-.9414-1.3586Zm-6.9663-4.00474c-1.655-1.60184-3.8818-2.48406-6.19063-2.45257-2.30883.03149-4.51053.97411-6.12073 2.62048C1.15073 8.69615.263904 10.9114.295558 13.2083c.031654 2.2968.979192 4.4871 2.634162 6.0889l2.79272 2.702 3.1047-3.17-2.79272-2.7223c-.59982-.5817-1.01352-1.3266-1.18915-2.1414-.17563-.8147-.10536-1.6629.20199-2.4381.20356-.518.51168-.989.90533-1.384.38906-.39945.85301-.71925 1.36566-.9413.51404-.21992 1.06697-.33581 1.62651-.34091.55854-.00779 1.11314.09429 1.63184.30037.5188.20608.9915.51209 1.391.90044l.0024-.0025 2.7901 2.6993 3.1047-3.16996-2.7925-2.70698Z"
                    ></path>
                  </svg>
                </div>
              </a>
              <div
                role="navigation"
                id="w-node-_497b9016-2905-0b50-62b6-c2f15a8cb6fc-7e3ea030"
                className="navbar_navmenu back-light-6 w-nav-menu"
              >
                <div>
                  <a
                    href="#why-keep"
                    aria-label="Link to Why Keep Section"
                    className="navbar_navlink w-nav-link"
                  >
                    Why Keep
                  </a>
                </div>
                <div>
                  <a
                    href="#how-it-works"
                    aria-label="Link to How it Works Section"
                    className="navbar_navlink w-nav-link"
                  >
                    How it Works
                  </a>
                </div>
                <div>
                  <a
                    href="#solutions"
                    aria-label="Link to Solutions"
                    className="navbar_navlink w-nav-link"
                  >
                    Solutions
                  </a>
                </div>
                <div>
                  <a
                    href="#faq"
                    aria-label="Link to FAQ Section"
                    className="navbar_navlink w-nav-link"
                  >
                    FAQ
                  </a>
                </div>
                <div>
                  <a
                    href="#testimonials"
                    aria-label="Link to Testimonials Section"
                    className="navbar_navlink w-nav-link"
                  >
                    Testimonials
                  </a>
                </div>
              </div>
              <div className="navbar_right-content-wrapper back-light-7">
                <a
                  href="https://app.trykeep.com/login"
                  aria-label="Log in"
                  target="_blank"
                  className="navbar_navlink w-nav-link"
                >
                  Log in
                </a>
                <a
                  aria-label="Apply Now"
                  href="/step/1"
                  className="button hide-tablet back-light-8 w-inline-block"
                >
                  <div>Apply Now</div>
                </a>
              </div>
              <div
                id="w-node-_497b9016-2905-0b50-62b6-c2f15a8cb717-7e3ea030"
                className="navbar_menu-button back-light-9 w-nav-button"
              >
                <div className="menu-icon back-light-10">
                  <div className="menu-icon2_line-top back-light-11"></div>
                  <div className="menu-icon2_line-middle back-light-12">
                    <div className="menu-icon2_line-middle-inner back-light-13"></div>
                  </div>
                  <div className="menu-icon2_line-bottom back-light-14"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="main-wrapper">
          {/* Header Section */}
          <header className="section_header-capital-loan">
            <div className="padding-global">
              <div className="container-large">
                <div className="header-capital-loan_padding-section">
                  <div className="w-layout-grid header-capital-loan_content">
                    <div className="header-capital-loan_content-left">
                      <img
                        src="/images/trusted-by-seal-50K.svg"
                        loading="lazy"
                        alt="Trusted by 50,000+ Canadian Businesses"
                        className="header-card_bbb-badge"
                      />
                      <div className="spacer-large"></div>
                      <h1 className="heading-style-h2 text-color-gradient_yellow-pink-purple">
                        2,000 Canadian Businesses choose Keep each month
                      </h1>
                      <div className="spacer-small"></div>
                      <div className="heading-style-h3 text-weight-semibold">
                        Business Loans - Fast, Flexible, Honest
                      </div>
                      <div className="spacer-small"></div>
                      <div className="text-size-medium">
                        We lend money at rates that aren't predatory... And if
                        we can't finance your business ourselves, we have 30+
                        other lenders we partner with to get you there.
                      </div>
                      <div className="spacer-medium"></div>
                      <div className="header-capital-loan_list-component">
                        <div className="header-capital-loan_item">
                          <div className="header-capital-loan_icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="100%"
                              viewBox="0 0 24 25"
                              fill="none"
                              className="icon-embed-xsmall"
                            >
                              <circle
                                cx="12"
                                cy="12.5762"
                                r="11"
                                fill="#4ABD87"
                              ></circle>
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12 1.57617C5.92487 1.57617 1 6.50104 1 12.5762C1 18.6513 5.92487 23.5762 12 23.5762C18.0751 23.5762 23 18.6513 23 12.5762C23 6.50104 18.0751 1.57617 12 1.57617ZM16.7682 10.7164C17.1218 10.2921 17.0645 9.66151 16.6402 9.30795C16.2159 8.95438 15.5853 9.0117 15.2318 9.43598L10.9328 14.5948L8.70711 12.3691C8.31658 11.9785 7.68342 11.9785 7.29289 12.3691C6.90237 12.7596 6.90237 13.3927 7.29289 13.7833L10.2929 16.7833C10.4916 16.9819 10.7646 17.0879 11.0453 17.0751C11.326 17.0624 11.5884 16.9322 11.7682 16.7164L16.7682 10.7164Z"
                                fill="#CDF2E1"
                              ></path>
                            </svg>
                          </div>
                          <p>Borrow from $5K to $1.5M</p>
                        </div>
                        <div className="header-capital-loan_item">
                          <div className="header-capital-loan_icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="100%"
                              viewBox="0 0 24 25"
                              fill="none"
                              className="icon-embed-xsmall"
                            >
                              <circle
                                cx="12"
                                cy="12.5762"
                                r="11"
                                fill="#4ABD87"
                              ></circle>
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12 1.57617C5.92487 1.57617 1 6.50104 1 12.5762C1 18.6513 5.92487 23.5762 12 23.5762C18.0751 23.5762 23 18.6513 23 12.5762C23 6.50104 18.0751 1.57617 12 1.57617ZM16.7682 10.7164C17.1218 10.2921 17.0645 9.66151 16.6402 9.30795C16.2159 8.95438 15.5853 9.0117 15.2318 9.43598L10.9328 14.5948L8.70711 12.3691C8.31658 11.9785 7.68342 11.9785 7.29289 12.3691C6.90237 12.7596 6.90237 13.3927 7.29289 13.7833L10.2929 16.7833C10.4916 16.9819 10.7646 17.0879 11.0453 17.0751C11.326 17.0624 11.5884 16.9322 11.7682 16.7164L16.7682 10.7164Z"
                                fill="#CDF2E1"
                              ></path>
                            </svg>
                          </div>
                          <p>Same day approval</p>
                        </div>
                        <div className="header-capital-loan_item">
                          <div className="header-capital-loan_icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="100%"
                              viewBox="0 0 24 25"
                              fill="none"
                              className="icon-embed-xsmall"
                            >
                              <circle
                                cx="12"
                                cy="12.5762"
                                r="11"
                                fill="#4ABD87"
                              ></circle>
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12 1.57617C5.92487 1.57617 1 6.50104 1 12.5762C1 18.6513 5.92487 23.5762 12 23.5762C18.0751 23.5762 23 18.6513 23 12.5762C23 6.50104 18.0751 1.57617 12 1.57617ZM16.7682 10.7164C17.1218 10.2921 17.0645 9.66151 16.6402 9.30795C16.2159 8.95438 15.5853 9.0117 15.2318 9.43598L10.9328 14.5948L8.70711 12.3691C8.31658 11.9785 7.68342 11.9785 7.29289 12.3691C6.90237 12.7596 6.90237 13.3927 7.29289 13.7833L10.2929 16.7833C10.4916 16.9819 10.7646 17.0879 11.0453 17.0751C11.326 17.0624 11.5884 16.9322 11.7682 16.7164L16.7682 10.7164Z"
                                fill="#CDF2E1"
                              ></path>
                            </svg>
                          </div>
                          <p>
                            Fair rates; As low as 8%, based on your business
                          </p>
                        </div>
                        <div className="header-capital-loan_item">
                          <div className="header-capital-loan_icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="100%"
                              viewBox="0 0 24 25"
                              fill="none"
                              className="icon-embed-xsmall"
                            >
                              <circle
                                cx="12"
                                cy="12.5762"
                                r="11"
                                fill="#4ABD87"
                              ></circle>
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12 1.57617C5.92487 1.57617 1 6.50104 1 12.5762C1 18.6513 5.92487 23.5762 12 23.5762C18.0751 23.5762 23 18.6513 23 12.5762C23 6.50104 18.0751 1.57617 12 1.57617ZM16.7682 10.7164C17.1218 10.2921 17.0645 9.66151 16.6402 9.30795C16.2159 8.95438 15.5853 9.0117 15.2318 9.43598L10.9328 14.5948L8.70711 12.3691C8.31658 11.9785 7.68342 11.9785 7.29289 12.3691C6.90237 12.7596 6.90237 13.3927 7.29289 13.7833L10.2929 16.7833C10.4916 16.9819 10.7646 17.0879 11.0453 17.0751C11.326 17.0624 11.5884 16.9322 11.7682 16.7164L16.7682 10.7164Z"
                                fill="#CDF2E1"
                              ></path>
                            </svg>
                          </div>
                          <p>
                            Available to businesses with more than $10,000 per
                            month in revenue
                          </p>
                        </div>
                      </div>
                      <div className="spacer-medium hide-mobile-landscape"></div>
                      <div className="button-group hide-mobile-landscape">
                        <div className="card-cta">
                          <div className="card-cta_wrapper">
                            <a
                              href="/step/1"
                              className="button is-xlarge w-button"
                            >
                              Apply in Minutes
                            </a>
                            <a
                              href="/referral-meeting"
                              className="button is-secondary is-xlarge w-button"
                            >
                              Speak to a Lending Expert
                            </a>
                          </div>
                          <div className="spacer-xsmall"></div>
                          <p className="text-size-small text-color-secondary">
                            Applications do not impact your credit score
                            <sup>1</sup>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="header-capital-loan_image-wrapper">
                      <img
                        sizes="(max-width: 1764px) 100vw, 1764px"
                        srcSet="/images/cover-p-500.webp 500w, /images/cover-p-800.webp 800w, /images/cover-p-1080.webp 1080w, /images/cover-p-1600.webp 1600w, /images/cover.webp 1764w"
                        alt=""
                        src="/images/cover.webp"
                        loading="eager"
                        className="header-capital-loan_image"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Why Keep Section */}
          <section id="why-keep" className="section_capital-why">
            <div className="padding-global">
              <div className="container-large">
                <div className="padding-section-large">
                  <div className="capital-why_component">
                    <h2 className="heading-style-h2">Why Keep?</h2>
                    <div className="spacer-small"></div>
                    <p className="text-size-medium text-color-secondary">
                      One application - Multiple lenders. We give you the best
                      deal, whether it's from Keep or another lender.
                    </p>
                  </div>
                  <div className="spacer-xxlarge"></div>
                  <div className="w-layout-grid capital-why_list">
                    <div className="capital-why_item">
                      <div className="capita-why_icon-wrapper">
                        <img
                          src="/images/icon-honest_1icon-honest.webp"
                          loading="lazy"
                          alt=""
                          className="capital-why_image"
                        />
                      </div>
                      <div className="spacer-medium"></div>
                      <h3 className="heading-style-h4">
                        We're making finance honest.
                      </h3>
                      <div className="spacer-xsmall"></div>
                      <p className="text-color-secondary">
                        We lend money at rates that aren't predatory
                      </p>
                    </div>
                    <div className="capital-why_item">
                      <div className="capita-why_icon-wrapper">
                        <img
                          src="/images/icon-application_1icon-application.webp"
                          loading="lazy"
                          alt=""
                          className="capital-why_image"
                        />
                      </div>
                      <div className="spacer-medium"></div>
                      <h3 className="heading-style-h4">
                        One application, 30+ lenders
                      </h3>
                      <div className="spacer-xsmall"></div>
                      <p className="text-color-secondary">
                        If we can't finance you, we work with 30+ other lenders
                      </p>
                    </div>
                    <div className="capital-why_item">
                      <div className="capita-why_icon-wrapper">
                        <img
                          src="/images/icon-fees_1icon-fees.webp"
                          loading="lazy"
                          alt=""
                          className="capital-why_image"
                        />
                      </div>
                      <div className="spacer-medium"></div>
                      <h3 className="heading-style-h4">We don't charge fees</h3>
                      <div className="spacer-xsmall"></div>
                      <p className="text-color-secondary">
                        We're not brokers. No loan origination fees.
                      </p>
                    </div>
                    <div className="capital-why_item">
                      <div className="capita-why_icon-wrapper">
                        <img
                          src="/images/icon-best-offer_1icon-best-offer.webp"
                          loading="lazy"
                          alt=""
                          className="capital-why_image"
                        />
                      </div>
                      <div className="spacer-medium"></div>
                      <h3 className="heading-style-h4">Best offer guarantee</h3>
                      <div className="spacer-xsmall"></div>
                      <p className="text-color-secondary">
                        If our partners can offer you a better loan, we'll share
                        their offer with you.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How it Works Section */}
          <section id="how-it-works" className="section_capital-works">
            <div className="padding-global">
              <div className="container-large">
                <div className="capital-wroks_outline">
                  <div className="capital-works_wrapper">
                    <div className="z-index-1">
                      <div className="capital-works_component">
                        <h2 className="heading-style-h2">
                          How it{' '}
                          <span className="text-color-gradient_yellow-pink-purple">
                            works
                          </span>
                        </h2>
                        <div className="spacer-small"></div>
                        <p className="text-size-medium text-color-secondary">
                          One application - Multiple lenders. We give you the
                          best deal, whether it's from Keep or another lender.
                        </p>
                      </div>
                      <div className="spacer-xxlarge"></div>
                      <div className="w-layout-grid capital-works_list">
                        <div className="capital-works_item">
                          <div className="card-works_image-wrapper">
                            <img
                              loading="lazy"
                              src="/images/offer-step-01_1offer-step-01.webp"
                              alt=""
                              className="card-benefits_icon"
                            />
                          </div>
                          <div className="spacer-medium"></div>
                          <h3 className="heading-style-h4">Apply in Minutes</h3>
                          <div className="spacer-xsmall"></div>
                          <p className="text-color-secondary">
                            Minimal paperwork required. Just some business
                            details, and your recent bank statement.
                          </p>
                        </div>
                        <div className="capital-works_item _02">
                          <div className="card-works_image-wrapper">
                            <img
                              loading="lazy"
                              src="/images/offer-step-02_1offer-step-02.webp"
                              alt=""
                              className="card-benefits_icon"
                            />
                          </div>
                          <div className="spacer-medium"></div>
                          <h3 className="heading-style-h4">
                            We review your loan
                          </h3>
                          <div className="spacer-xsmall"></div>
                          <p className="text-color-secondary">
                            We might get in touch if we need to know a little
                            more about your business.
                          </p>
                        </div>
                        <div className="capital-works_item _03">
                          <div className="card-works_image-wrapper">
                            <img
                              loading="lazy"
                              src="/images/offer-step-03_1offer-step-03.webp"
                              alt=""
                              className="card-benefits_icon"
                            />
                          </div>
                          <div className="spacer-medium"></div>
                          <h3 className="heading-style-h4">
                            Our partners review your loan
                          </h3>
                          <div className="spacer-xsmall"></div>
                          <p className="text-color-secondary">
                            Up to 30+ other lenders review your loan at same
                            time.
                          </p>
                        </div>
                        <div className="capital-works_item _04">
                          <div className="card-works_image-wrapper">
                            <img
                              loading="lazy"
                              src="/images/offer-step-04_1offer-step-04.webp"
                              alt=""
                              className="card-benefits_icon"
                            />
                          </div>
                          <div className="spacer-medium"></div>
                          <h3 className="heading-style-h4">
                            We surface the best offer to you
                          </h3>
                          <div className="spacer-xsmall"></div>
                          <p className="text-color-secondary">
                            Even if it not us financing your business, we will
                            always give you the best offer.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="capital-works-gradient_background"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="capital-works_background"></div>
          </section>

          {/* Solutions Section */}
          <section id="solutions" className="section_capital-solutions">
            <div className="padding-global">
              <div className="container-large">
                <div className="padding-section-large padding-top">
                  <div className="capital-solutions_component">
                    <h2 className="heading-style-h2">
                      One platform
                      <br />
                      <span className="text-color-gradient_yellow-pink-purple">
                        A range of funding solutions
                      </span>
                    </h2>
                  </div>
                  <div className="spacer-xxlarge"></div>
                  <div className="w-layout-grid capital-solutions_row">
                    <div className="capital-solutions_card">
                      <div className="capital-solutions_card-content">
                        <h3 className="heading-style-h4">Business Loans</h3>
                        <div className="spacer-xsmall"></div>
                        <p className="text-color-secondary">
                          One off lump sum for big or small business plans. From
                          $5K to $1.5M.
                        </p>
                      </div>
                      <div className="capital-solutions_card-image-wrapper">
                        <img
                          sizes="(max-width: 832px) 100vw, 832px"
                          srcSet="/images/industries-features_00001-p-500.webp 500w, /images/industries-features_00001.webp 832w"
                          alt=""
                          src="/images/industries-features_00001.webp"
                          loading="lazy"
                          className="capital-solutions_card-image"
                        />
                        <a
                          href="/step/1"
                          className="capital-solutions_button hide-mobile-landscape w-button"
                        >
                          Apply
                        </a>
                      </div>
                    </div>
                    <div className="capital-solutions_card">
                      <div className="capital-solutions_card-content">
                        <h3 className="heading-style-h4">Lines of Credit</h3>
                        <div className="spacer-xsmall"></div>
                        <p className="text-color-secondary">
                          Ongoing access to funds with interest only paid on
                          what you use, and no monthly or annual fees.
                        </p>
                      </div>
                      <div className="capital-solutions_card-image-wrapper">
                        <img
                          sizes="(max-width: 832px) 100vw, 832px"
                          srcSet="/images/industries-features_00002-p-500.webp 500w, /images/industries-features_00002.webp 832w"
                          alt=""
                          src="/images/industries-features_00002.webp"
                          loading="lazy"
                          className="capital-solutions_card-image"
                        />
                        <a
                          href="/step/1"
                          className="capital-solutions_button hide-mobile-landscape w-button"
                        >
                          Apply
                        </a>
                      </div>
                    </div>
                    <div className="capital-solutions_card">
                      <div className="capital-solutions_card-content">
                        <h3 className="heading-style-h4">
                          Business Credit Card
                        </h3>
                        <div className="spacer-xsmall"></div>
                        <p className="text-color-secondary">
                          More rewards than Amex and the Big 5 Banks and the
                          most interest free days in Canada.
                        </p>
                      </div>
                      <div className="capital-solutions_card-image-wrapper">
                        <img
                          sizes="(max-width: 832px) 100vw, 832px"
                          srcSet="/images/industries-features_00003-p-500.webp 500w, /images/industries-features_00003-p-800.webp 800w, /images/industries-features_00003.webp 832w"
                          alt=""
                          src="/images/industries-features_00003.webp"
                          loading="lazy"
                          className="capital-solutions_card-image"
                        />
                        <a
                          href="/step/1"
                          className="capital-solutions_button hide-mobile-landscape w-button"
                        >
                          Apply
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="section_capital-faq">
            <div className="padding-global">
              <div className="container-large">
                <div className="padding-section-large padding-top">
                  <div className="capital-solutions_component">
                    <h2 className="heading-style-h2">
                      Frequently Asked Questions
                    </h2>
                  </div>
                  <div className="spacer-xxlarge"></div>
                  <div className="capital-faq_component">
                    <div className="capital-faq_sidebar">
                      <div className="capital-faq_sidebar-heading">
                        <div className="heading-style-h5 text-weight-bold">
                          Jump to Question
                        </div>
                        <div className="capital-faq_accordion-icon w-embed">
                          <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M2.55806 6.29544C2.46043 6.19781 2.46043 6.03952 2.55806 5.94189L3.44195 5.058C3.53958 4.96037 3.69787 4.96037 3.7955 5.058L8.00001 9.26251L12.2045 5.058C12.3021 4.96037 12.4604 4.96037 12.5581 5.058L13.4419 5.94189C13.5396 6.03952 13.5396 6.19781 13.4419 6.29544L8.17678 11.5606C8.07915 11.6582 7.92086 11.6582 7.82323 11.5606L2.55806 6.29544Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </div>
                      </div>
                      <div className="spacer-xsmall"></div>
                      <div className="capital-faq_link-content">
                        <div className="capital-faq_link-wrapper is-h3">
                          <a
                            href="#business-eligible"
                            className="capital-faq_link is-h3 w-inline-block"
                          >
                            <div>Is my business eligible?</div>
                          </a>
                        </div>
                        <div className="capital-faq_link-wrapper is-h3">
                          <a
                            href="#how-apply"
                            className="capital-faq_link is-h3 w-inline-block"
                          >
                            <div>How do I apply?</div>
                          </a>
                        </div>
                        <div className="capital-faq_link-wrapper is-h3">
                          <a
                            href="#how-much-borrow"
                            className="capital-faq_link is-h3 w-inline-block"
                          >
                            <div>How much can I borrow?</div>
                          </a>
                        </div>
                        <div className="capital-faq_link-wrapper is-h3">
                          <a
                            href="#interest-rate"
                            className="capital-faq_link is-h3 w-inline-block"
                          >
                            <div>What is the interest rate?</div>
                          </a>
                        </div>
                        <div className="capital-faq_link-wrapper is-h3">
                          <a
                            href="#any-fees"
                            className="capital-faq_link is-h3 w-inline-block"
                          >
                            <div>Are there any fees?</div>
                          </a>
                        </div>
                        <div className="capital-faq_link-wrapper is-h3">
                          <a
                            href="#repayment-periods"
                            className="capital-faq_link is-h3 w-inline-block"
                          >
                            <div>What are your repayment periods?</div>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="max-width-large">
                      <div className="text-rich-text w-richtext">
                        <h3 id="business-eligible">Is my business eligible?</h3>
                        <p>
                          We work hard to find a funding solution for every
                          Canadian business. Your businesses eligibility depends
                          on a few factor;
                        </p>
                        <ul role="list">
                          <li>For most industries, 6 months trading history</li>
                          <li>Minimum monthly turnover of $10K</li>
                          <li>A minimum credit score of 560</li>
                          <li>Incorporated in Canada</li>
                        </ul>
                        <p>
                          We're here to help, so feel free to get in touch and
                          our team will check if you qualify.
                        </p>
                        <h3 id="how-apply">How do I apply?</h3>
                        <p>
                          Simply complete our online form in as little as 10
                          minutes and get a decision within a business day –
                          often just a few hours. For all applications, you'll
                          need:
                        </p>
                        <ul role="list">
                          <li>
                            Your driver's license, or other official
                            identification
                          </li>
                          <li>Some basic business details</li>
                          <li>Bank statements</li>
                          <li>
                            Some basic financial statements like a P&L and
                            cashflow, for loan amounts above $150K
                          </li>
                        </ul>
                        <h3 id="how-much-borrow">How much can I borrow?</h3>
                        <p>
                          The amount you can borrow depends on several factors,
                          including the financial health of your business,
                          revenue projections and creditworthiness. In our
                          application form, we ask for how much you'd like to
                          borrow. We generally try to offer you the maximum
                          amount possible, and let you tell us if you need a
                          little less.
                        </p>
                        <h3 id="interest-rate">What is the interest rate?</h3>
                        <p>
                          Interest rates for term loans range between 8% and
                          29%, cents on the dollar (This means the amount of
                          interest paid ranges from $0.08 to $0.29 for each
                          dollar borrowed).
                        </p>
                        <p>
                          When you apply for our business loan, we will assess
                          the risk profile of your business and provide you with
                          a customised offer including loan amount, term and
                          interest rate.
                        </p>
                        <p>
                          We take into account your industry, how long you've
                          been in business, your credit history and the health
                          of your cash flow.
                        </p>
                        <h3 id="any-fees">Are there any fees?</h3>
                        <p>
                          We don't charge any hidden fees. You can apply for a
                          loan with Keep, with no upfront cost or obligation to
                          proceed. We also don't charge for our best offer
                          guarantee - where we help find you the best loan
                          between Keep and other lenders, irrespective of who
                          funds your business.
                        </p>
                        <h3 id="repayment-periods">
                          What are your repayment periods?
                        </h3>
                        <p>
                          We have monthly, weekly, and daily repayment options
                          for our loans. The frequency of payments depends on
                          the size of the loan and the credit worthiness of your
                          business.
                        </p>
                        <p>
                          If we deem a large loan is a little riskier, it's
                          likely that both Keep and other lenders will offer a
                          loan with more frequent repayment periods.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="section_senja">
            <div className="padding-section-large">
              <div className="senja_component">
                <div className="padding-global">
                  <div className="text-align-center">
                    <div className="max-width-large align-center">
                      <div className="title-rich-text w-richtext">
                        <h2>
                          Canadian Businessses <strong>Love Keep</strong>
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="spacer-xlarge"></div>
                <div className="w-embed w-script">
                  <Script
                    src="https://widget.senja.io/widget/2e9a638c-e8dd-42fe-be3d-fc791332df87/platform.js"
                    strategy="afterInteractive"
                  />
                  <div
                    className="senja-embed"
                    data-id="2e9a638c-e8dd-42fe-be3d-fc791332df87"
                    data-mode="shadow"
                    data-lazyload="false"
                    style={{ display: 'block', width: '100%' }}
                  ></div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="footer_component">
          <div className="padding-global">
            <div className="container-large">
              <div className="padding-vertical padding-xxlarge">
                <div className="padding-xxlarge padding-bottom">
                  <div className="footer_wrapper">
                    <a
                      href="#"
                      aria-label="Link to Keep Homepage"
                      className="footer_logo-link w-nav-brand"
                    >
                      <svg
                        fill="none"
                        viewBox="0 0 152 44"
                        width="100%"
                        aria-label="Link to Keep Homepage"
                        className="footer_logo"
                      >
                        <g fill="currentColor" clipPath="url(#a)">
                          <path
                            d="m57.061 24.77-2.231 2.303v7.489h-5.58V0h5.58v20.383l8.123-7.976h7.008l-8.793 8.773 9.388 13.382H63.8l-6.74-9.793.001.001Zm27.807 10.855c-8.182 0-13.3-5.229-13.3-12.141s5.088-12.14 12.378-12.14c1.591-.024 3.17.271 4.644.868a11.844 11.844 0 0 1 3.93 2.602 11.693 11.693 0 0 1 3.433 8.537v1.418H77.46c.49 4.076 3.302 6.425 7.498 6.425a11.002 11.002 0 0 0 7.632-2.954l3.035 3.412a15.448 15.448 0 0 1-10.757 3.973Zm-7.185-14.578h12.319c-.744-3.146-2.976-5.17-6.115-5.17-3.14 0-5.446 1.98-6.204 5.17Zm34.099 14.578c-8.183 0-13.3-5.229-13.3-12.141s5.088-12.14 12.363-12.14a11.884 11.884 0 0 1 8.574 3.47 11.75 11.75 0 0 1 2.592 3.921c.59 1.467.876 3.037.84 4.616v1.418h-18.477c.49 4.076 3.302 6.425 7.498 6.425a11 11 0 0 0 7.632-2.954l3.035 3.412a15.45 15.45 0 0 1-10.757 3.973Zm-7.186-14.578h12.32c-.744-3.146-2.976-5.17-6.115-5.17-3.14 0-5.446 1.98-6.205 5.17Zm27.272 10.236V44h-5.579V12.407h5.266v3.5a10.9 10.9 0 0 1 3.937-3.238 10.975 10.975 0 0 1 4.99-1.104c6.383 0 11.159 5.229 11.159 11.875 0 6.514-4.776 11.964-11.159 11.964a10.945 10.945 0 0 1-4.788-1.07 10.85 10.85 0 0 1-3.826-3.051Zm6.963-.739c1.893 0 3.71-.746 5.049-2.076a7.067 7.067 0 0 0 2.092-5.013c0-1.88-.753-3.684-2.092-5.013a7.168 7.168 0 0 0-5.049-2.077 7.168 7.168 0 0 0-5.05 2.077 7.067 7.067 0 0 0-2.092 5.013c0 1.88.753 3.684 2.092 5.013a7.17 7.17 0 0 0 5.05 2.076ZM32.252 14.579l-4.061-3.93 4.515-4.6 4.062 3.921a12.57 12.57 0 0 1 2.801 4.04 12.494 12.494 0 0 1-2.555 13.736 12.666 12.666 0 0 1-4.07 2.78c-1.528.653-3.17 1-4.832 1.024a12.712 12.712 0 0 1-9.004-3.56l-4.061-3.929 4.515-4.6 4.062 3.92a6.207 6.207 0 0 0 6.762 1.24 6.085 6.085 0 0 0 1.986-1.358 6.108 6.108 0 0 0 1.655-3.167 6.081 6.081 0 0 0-.405-3.546 6.043 6.043 0 0 0-1.37-1.971Z"
                            fill="currentcolor"
                          ></path>
                          <path
                            d="M22.12 9.56a12.712 12.712 0 0 0-9.003-3.559 12.707 12.707 0 0 0-8.902 3.804A12.521 12.521 0 0 0 .63 18.743a12.527 12.527 0 0 0 3.832 8.837l4.061 3.922 4.516-4.6-4.062-3.952a6.125 6.125 0 0 1-1.73-3.108 6.095 6.095 0 0 1 .294-3.539 5.903 5.903 0 0 1 1.317-2.008 6.227 6.227 0 0 1 1.986-1.367 6.168 6.168 0 0 1 2.366-.494 6.21 6.21 0 0 1 2.373.436 6.158 6.158 0 0 1 2.023 1.307l.004-.004 4.058 3.918 4.515-4.601-4.061-3.93h-.002Z"
                            fill="currentcolor"
                          ></path>
                        </g>
                        <defs>
                          <clipPath id="a">
                            <path fill="currentColor" d="M0 0h152v44H0z"></path>
                          </clipPath>
                        </defs>
                      </svg>
                    </a>
                  </div>
                  <div className="spacer-medium"></div>
                  <div className="w-layout-grid footer_top-wrapper">
                    <div className="footer_content-wrapper">
                      <div className="text-size-small text-color-disabled">
                        This card is issued by Peoples Trust Company under
                        license from Mastercard International Incorporated.
                        <br />
                        <br />
                        Mastercard is a registered trademark, and the circles
                        design is a trademark of Mastercard International
                        Incorporated.
                        <br />
                        <br />
                        Keep is not available to residents or businesses in
                        Quebec.
                        <br />
                        <br />
                        <sup>1</sup>While applying and reviewing an offer will
                        not impact your personal credit score, accepting an
                        offer may result in a hard inquiry. At Keep, we partner
                        with credit agencies to help issue the best possible
                        terms and highest credit limit for our cardholders.
                      </div>
                      <div className="spacer-small"></div>
                      <div className="text-size-small text-color-disabled">
                        Contact us at{' '}
                        <a
                          href="mailto:support@trykeep.com"
                          className="footer_credit-link"
                        >
                          support@trykeep.com
                        </a>
                        <br />
                        For inquiries call/text{' '}
                        <a
                          href="tel:18664605337"
                          className="footer_credit-link"
                        >
                          +1-866-460-5337
                        </a>
                        <br />
                        51 Wolseley St. Toronto, ON M5T 1A5
                      </div>
                    </div>
                    <div className="footer_link-list">
                      <div className="text-size-small">Explore</div>
                      <a
                        href="https://www.trykeep.com/"
                        target="_blank"
                        className="footer_link"
                      >
                        Home
                      </a>
                      <a
                        href="https://help.trykeep.com/"
                        target="_blank"
                        className="footer_link"
                      >
                        Help Centre
                      </a>
                      <a href="tel:+18664605337" className="footer_link">
                        Call Us
                      </a>
                      <a
                        href="https://www.trykeep.com/careers"
                        target="_blank"
                        className="footer_link"
                      >
                        Jobs
                      </a>
                      <a
                        href="https://www.trykeep.com/media-coverage"
                        target="_blank"
                        className="footer_link"
                      >
                        Media Coverage
                      </a>
                      <a
                        href="https://www.trykeep.com/newsroom"
                        target="_blank"
                        className="footer_link"
                      >
                        Blog
                      </a>
                      <a
                        href="https://www.trykeep.com/legal/platform-agreement"
                        target="_blank"
                        className="footer_link"
                      >
                        Legal
                      </a>
                      <a href="/step/1" className="footer_link">
                        Apply Today
                      </a>
                    </div>
                  </div>
                </div>
                <div className="line-divider"></div>
                <div className="padding-top padding-medium">
                  <div className="footer_bottom-wrapper">
                    <div className="w-layout-grid footer2_social-list">
                      <a
                        aria-label="x"
                        href="https://x.com/Keep_Card"
                        target="_blank"
                        className="footer2_social-link w-inline-block"
                      >
                        <div className="icon-1x1-regular w-embed">
                          <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M17.1761 4H19.9362L13.9061 10.7774L21 20H15.4456L11.0951 14.4066L6.11723 20H3.35544L9.80517 12.7508L3 4H8.69545L12.6279 9.11262L17.1761 4ZM16.2073 18.3754H17.7368L7.86441 5.53928H6.2232L16.2073 18.3754Z"
                              fill="CurrentColor"
                            ></path>
                          </svg>
                        </div>
                      </a>
                      <a
                        aria-label="linkedin"
                        href="https://www.linkedin.com/company/trykeep/"
                        target="_blank"
                        className="footer2_social-link w-inline-block"
                      >
                        <svg
                          fill="none"
                          viewBox="0 0 800 800"
                          width="100%"
                          className="icon-1x1-regular"
                        >
                          <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M672 672H563.2V481.627c0-52.224-23.038-81.361-64.355-81.361-44.962 0-71.645 30.361-71.645 81.361V672H318.4V318.4h108.8v39.764s34.136-59.898 111.057-59.898C615.206 298.266 672 345.222 672 442.38V672ZM194.422 261.848c-36.692 0-66.422-29.972-66.422-66.937C128 157.973 157.73 128 194.422 128c36.666 0 66.395 29.973 66.395 66.911.028 36.965-29.729 66.937-66.395 66.937ZM128 672h136V318.4H128V672Z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </a>
                      <a
                        aria-label="instagram"
                        href="https://www.instagram.com/keep_hq/"
                        target="_blank"
                        className="footer2_social-link w-inline-block"
                      >
                        <div className="icon-1x1-regular w-embed">
                          <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M16 3H8C5.23858 3 3 5.23858 3 8V16C3 18.7614 5.23858 21 8 21H16C18.7614 21 21 18.7614 21 16V8C21 5.23858 18.7614 3 16 3ZM19.25 16C19.2445 17.7926 17.7926 19.2445 16 19.25H8C6.20735 19.2445 4.75549 17.7926 4.75 16V8C4.75549 6.20735 6.20735 4.75549 8 4.75H16C17.7926 4.75549 19.2445 6.20735 19.25 8V16ZM16.75 8.25C17.3023 8.25 17.75 7.80228 17.75 7.25C17.75 6.69772 17.3023 6.25 16.75 6.25C16.1977 6.25 15.75 6.69772 15.75 7.25C15.75 7.80228 16.1977 8.25 16.75 8.25ZM12 7.5C9.51472 7.5 7.5 9.51472 7.5 12C7.5 14.4853 9.51472 16.5 12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5027 10.8057 16.0294 9.65957 15.1849 8.81508C14.3404 7.97059 13.1943 7.49734 12 7.5ZM9.25 12C9.25 13.5188 10.4812 14.75 12 14.75C13.5188 14.75 14.75 13.5188 14.75 12C14.75 10.4812 13.5188 9.25 12 9.25C10.4812 9.25 9.25 10.4812 9.25 12Z"
                              fill="CurrentColor"
                            ></path>
                          </svg>
                        </div>
                      </a>
                      <a
                        aria-label="facebook"
                        href="https://www.facebook.com/people/Keep/100080028222444/"
                        target="_blank"
                        className="footer2_social-link w-inline-block"
                      >
                        <svg
                          fill="none"
                          viewBox="0 0 800 800"
                          width="100%"
                          className="icon-1x1-regular"
                        >
                          <path
                            fill="currentColor"
                            d="m578 71.07-98.902-.12c-95.911 0-157.867 63.541-157.867 161.994v74.641H222v135.07h99.231l-.119 286.446h138.84l.119-286.446h113.86l-.089-135.04H460.071v-63.332c0-30.455 7.21-45.862 46.849-45.862l70.781-.03L578 71.069Z"
                          ></path>
                        </svg>
                      </a>
                    </div>
                    <div className="w-layout-grid footer_social-list">
                      <div className="footer_credit-text">
                        <strong>©</strong>2025 Keep Technologies Corp. All
                        rights reserved
                      </div>
                      <a
                        href="https://www.trykeep.com/legal/privacy-policy"
                        target="_blank"
                        className="footer_credit-link"
                      >
                        Privacy Policy
                      </a>
                      <a
                        href="https://www.trykeep.com/legal/website-terms"
                        target="_blank"
                        className="footer_credit-link"
                      >
                        Terms of Service
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Fixed CTA */}
        <div className="card-fixed-cta_wrapper">
          <div className="button-group is-center z-index-999">
            <div className="card-cta center">
              <div className="card-cta_wrapper center-2">
                <a
                  href="/step/1"
                  className="button is-xlarge center-3 w-button"
                >
                  Apply in Minutes
                </a>
              </div>
              <div className="spacer-xsmall center-5"></div>
              <p className="text-size-small text-color-secondary center-6">
                Applications do not impact your credit score<sup>1</sup>
              </p>
            </div>
          </div>
          <div className="card-fixed_background"></div>
        </div>
      </div>
    </>
  );
}
