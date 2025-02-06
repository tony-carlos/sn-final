import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/Header1";
import Content from "@/components/pages/terms/Content";
import PageHeader from "@/components/pages/terms/PageHeader";
import React from "react";
import PHeader from "./PHeader";
import Header2 from "@/components/layout/header/Header2";

export const metadata = {
  title: "Terms || ViaTour - Travel & Tour React NextJS Template",
  description: "ViaTour - Travel & Tour React NextJS Template",
};

export default function page() {
  return (
    <>
      <main>
        <Header2 />
        <PHeader />
        <Content />
        <FooterOne />
      </main>
    </>
  );
}
