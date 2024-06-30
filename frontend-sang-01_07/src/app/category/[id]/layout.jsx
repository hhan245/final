import Header from "../../../components/header";

export default function SectionLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
