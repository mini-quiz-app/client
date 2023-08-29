import Navbar from "@/components/Navbar";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";

const MyQuizDetail = () => {
  const router = useRouter();
  const { quizId } = router.query;

  const [quiz, setQuiz] = useState({});
  const [input, setInput] = useState({ question: "" });
  const [inputChoice, setInputChoice] = useState();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenChoice, setIsOpenChoice] = useState(false);
  const [id, setId] = useState(0);

  const choiceCount = [1, 2, 3, 4];

  let num = 1;

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/quizzes/${quizId}`, {
        headers: { Authorization: "Bearer " + Cookies.get("token") },
      })
      .then((res) => {
        setQuiz({ ...res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isOpen, id]);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInput({ ...input, [name]: value });
  };

  const handleChangeChoice = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputChoice({ ...inputChoice, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (id === 0) {
      axios
        .post(`http://localhost:8000/api/quizzes/${quizId}/question`, input, {
          headers: { Authorization: "Bearer " + Cookies.get("token") },
        })
        .then((res) => {
          console.log(res.data.message);
          setIsOpen(false);
          setInput({ question: "" });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .put(
          `http://localhost:8000/api/quizzes/${quizId}/question/${id}`,
          input,
          {
            headers: { Authorization: "Bearer " + Cookies.get("token") },
          }
        )
        .then((res) => {
          console.log(res.data.message);
          setIsOpen(false);
          setInput({ question: "" });
          setId(0);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleSubmitChoice = (event) => {
    event.preventDefault();
    axios
      .post(`http://localhost:8000/api/questions/${id}/choice`, inputChoice, {
        headers: { Authorization: "Bearer " + Cookies.get("token") },
      })
      .then((res) => {
        console.log(res.data.message);
        setId(0);
        setIsOpenChoice(false);
        setInput();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (questionId) => {
    axios
      .delete(
        `http://localhost:8000/api/quizzes/${quizId}/question/${questionId}`,
        {
          headers: { authorization: "Bearer " + Cookies.get("token") },
        }
      )
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
        <div className="container mx-auto">
          <div
            className="min-w-0 p-4 bg-gray-200 rounded-lg shadow-xs mb-4"
            key={quiz.id}
          >
            <p className="font-bold text-xl">{quiz.title}</p>
            <p className="mb-2">{quiz.description}</p>
            <button
              onClick={() => {
                setIsOpen(true);
              }}
              className="text-white text-sm bg-blue-600 hover:bg-blue-800 px-2 py-1 rounded-lg font-semibold"
            >
              Add Question
            </button>
          </div>
          {quiz.Questions?.map((question) => {
            return (
              <div className="mb-4" key={question.id}>
                <p className="mb-1">
                  <span className="mr-1">{num++}.</span>
                  <span className="mr-2"> {question.question}</span>
                  <button
                    onClick={() => {
                      setId(question.id);
                      setInput({ question: question.question });
                      setIsOpen(true);
                    }}
                    className="mr-1 text-white text-sm bg-yellow-400 hover:bg-yellow-800 px-2 py-1 rounded-lg font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setId(question.id);
                      handleDelete(question.id);
                    }}
                    className="mr-1 text-white text-sm bg-red-500 hover:bg-red-800 px-2 py-1 rounded-lg font-semibold"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setId(question.id);
                      setIsOpenChoice(true);
                    }}
                    className="text-white text-sm bg-green-500 hover:bg-green-800 px-2 py-1 rounded-lg font-semibold"
                  >
                    Add Choices
                  </button>
                </p>
                {question.Choices?.map((choice) => {
                  return (
                    <Fragment key={choice.id}>
                      <p>
                        - {choice.choice}
                        <span className="ml-1 uppercase">
                          <span className="bg-gray-300 text-gray-800 text-xs font-medium mr-2 px-1 py-0.5 rounded">
                            {String(choice.is_correct)}
                          </span>{" "}
                        </span>
                      </p>
                    </Fragment>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      {/* Modal */}
      {isOpen && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md w-1/2">
            <h2 className="text-2xl font-semibold mb-4">Question Form</h2>
            <form onSubmit={handleSubmit}>
              <input
                onChange={handleChange}
                value={input.question}
                type="text"
                name="question"
                className="mb-2 block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Question"
              />
              <button
                onClick={() => {
                  setIsOpen(false);
                  setId(0);
                  setInput({ question: "" });
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
      {isOpenChoice && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md w-1/2">
            <h2 className="text-2xl font-semibold mb-4">Choices Form</h2>
            <form onSubmit={handleSubmitChoice}>
              {choiceCount.map((choiceNum) => {
                return (
                  <Fragment key={choiceNum}>
                    <div className="flex space-x-3 justify-between vertical items-center">
                      <p>{choiceNum}</p>
                      <input
                        onChange={handleChangeChoice}
                        type="text"
                        name={`choice${choiceNum}`}
                        className="mb-2 block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder={`Choice ${choiceNum}`}
                        required
                      />
                      <input
                        onChange={handleChangeChoice}
                        type="text"
                        name={`isCorrect${choiceNum}`}
                        className="mb-2 block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Is Correct"
                        required
                      />
                    </div>
                  </Fragment>
                );
              })}
              <button
                onClick={() => {
                  setIsOpenChoice(false);
                  setId(0);
                  setInput({ choice: "", is_correct: false });
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

export default MyQuizDetail;
