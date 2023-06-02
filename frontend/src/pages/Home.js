import { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import formatBytes from "../util/formatBytes";
import download from "downloadjs";
import Page from "./Page";
import formatDate from "../util/formatDate";
import {
  ArrowDownTrayIcon,
  ArrowUpOnSquareIcon,
  GlobeAltIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFileActions } from "../actions/file";
import { useUserActions } from "../actions/user";
import { Tooltip } from "react-tooltip";
import UploadDialog from "../components/UploadDialog";

export default function Home() {
  const [entities, setEntities] = useState([]);
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState();
  const [privateFile, setPrivateFile] = useState(true);
  const { accessToken } = useAuth();
  const hiddenFileInput = useRef(null);
  const file = useFileActions();
  const user = useUserActions();

  useEffect(() => {
    if (accessToken === "loading") return;

    setLoading(true);
    fetchData();
  }, [accessToken]);

  async function fetchData() {
    const files = await file.getAllMetadata();
    files.map((entity) => {
      entity.name = entity.name.split("/").slice(1).join("/");
      return entity;
    });
    setEntities(files);

    const userData = await user.getData();
    setEmail(userData.email);

    setLoading(false);
  }

  async function handleDownload() {
    const blob = await file.get(focused.name);
    download(blob, focused.name);
  }

  async function handleDelete(event) {
    event.preventDefault();

    await toast.promise(
      file.remove(focused.name),
      {
        pending: "Deleting file...",
        success: "File deleted successfully!",
        error: "Sorry, we ran into an error",
      },
      {
        position: toast.POSITION.BOTTOM_RIGHT,
        hideProgressBar: true,
      }
    );
    setFocused(null);
    fetchData();
  }

  async function handleFileChange(event) {
    const uploadedFile = event.target.files[0];
    const twoMb = 2e6;
    if (uploadedFile.size > twoMb) {
      toast.error("File size cannot be greater than 2 MB", {
        position: toast.POSITION.BOTTOM_RIGHT,
        hideProgressBar: true,
      });
      return;
    }
    setUploadedFile(event.target.files[0]);
    setPrivateFile(true);
    setDialogOpen(true);
    event.target.value = "";
  }

  async function handleUpload() {
    setDialogOpen(false);
    await toast.promise(
      file.upload(uploadedFile, privateFile),
      {
        pending: "Uploading file...",
        success: "File uploaded successfully!",
        error: "Sorry, we ran into an error",
      },
      {
        position: toast.POSITION.BOTTOM_RIGHT,
        hideProgressBar: true,
      }
    );
    fetchData();
  }

  function copyShareLink(event) {
    event.preventDefault();

    const baseUrl = window.location.href;
    const id = focused.metadata.id;
    navigator.clipboard.writeText(baseUrl + "files/" + id);

    toast.success("File URL copied to clipboard!", {
      position: toast.POSITION.BOTTOM_RIGHT,
      hideProgressBar: true,
    });
  }

  if (accessToken === "loading") {
    return;
  }

  return (
    <Page name="Files" loading={loading} authenticated={true}>
      <UploadDialog
        fileName={uploadedFile?.name}
        show={dialogOpen}
        onClose={() => setDialogOpen(false)}
        isPrivate={privateFile}
        onPrivateChange={(isPrivate) => setPrivateFile(isPrivate)}
        onUpload={handleUpload}
      />
      <ToastContainer bodyClassName="toast" />

      <div className="mb-4 text-lg">
        Signed in as <span className="text-indigo-500">{email}</span>
      </div>
      <div className="flex">
        <input
          type="file"
          id="upload"
          ref={hiddenFileInput}
          onChange={handleFileChange}
          hidden
        />
        <button
          className="group relative flex align-middle inline-block justify-center mb-4 mr-2 py-2 pl-3 pr-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => hiddenFileInput.current.click()}
        >
          <ArrowUpOnSquareIcon
            className="block h-6 w-6 mr-2"
            aria-hidden="true"
          />
          <div className="mt-0.5 font-bold">Upload</div>
        </button>
        {focused && (
          <button
            className="group relative flex align-middle inline-block mr-2 justify-center mb-4 py-2 pl-3 pr-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={handleDownload}
            onMouseDown={(event) => event.preventDefault()}
          >
            <ArrowDownTrayIcon
              className="block h-6 w-6 mr-2"
              aria-hidden="true"
            />
            <div className="mt-0.5 font-bold">Download</div>
          </button>
        )}
        {focused && (
          <button
            className="group relative flex align-middle justify-center mr-2 mb-4 py-2 pl-3 pr-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={handleDelete}
            onMouseDown={(event) => event.preventDefault()}
          >
            <TrashIcon className="block h-6 w-6 mr-2" aria-hidden="true" />
            <div className="mt-0.5 font-bold">Delete</div>
          </button>
        )}
        {focused && !focused.metadata.iv && (
          <button
            className="group relative flex align-middle justify-center mb-4 py-2 pl-3 pr-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={copyShareLink}
            onMouseDown={(event) => event.preventDefault()}
          >
            <ShareIcon className="block h-6 w-6 mr-2" aria-hidden="true" />
            <div className="mt-0.5 font-bold">Copy Link</div>
          </button>
        )}
      </div>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Last Modified
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Size
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {entities.length === 0 && (
                    <tr className="bg-white">
                      <td colSpan={3} className="px-6 py-5 text-gray-700">
                        You haven't uploaded any files yet.
                      </td>
                    </tr>
                  )}
                  {entities.map((entity) => (
                    <tr
                      key={entity.id}
                      tabIndex={0}
                      onFocus={() => setFocused(entity)}
                      onBlur={() => setFocused(null)}
                      className="hover:bg-gray-100 bg-white focus:outline-none focus:bg-indigo-100 cursor-pointer"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {entity.name}
                            </div>
                          </div>
                          {entity.metadata.iv ? (
                            <LockClosedIcon
                              className="visibility-icon h-4 ml-3 text-gray-400 outline-none"
                              data-tooltip-content="Encrypted File"
                            />
                          ) : (
                            <GlobeAltIcon
                              className="visibility-icon h-4 ml-3 text-gray-400 outline-none"
                              data-tooltip-content="Public File"
                            />
                          )}
                          <Tooltip anchorSelect=".visibility-icon" />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(new Date(entity.updated))}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatBytes(Math.ceil(entity.size))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
