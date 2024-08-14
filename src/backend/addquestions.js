require("./mongodb.js");
const cors = require("cors");
const userModel1 = require("./mongodb.js").questions;

async function addquestion() {
  const auditdata = [
    {
      question: "What is React?",
      attachment: [
        "https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600",
      ],
    },
    {
      question: "What is Node.js?",
      attachment: [
        "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg?auto=compress&cs=tinysrgb&w=600",
      ],
    },
    {
      question: "What is MongoDB?",
      attachment: [
        "https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=600",
      ],
    },
    {
      question: "What is Express.js?",
      attachment: [
        "https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/1591065/pexels-photo-1591065.jpeg?auto=compress&cs=tinysrgb&w=600",
      ],
    },
    {
      question: "What is Docker?",
      attachment: [
        "https://images.pexels.com/photos/132700/pexels-photo-132700.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/1345776/pexels-photo-1345776.jpeg?auto=compress&cs=tinysrgb&w=600",
      ],
    },
  ];

  try {
    const data = await userModel1.insertMany(auditdata);
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

addquestion();
