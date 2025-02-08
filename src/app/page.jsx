import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-bold mb-4">Welcome to League Grid Game!</h2>
        <div className="space-x-4">
          <a href="/game" className="bg-blue-500 text-white px-4 py-2 rounded">Play Game</a>
          <a href="/admin" className="bg-gray-500 text-white px-4 py-2 rounded">Admin</a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
