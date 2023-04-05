import { Disclosure } from "@headlessui/react";
import { useAuth } from "../contexts/AuthContext";

export default function Navigation(props) {
  const auth = useAuth();

  return (
    <Disclosure as="nav" className="bg-white shadow">
      <>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center h-full">
              <div className="flex-shrink-0">
                <img
                  className="h-9 w-9"
                  src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                  alt="Gong Drive Logo"
                />
              </div>
              <div className="ml-4 text-3xl font-bold">GongDrive</div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {props.authenticated && (
                <button
                  className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => {
                    auth.setAccessToken(null);
                  }}
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>

        <Disclosure.Panel className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1"></div>
        </Disclosure.Panel>
      </>
    </Disclosure>
  );
}
