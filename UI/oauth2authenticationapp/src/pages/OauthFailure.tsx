import { useNavigate } from "react-router";

function OauthFailure() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
          <svg
            className="h-8 w-8 text-red-600 dark:text-red-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Authentication Failed
        </h1>

        {/* Description */}
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          We couldn’t complete the sign-in process. This may happen if the
          provider denied permission, the session expired, or something went
          wrong on our side.
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => navigate("/login")}
            className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition"
          >
            Try Again
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Go to Home
          </button>
        </div>

        {/* Help text */}
        <p className="mt-6 text-xs text-gray-500 dark:text-gray-500">
          If the problem persists, please contact support or try a different
          login method.
        </p>
      </div>
    </div>
  );
}

export default OauthFailure;
