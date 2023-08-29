import Navbar from "@/components/Navbar";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";

const QuizDetail = () => {
  const router = useRouter();
  const { quizId } = router.query;
  const [quiz, setQuiz] = useState({});
  const [totalQuestion, setTotalQuestion] = useState(0);
  let num = 1;

  const [input, setInput] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInput({ ...input, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trueCount = Object.values(input).filter(
      (value) => value == "true"
    ).length;

    const score = Math.round((trueCount / totalQuestion) * 100);

    axios
      .post(
        "http://localhost:8000/api/quizzes/score",
        { quizId, score },
        {
          headers: { Authorization: "Bearer " + Cookies.get("token") },
        }
      )
      .then((res) => {
        console.log(res.data.message);
        router.push("/quizzes");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/quizzes/${quizId}`, {
        headers: { Authorization: "Bearer " + Cookies.get("token") },
      })
      .then((res) => {
        setQuiz({ ...res.data });
        setTotalQuestion(res.data.Questions.length);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl p-6 lg:px-8 mb-10">
        <div className="container mx-auto">
          <div
            className="min-w-0 p-4 bg-gray-200 rounded-lg shadow-xs mb-3"
            key={quiz.id}
          >
            <p className="font-bold text-xl">{quiz.title}</p>
            <p className="mb-2">{quiz.description}</p>
          </div>
          <form onSubmit={handleSubmit}>
            {quiz.Questions?.map((question) => {
              return (
                <div className="mb-4" key={question.id}>
                  <p className="mb-1">
                    <span className="mr-2">{num++}.</span>
                    {question.question}
                  </p>
                  {question.Choices?.map((choice) => {
                    return (
                      <Fragment key={choice.id}>
                        <input
                          className="mr-2"
                          type="radio"
                          name={choice.question_id}
                          value={choice.is_correct}
                          onChange={handleChange}
                        />
                        <label htmlFor="html">{choice.choice}</label>
                        <br />
                      </Fragment>
                    );
                  })}
                </div>
              );
            })}
            <button
              type="submit"
              className="text-white bg-blue-600 hover:bg-blue-800 px-2 py-1 rounded-lg font-semibold"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default QuizDetail;
