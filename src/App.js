import './App.css';
import { useState } from 'react';
import  "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { MainContainer , ChatContainer , MessageList , Message , MessageInput , TypingIndicator} from "@chatscope/chat-ui-kit-react";
let api_key  = process.env.REACT_APP_API_KEY;
function App() {
  const [messages , setMessages] = useState([
    {
      message:"Hello I Am Vidya ! I am here to resolve your queries ! ",
      sender:"ChatBot",
    }
  ])
  const [typing  , setTyping ] =  useState(false);
  const handleSend = async (message)=>{
    const newMessage = {
      message:message,
      sender:"user",
      direction:"outgoing"
    }
    const newMessages = [...messages , newMessage];
    setMessages(newMessages);

    setTyping(true);

    await ProcessMessageToAI(newMessages);
  }

  async function ProcessMessageToAI (chatMessages) {
    let apiMessages = chatMessages.map((messageObject) =>{
      let role = "";
      if(messageObject.sender == "ChatBot")
      role = "assistant";
      else
      role = "user";

      return { role :  role , content : messageObject.message};
    })
    
    const SystemMessage = {
      role:"system",
      content:"in 100 words",
    }

    const apiRequestBody = {
      "model" : "gpt-3.5-turbo",
      "messages":
      [
        SystemMessage,
        ...apiMessages
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Authorization":`Bearer ${api_key}`,
        "Content-Type" : "application/json", 
      },
      body:JSON.stringify(apiRequestBody)
      }).then((data) => {
        return data.json();
      }).then((data)=>{
        console.log(data.choices[0].message.content);
        setMessages([...chatMessages , {
          message:data.choices[0].message.content,
          sender:"ChatBot"
        }]
        );
        setTyping(false);
      })
    }


  return (
    <div className='w-full overflow-y-hidden flex items-center h-screen bg-gradient-to-tl from-blue-900 via-teal-500 to-sky-400'>
      <div className=' relative h-[550px] , w-[60%] mx-auto overflow-y-hidden'>
      <MainContainer className=' rounded-2xl'>
        <ChatContainer>
          <MessageList scrollBehavior='smooth' className='mt-5'>
            {typing ? <TypingIndicator content="Getting Best Solution To Your Query"></TypingIndicator> : null}
            {messages.map((message , index)=>{
              return <Message key={index} model={message} className='mt-2 mb-2'></Message>
            })}
          </MessageList>
          <MessageInput placeholder='Type A Message Here' onSend={handleSend}attachButton={false} sendButton={false} ></MessageInput>
        </ChatContainer>
      </MainContainer>
    </div>
    </div>
  );
}

export default App; 
