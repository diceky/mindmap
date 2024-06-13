import React, { useCallback, useEffect, useState, useRef } from 'react';
import './App.css';
import Chatbot from './chatbot';
import logo from './images/logo.png';
import { ColorRing } from 'react-loader-spinner'
import Mermaid from './Mermaid';

const App = () => {

  const [prompt, setPrompt] = useState('');
  const [conversation, setConversation] = useState([
    {
      'role': 'system',
      'content': `The following is the syntax for creating mermaid mindmap notation: 

      1. It should start with the word mindmap, and the first node has to be the "root" node followed by two barkets like: 
      root((main idea)) 
      
      2. Ideas are grouped under root. ALWAYS right indent. Sub-ideas are right indented under ideas. Try to generate sub-ideas where possible.

      3. Wrap each idea with a **, then add | and a short explanation of that idea, like:
      **idea** | this is the explanation of this idea
      
      4. Except for the root node, Ideas and sub-ideas shouldn't include any types of brackets, like curly brackets, brackets, or square brackets 
      
      5. Look for icons from https://fontawesome.com/ for each node, and if you find relevant icons place this in a separate line under each node or subnode in the following format:
      ::icon(fa fa-icon-name)
      
      6. Limit the node to 3 words maximum and the sub-nodes and downwards to 2 words maximum. 
      
      As per the mermaid mindmap notation above, please summarize the given topic into a mermaid mindmap notation. Return only the mermaid code, without any markdown formatting.
      `
    }
  ]);
  const [loading, setLoading] = useState(false);
  const chatWrapperRef = useRef(null);
  const chatContentRef = useRef(null);

  useEffect(() => {

    if (chatContentRef.current && chatWrapperRef.current) {
      chatWrapperRef.current.scrollTop = chatContentRef.current.offsetHeight;
    }

  }, [conversation]);

  const handleMessageChange = (event) => {
    const value = event.target.value;
    setPrompt(value);
  }

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    // Still loading, do not submit
    if (loading) return;

    try {
      // merge new prompt to conversation
      const newConversation = [
        ...conversation,
        {
          'role': 'user',
          'content': prompt
        }
      ];

      await setConversation(newConversation);

      //clear text area
      setPrompt('');

      setLoading(true);

      // wait for response from server
      const conversationJson = await Chatbot(
        prompt,
        newConversation
      );
      await setConversation(conversationJson);

    } catch (error) {
      alert(error);

    } finally {
      setLoading(false);
    }
  }, [loading, prompt, conversation]);

  const onKeyDown = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <div className="wrapper">
      <img src={logo} className="logo" alt="SALTO logo" />
      <div className="content">
        <div className="chatWrapper" ref={chatWrapperRef}>
          <div className="chat" ref={chatContentRef}>
            {conversation.length > 0 && conversation.slice(1).map((value, index) => (
                <div className={index % 2 === 1 ? "chatItem-left" : "chatItem-right"} key={index}>
                  {/* <p className={index % 2 === 1 ? "text" : "text right"}>{value.content}</p> */}
                  {index % 2 === 1 ? <Mermaid chart={value.content} id="mermaid"/> : <p className="text right">{value.content}</p> }
                </div>
              ))}
            {loading && (
              <ColorRing
                height="50"
                width="50"
                ariaLabel="color-ring-loading"
                wrapperStyle={{}}
                colors={['#AAF9E9', '#130B49', '#FD68CA', '#DAFFA7', '#90A9E8']}
              />
            )}
          </div>
        </div>
        <form className="input" onSubmit={handleSubmit}>
          <label>
            <textarea
              rows='5'
              cols='50'
              value={prompt}
              onChange={handleMessageChange}
              onKeyDown={onKeyDown}
              placeholder="Type your question here..."
            />
          </label>
          <button className="btn-submit" type="submit">SEND</button>
        </form>
      </div>
    </div>
  );
}

export default App;
