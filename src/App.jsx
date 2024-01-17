import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react"

const API_KEY="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";

function App() {
  const[typing,setTyping]=useState(false);
  const[messages,setMessages]=useState([
    {
      message:"Hello I am ChatGPT! Ask me anything!",
      sender:"ChatGPT"
    }
  ])
  const handleSend=async(message)=>{
    const newMessage={
      message:message,
      sender:"user",
      direction:"outgoing"
    }

    const newMessages=[...messages,newMessage];

    setMessages(newMessages);

    setTyping(true);
    await processMessageToChatGPT(newMessages);
  }

  async function processMessageToChatGPT(chatMessages){
    let apiMessages=chatMessages.map((messageObject)=>{
      let role="";
      if(messageObject.sender ==="ChatGPT"){
        role="assistant"
      }else{
        role="user"
      }
      return{role:role, content:messageObject.message}
    });

    const systemMessage={
      role:"system",
      content:"Ask me anything in English ,and I will provide a detailed response"
    }

const apiRequestBody={
  "model": "gpt-3.5-turbo",
  "messages":[
    systemMessage,
    ...apiMessages

  ]
}

    await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Authorization": "Bearer " + API_KEY,
        "Content-Type":"application/json"
      },
      body:JSON.stringify(apiRequestBody)
    }).then((data)=>{
      return data.json();
    }).then((data)=>{
      console.log(data)
      console.log(data.choices[0].message.content);
      setMessages(
        [...chatMessages,{
          message:data.choices[0].message.content,
          sender:"ChatGPT"
        }]
      );
      setTyping(false)
    })
  }

  return (
    <div className='App'>
      <h1>CHATBOT AI</h1>
      <div style={{ position: "relative", height: "800px", width: "700px" }}>
        <MainContainer className='main-container'>
          <ChatContainer className='chat-container'>
            <MessageList
            scrollBehavior='smooth'
            typingIndicator={typing? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message,i)=>{
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder='Type message here' onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App
