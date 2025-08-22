export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
      <p className="text-center text-gray-700 mb-12">
        We'd love to hear from you! You can reach us using the information
        below.
      </p>

      <div className="space-y-6 text-lg text-gray-800">
        <div>
          <h2 className="font-semibold text-xl mb-1">Email</h2>
          <a href="" className="text-blue-600 hover:underline">
            contact @vardanshaswat@gmail.com
          </a>
        </div>

        <div>
          <h2 className="font-semibold text-xl mb-1">Phone</h2>
          <a href="" className="text-blue-600 hover:underline">
            9955404914
          </a>
        </div>

        <div>
          <h2 className="font-semibold text-xl mb-1">Address</h2>
          <address className="not-italic">
            Banglore,India
            <br />
            <br />
          </address>
        </div>

        <div>
          <h2 className="font-semibold text-xl mb-1">Social Media</h2>
          <ul className="list-disc list-inside space-y-1">
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
            <li>
              <a
                href="https://facebook.com/Vardan Shaswat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Facebook
              </a>
            </li>
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
