import OpenAI from 'openai';

const Chatbot = async (prompt, conversation) => {

    const openai = new OpenAI({
        apiKey: process.env['REACT_APP_OPENAI_API_KEY'],
        dangerouslyAllowBrowser: true
      });

    let response = [];

    try {
        //fetch chatbot response from server
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
              ...conversation,
              {
                role: "user",
                content: [
                  { type: "text", text: prompt },
                ],
              },
            ],
          });
          
        //console.log(completion.choices[0]);
        response = await [
            ...conversation,
            {
                role:"assistant",
                content: completion.choices[0].message.content
            }
        ];
        console.log(response);
    
    } catch (error) {
        console.error(error);
        response = error;
    }

    return response;
}

export default Chatbot;