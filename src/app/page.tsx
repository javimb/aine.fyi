import SearchForm from "@/components/search-form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-2xl font-bold">Es un AINE?</h1>
      <SearchForm />
    </main>
  );
}
