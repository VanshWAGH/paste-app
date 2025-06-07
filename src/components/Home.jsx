import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { addToPastes, updateToPastes } from '../redux/pasteSlice';
import toast from 'react-hot-toast';

const Home = () => {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const pasteId = searchParams.get("pasteId");
  const dispatch = useDispatch();
  const allPastes = useSelector((state) => state.paste.pastes);

  useEffect(() => {
    if (pasteId) {
      const paste = allPastes.find((p) => p._id === pasteId);
      if (paste) {
        setTitle(paste.title);
        setValue(paste.content);
      } else {
        toast.error("Paste not found");
        setSearchParams({});
      }
    }
  }, [pasteId, allPastes, setSearchParams]);

  async function createPaste() {
    if (!title.trim() || !value.trim()) {
      toast.error("Title and content cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      const paste = {
        title: title.trim(),
        content: value.trim(),
        _id: pasteId || Date.now().toString(36),
        createdAt: new Date().toISOString(),
      };

      if (pasteId) {
        dispatch(updateToPastes(paste));
        toast.success("Paste updated successfully");
      } else {
        dispatch(addToPastes(paste));
        toast.success("Paste created successfully");
      }

      setTitle('');
      setValue('');
      setSearchParams({});
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {pasteId ? "Edit Your Paste" : "Create New Paste"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {pasteId ? "Make changes to your existing paste" : "Start by adding a title and your content"}
        </p>
      </div>
      
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-grow w-full">
            <label htmlFor="paste-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Paste Title
            </label>
            <div className="relative">
              <input
                id="paste-title"
                className="w-full p-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                type="text"
                placeholder="My Awesome Paste"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
          </div>

          <button
            onClick={createPaste}
            disabled={isSubmitting}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-70 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {pasteId ? "Updating..." : "Creating..."}
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {pasteId ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  )}
                </svg>
                {pasteId ? "Update" : "Create"}
              </span>
            )}
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
        <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Paste Content
          </h2>
        </div>
        <div className="p-1">
          <textarea
            className="w-full p-4 focus:outline-none font-mono text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 min-h-[300px] resize-y"
            value={value}
            placeholder={`Enter your content here...\n\nYou can write multiple lines of text.\nMarkdown is supported!`}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-right text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600">
          {value.length} characters
        </div>
      </div>

      {pasteId && (
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setSearchParams({});
              setTitle('');
              setValue('');
            }}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 inline-flex items-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create new paste instead
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;