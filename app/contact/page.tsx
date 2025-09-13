export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      {/* Header */}
      <h1 className="text-5xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Contact Us
      </h1>
      <p className="text-center text-gray-600 mb-14 text-lg">
        We'd love to hear from you! Reach out using the details below.
      </p>

      {/* Info Section */}
      <div className="grid gap-8 sm:grid-cols-2">
        {/* Email */}
        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="font-semibold text-2xl mb-2 text-gray-900">
            Email us{" "}
          </h2>
          <a
            href="mailto:vardanshaswat@gmail.com"
            className="text-blue-600 hover:underline text-lg"
          >
            vardanshaswat@gmail.com
          </a>
        </div>

        {/* Phone */}
        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="font-semibold text-2xl mb-2 text-gray-900">Phone</h2>
          <a
            href="tel:+91XXXXXXXXXX"
            className="text-blue-600 hover:underline text-lg"
          >
            +91 XXXXXXXXXX
          </a>
        </div>

        {/* Address */}
        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="font-semibold text-2xl mb-2 text-gray-900">Address</h2>
          <address className="not-italic text-gray-700 text-lg">
            Bangalore, India
          </address>
        </div>

        {/* Social Media */}
        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="font-semibold text-2xl mb-4 text-gray-900">
            Social Media
          </h2>
          <ul className="space-y-2 text-lg">
            <li>
              <a
                href="https://twitter.com/VardanShaswat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Twitter
              </a>
            </li>
            {/* <li>
              <a
                href="https://facebook.com/Vardan Shaswat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Facebook
              </a>
            </li> */}
            <li>
              <a
                href="https://www.instagram.com/shaswatvardan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
