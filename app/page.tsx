import Header from "@/components/home/Header";
import SubHeader from "@/components/home/SubHeader";
import CardColumn from "@/components/home/CardColumn";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-[720px] px-6 pb-24">
      <Header />
      <SubHeader />
      <CardColumn />
    </main>
  );
}
