import Navbar from "@/components/Navbar";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/quizzes", {
        headers: { authorization: "Bearer " + Cookies.get("token") },
      })
      .then((res) => {
        setQuizzes([...res.data]);
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
        <h1 className="font-bold text-3xl mb-5">Quiz</h1>
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
                    router.push(`/quizzes/${quiz.id}`);
                  }}
                  className="text-white text-sm bg-green-600 hover:bg-green-800 px-2 py-1 rounded-lg font-semibold"
                >
                  Kerjakan
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Quizzes;
