import Navbar from "@/components/Navbar";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const MyQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [id, setId] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState({
    title: "",
    description: "",
  });
  const router = useRouter();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/user/my-quizzes", {
        headers: { authorization: "Bearer " + Cookies.get("token") },
      })
      .then((res) => {
        setQuizzes([...res.data]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [input, id]);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/quizzes/${id}`, {
        headers: { authorization: "Bearer " + Cookies.get("token") },
      })
      .then((res) => {
        setInput({ ...res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInput({ ...input, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (id === 0) {
      axios
        .post("http://localhost:8000/api/quizzes", input, {
          headers: { authorization: "Bearer " + Cookies.get("token") },
        })
        .then((res) => {
          setIsOpen(false);
          setInput({
            title: "",
            description: "",
          });
        })
        .then((error) => {
          console.log(error);
        });
    } else {
      axios
        .put(`http://localhost:8000/api/quizzes/${id}`, input, {
          headers: { authorization: "Bearer " + Cookies.get("token") },
        })
        .then((res) => {
          setIsOpen(false);
          setId(0);
          setInput({
            title: "",
            description: "",
          });
        })
        .then((error) => {
          console.log(error);
        });
    }
  };

  const handleDelete = () => {
    axios
      .delete(`http://localhost:8000/api/quizzes/${id}`, {
        headers: { authorization: "Bearer " + Cookies.get("token") },
      })
      .then((res) => {
        console.log(res.data);
        setId(0);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl p-6 lg:px-8 mb-10">
        <h1 className="font-bold text-3xl mb-5">My Quiz</h1>
        <button
          onClick={() => {
            setIsOpen(true);
          }}
          className="text-white text-sm bg-blue-600 hover:bg-blue-800 px-2 py-1 rounded-lg font-semibold mb-2"
        >
          Create Quiz
        </button>
        <div className="container mx-auto">
          {quizzes.map((quiz) => {
            return (
              <div
                className="min-w-0 p-4 bg-gray-200 rounded-lg shadow-xs mb-3"
                key={quiz.id}
              >
                <p className="font-bold text-xl">{quiz.title}</p>
                {console.log(quiz)}
                <p className="mb-2">{quiz.description}</p>
                <button
                  onClick={() => {
                    router.push(`/my-quizzes/${quiz.id}`);
                  }}
                  className="mr-1 text-white text-sm bg-green-600 hover:bg-green-800 px-2 py-1 rounded-lg font-semibold"
                >
                  Detail
                </button>
                <button
                  onClick={() => {
                    setId(quiz.id);
                    setIsOpen(true);
                  }}
                  className="mr-1 text-white text-sm bg-yellow-500 hover:bg-yellow-800 px-2 py-1 rounded-lg font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setId(quiz.id);
                    handleDelete();
                  }}
                  className="text-white text-sm bg-red-500 hover:bg-red-800 px-2 py-1 rounded-lg font-semibold"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {/* Modal */}
      {isOpen && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md w-1/2">
            <h2 className="text-2xl font-semibold mb-4">Quiz Form</h2>
            <form onSubmit={handleSubmit}>
              <input
                onChange={handleChange}
                value={input.title}
                type="text"
                name="title"
                className="mb-2 block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Title"
              />
              <input
                onChange={handleChange}
                value={input.description}
                type="text"
                name="description"
                className="mb-2 block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Description"
              />
              <button
                onClick={() => {
                  setIsOpen(false);
                  setId(0);
                  setInput({
                    title: "",
                    description: "",
                  });
                }}
                className="mr-1 text-white text-sm bg-red-600 hover:bg-red-800 px-2 py-1 rounded-lg font-semibold"
              >
                Close
              </button>
              <button
                type="submit"
                className="text-white text-sm bg-green-600 hover:bg-green-800 px-2 py-1 rounded-lg font-semibold"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MyQuizzes;
