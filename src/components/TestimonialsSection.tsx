export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            What our{' '}
            <span className="bg-gradient-to-r from-[#E28F43] via-[#F15379] to-[#914AE8] bg-clip-text text-transparent">
              customers
            </span>{' '}
            are saying
          </h2>
        </div>
        <script
          src="https://widget.senja.io/widget/61b3b291-c362-4a8d-8453-d60b24d292df/platform.js"
          type="text/javascript"
          async
        ></script>
        <div
          className="senja-embed"
          data-id="61b3b291-c362-4a8d-8453-d60b24d292df"
          data-mode="shadow"
          data-lazyload="false"
          style={{ display: 'block', width: '100%' }}
        />
      </div>
    </section>
  );
}
