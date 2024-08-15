import React, { useEffect, useState } from "react";
import "./question.scss";
import axios from "axios";
import { toast } from "react-toastify";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useNavigate } from "react-router-dom";

const Question = () => {
  const [quesNumber, setQuesNumber] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState("");
  const [images, setImages] = useState([]);
  const [showMic, setShowMic] = useState(true);
  const navigate = useNavigate();
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });
  const getQuestion = async () => {
    try {
      const response = await axios("http://localhost:5000/questions", {
        headers: {
          authorization: `bear ${JSON.parse(localStorage.getItem("auth"))}`,
        },
      });
      const data = await response.data;
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };
  async function fetchQuestions() {
    const allquestions = await getQuestion();
    setQuestions(allquestions);
  }
  const handelAnswerSubmit = async () => {
    const formData = new FormData();
    formData.set("questionID", questions[quesNumber]._id);
    formData.set("answer", answer);
    formData.set("question", questions[quesNumber].question);
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/submitanswer",
        formData,
        {
          headers: {
            authorization: `bear ${JSON.parse(localStorage.getItem("auth"))}`,
          },
        }
      );
      const data = await response.data;
      console.log(data);
      toast.success("Answer submitted successfully");
      setQuesNumber((prev) => prev + 1);
      setAnswer("");
      setImages([]);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const handelImageAdd = (e) => {
    console.log(e.target.files); //yeh object hai
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((oldArray) => [reader.result, ...oldArray].slice(0, 3));
        }
      };
      reader.readAsDataURL(file);
    });
  };
  useEffect(() => {
    if (quesNumber === 5) {
      toast.success("All questions answered");
      navigate("/");
    }
  }, [quesNumber]);
  useEffect(() => {
    document.title = "Question";
    fetchQuestions();
  }, []);
  return (
    <div className="faq-container">
      <div className="buttons">
        <button
          onClick={() => {
            setQuesNumber((prev) => (prev - 1 + 5) % 5);
          }}
          className="menu-button"
        >
          &lt; previous
        </button>
        <button
          onClick={() => {
            setQuesNumber((prev) => (prev + 1) % 5);
          }}
          className="menu-button"
        >
          Next &gt;
        </button>
      </div>
      <div className="question-section">
        <h2 className="question">
          {quesNumber + 1}
          {".   "}
          {questions[quesNumber]?.question}
        </h2>
        {questions[quesNumber]?.attachment.length > 0 && (
          <div className="atachments">
            {questions[quesNumber]?.attachment?.map((attachment, index) => (
              <img key={index} src={attachment} alt="" />
            ))}
          </div>
        )}
      </div>
      <div className="answer-section">
        <div className="micelement">
          <StopSVG
            className={`svg ${!showMic ? "show" : "hide"}`}
            onClick={() => {
              const test = answer + transcript;
              setAnswer(test);

              setShowMic(true);
              SpeechRecognition.stopListening();
            }}
          />
          <MicSVG
            className={`svg ${showMic ? "show" : "hide"}`}
            onClick={() => {
              setShowMic(false);
              startListening();
            }}
          />
        </div>
        <textarea
          value={!showMic ? transcript : answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="answer"
          placeholder="Type your answer here..."
        ></textarea>

        <input
          type="file"
          id="file-upload"
          multiple
          accept="image/*"
          onChange={handelImageAdd}
          style={{ display: "none" }}
        />

        <div className="ans-atachments">
          {images.map((image, index) => (
            <div style={{ position: "relative" }}>
              <img key={index} src={image} alt="" />
              <DeleteSVG
                onClick={() => {
                  const newImages = images.filter((i) => i !== image);
                  setImages(newImages);
                }}
                className="deletesvg"
              />
            </div>
          ))}

          <label htmlFor="file-upload">
            <AddImage />
          </label>
          {quesNumber === 4 && (
            <div>
              <button onClick={handelAnswerSubmit} className="menu-button">
                submit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AddImage = (props) => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        width={80}
        height={80}
        viewBox="0 0 512 512"
        {...props}
      >
        <path
          d="M60.76 139.885c-7.812 0-14.144-6.332-14.144-14.144V60.76c0-7.812 6.332-14.144 14.144-14.144h64.98c7.812 0 14.144 6.332 14.144 14.144s-6.332 14.144-14.144 14.144H74.903v50.837c0 7.812-6.332 14.144-14.143 14.144zM451.239 465.384H386.26c-7.81 0-14.144-6.332-14.144-14.144s6.334-14.144 14.144-14.144h50.835V386.26c0-7.812 6.334-14.144 14.144-14.144 7.81 0 14.144 6.332 14.144 14.144v64.98c0 7.81-6.333 14.144-14.144 14.144z"
          style={{
            fill: "#2d527c",
          }}
        />
        <path
          d="M497.856 512H14.144C6.332 512 0 505.668 0 497.856V14.144C0 6.332 6.332 0 14.144 0h483.713C505.667 0 512 6.332 512 14.144v483.713c0 7.811-6.333 14.143-14.144 14.143zM28.287 483.713h455.425V28.287H28.287v455.426z"
          style={{
            fill: "#2d527c",
          }}
        />
        <path
          d="M393.893 207.912v-89.805H118.107v275.787h275.787v-77.783m-54.243-28.995h-52.535v52.535h-62.232v-52.535h-52.535v-62.232h52.535v-52.535h62.232v52.535h52.535v62.232z"
          style={{
            fill: "#cee8fa",
          }}
        />
        <path
          d="M393.893 408.037H118.107c-7.812 0-14.144-6.332-14.144-14.144V118.107c0-7.812 6.332-14.144 14.144-14.144h275.787c7.81 0 14.144 6.332 14.144 14.144v89.805c0 7.812-6.334 14.144-14.144 14.144s-14.144-6.332-14.144-14.144V132.25h-247.5v247.5h247.5v-63.639c0-7.812 6.334-14.144 14.144-14.144s14.144 6.332 14.144 14.144v77.783c-.001 7.811-6.333 14.143-14.145 14.143zm-106.777-54.242h-62.232c-7.812 0-14.144-6.332-14.144-14.144V301.26h-38.392c-7.812 0-14.144-6.332-14.144-14.144v-62.232c0-7.812 6.332-14.144 14.144-14.144h38.392v-38.392c0-7.812 6.332-14.144 14.144-14.144h62.232c7.81 0 14.144 6.332 14.144 14.144v38.392h38.393c7.81 0 14.144 6.332 14.144 14.144v62.232c0 7.812-6.334 14.144-14.144 14.144H301.26v38.392c0 7.811-6.334 14.143-14.144 14.143zm-48.088-28.287h33.945v-38.392c0-7.812 6.334-14.144 14.144-14.144h38.393v-33.945h-38.393c-7.81 0-14.144-6.332-14.144-14.144v-38.392h-33.945v38.392c0 7.812-6.332 14.144-14.144 14.144h-38.392v33.945h38.392c7.812 0 14.144 6.332 14.144 14.144v38.392z"
          style={{
            fill: "#2d527c",
          }}
        />
      </svg>
    </div>
  );
};
const MicSVG = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      width={30}
      height={30}
      viewBox="0 0 512 512"
      {...props}
    >
      <path
        fill="green"
        d="M155.7 320.3c2.8 23.3 24.9 42.4 49 42.4h87.8c24.1 0 46.2-19.1 49-42.4l11.7-96.6c2.8-23.3 2.8-61.4 0-84.8l-11.7-96.6C338.6 19 316.5 0 292.4 0h-87.8c-24.1 0-46.2 19.1-49 42.4L144 138.9c-2.8 23.3-2.8 61.5 0 84.8l11.7 96.6zm263.4-149.6h-42.6c.4 19.5-.3 40.2-2.2 55.6l-11.7 96.6c-4.1 34.3-34.9 61.1-70.2 61.1h-87.8c-35.2 0-66-26.9-70.2-61.1l-11.7-96.6c-1.9-15.4-2.6-36.1-2.2-55.6H77.9c-.4 21.3.4 43.6 2.5 60.7L92.1 328c6.7 55.3 56.1 98.6 112.5 98.6h22.6v42.7h-64V512h170.7v-42.7h-64v-42.7h22.6c56.5 0 105.9-43.4 112.5-98.7l11.7-96.7c2-17 2.8-39.3 2.4-60.5z"
      />
    </svg>
  );
};
const StopSVG = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    width={30}
    height={30}
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="rgb(255, 0, 0)"
      fillRule="evenodd"
      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10ZM8.586 8.586C8 9.172 8 10.114 8 12c0 1.886 0 2.828.586 3.414C9.172 16 10.114 16 12 16c1.886 0 2.828 0 3.414-.586C16 14.828 16 13.886 16 12c0-1.886 0-2.828-.586-3.414C14.828 8 13.886 8 12 8c-1.886 0-2.828 0-3.414.586Z"
      clipRule="evenodd"
    />
  </svg>
);
const DeleteSVG = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -5 32 32"
    width={30}
    height={30}
    {...props}
  >
    <title>{"delete"}</title>
    <path
      fill="#000"
      fillRule="evenodd"
      d="M22.647 13.24a1.002 1.002 0 1 1-1.415 1.42l-2.239-2.24-2.268 2.27c-.394.39-1.033.39-1.427 0a1.013 1.013 0 0 1 0-1.43l2.268-2.27-2.239-2.23a1.002 1.002 0 1 1 1.415-1.42l2.239 2.24 2.3-2.3a1.016 1.016 0 0 1 1.427 0c.395.4.395 1.03 0 1.43l-2.3 2.3 2.239 2.23ZM27.996 0H10.051c-.28-.02-.566.07-.78.28L.285 10.22a.989.989 0 0 0-.287.76c-.015.28.076.56.287.77l8.986 9.94c.196.19.452.29.708.29V22h18.017A4.002 4.002 0 0 0 32 18V4c0-2.21-1.793-4-4.004-4Z"
    />
  </svg>
);
export default Question;
