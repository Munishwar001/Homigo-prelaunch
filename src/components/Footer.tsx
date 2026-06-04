export default function Footer() {
  return (
    <footer className="border-t border-slate-100 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <span>
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold text-orange-500">Homigo</span>. All rights reserved.
        </span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-800 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-slate-800 transition-colors">
            Terms of Service
          </a>
          <a href="mailto:hello@homigo.com" className="hover:text-slate-800 transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
