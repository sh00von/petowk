export default function VerifyRequest() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center space-y-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-blue-600 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 12H8m8 0l-4-4m4 4l-4 4m12-4a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <h2 className="text-2xl font-bold text-gray-800">Check Your Email</h2>

        <p className="text-gray-600 text-sm">
          A secure sign-in link has been sent to your email address.
        </p>

        <p className="text-gray-500 text-sm">
          Please check your inbox and click the link to complete your login process.
          If you don't see it, check your spam or junk folder.
        </p>

      </div>
    </div>
  );
}
