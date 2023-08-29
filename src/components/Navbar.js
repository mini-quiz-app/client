import Link from "next/link";

const Navbar = () => {
  return (
    <header className="bg-white">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img className="h-8 w-auto" src="/img/todo.png" alt="" />
          </a>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <Link
            href="/quizzes"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Quiz
          </Link>
          <Link
            href="/my-quizzes"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            My Quiz
          </Link>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end"></div>
      </nav>
    </header>
  );
};

export default Navbar;
