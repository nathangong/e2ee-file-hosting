import Navigation from "../components/Navigation";
import { CircularProgress } from "@material-ui/core";

interface PageProps {
  authenticated: boolean;
  children: React.ReactNode;
  loading: boolean;
  name: string;
}

export default function Page({
  authenticated,
  children,
  loading,
  name,
}: PageProps) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navigation authenticated={authenticated} />
      <header>
        <div className="max-w-7xl mx-auto pt-6 pb-3 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          {loading ? <CircularProgress /> : children}
        </div>
      </main>
    </div>
  );
}
