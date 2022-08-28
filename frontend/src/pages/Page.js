import React from "react";
import Navigation from "../components/Navigation";
import { CircularProgress} from "@material-ui/core";

export default function Page(props) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navigation />
      <header>
        <div className="max-w-7xl mx-auto pt-6 pb-3 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{props.name}</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          {props.loading ? <CircularProgress /> : props.children}
        </div>
      </main>
    </div>
  );
}