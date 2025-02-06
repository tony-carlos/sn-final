// app/(pages)/404/page.jsx
'use client';
import dynamic from 'next/dynamic';
import Image from "next/image";
import { useRouter } from 'next/navigation';

const Header1 = dynamic(() => import("@/components/layout/header/Header1"), {
  loading: () => <div className="h-20 bg-gray-100 animate-pulse"></div>,
  ssr: false
});

const FooterOne = dynamic(() => import("@/components/layout/footers/FooterOne"), {
  loading: () => <div className="h-60 bg-gray-100 animate-pulse"></div>,
  ssr: false
});

export default function NotFound() {
  const router = useRouter();

  return (
    <>
      <main>
        <Header1 />
        <section className="nopage mt-header">
          <div className="container">
            <div className="row y-gap-30 justify-between items-center">
              <div className="col-xl-6 col-lg-6">
                <Image
                  width="629"
                  height="481"
                  src="/img/404/1.svg"
                  alt="404 error illustration"
                  priority
                />
              </div>

              <div className="col-xl-5 col-lg-6">
                <div className="nopage__content pr-30 lg:pr-0">
                  <h1>
                    40<span className="text-accent-1">4</span>
                  </h1>
                  <h2 className="text-30 md:text-24 fw-700">
                    Oops! It looks like you&apos;re lost.
                  </h2>
                  <p>
                    The page you&apos;re looking for isn&apos;t available. Try to search
                    again or use the go to.
                  </p>

                  <button 
                    onClick={() => router.push('/')}
                    className="button -md -dark-1 bg-accent-1 text-white mt-25"
                  >
                    Go back to homepage
                    <i className="icon-arrow-top-right ml-10"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <FooterOne />
      </main>
    </>
  );
}