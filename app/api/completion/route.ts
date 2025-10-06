import { UIMessage, convertToModelMessages, generateText } from 'ai';
import { auth } from '@/lib/auth';

const models = [
    {
        name: 'OpenAI GPT OSS 120B',
        value: 'openai/gpt-oss-120b',
    },
    {
        name: 'GPT 4o',
        value: 'openai/gpt-4o',
    },
    {
        name: 'Deepseek R1',
        value: 'deepseek/deepseek-r1',
    },
];

type Session = typeof auth.$Infer.Session;
type ExperimentalContext = {
    userId: string;
}

export async function POST(request: Request) {

    const { messages } = await request.json();

    const { text, finishReason } = await generateText({
        model: models[0].value,
        providerOptions: {
            gateway: {
                order: ["bedrock"]
            }
        },
        prompt:
            `You are a helpful assistant that can make the description or requirements looks good, the message is based on user input : ${messages}.

    flow: 

    - make sure first to analysis the user input.
    - then break that into smaller piece.
    - then translate to bahasa indonesia.

      rules :
      - dont make technical answer.
      - dont make long answer.
      - dont make answer that is not related to the user input.
      - make the answer clear and easy to understand.
      - make the answer looks like a human.
      - dont try to ask user.
      - use bullet point for list and make any detailes more clear.

      output :
      - only text
      - dont use markdown format.
        `,
    });

    return Response.json({
        text,
        finishReason,
    });
}

// prompt:
// `You are a helpful assistant that can make the description or requirements looks good, the message is based on user input : ${messages}.

// rules :
// - dont make technical answer.
// - dont make long answer.
// - dont make answer that is not related to the user input.
// - make the answer clear and easy to understand.
// - make the answer looks like a human.

// output :
// - output must be json object.
// - must match one of this structure object, but keep the original structure :

// {
// "type": "doc",
// "content": [
// {
// "type": "paragraph",
// "content": [
// {
// "type": "text",
// "text": "hahahah"
// }
// ]
// },
// {
// "type": "taskList",
// "content": [
// {
// "type": "taskItem",
// "attrs": {
// "checked": false
// },
// "content": [
// {
//   "type": "paragraph",
//   "content": [
//     {
//       "type": "text",
//       "text": "yuuyy"
//     }
//   ]
// }
// ]
// }
// ]
// },
// {
// "type": "heading",
// "attrs": {
// "level": 1
// },
// "content": [
// {
// "type": "text",
// "text": "ertert"
// }
// ]
// },
// {
// "type": "heading",
// "attrs": {
// "level": 2
// },
// "content": [
// {
// "type": "text",
// "text": "hhhh"
// }
// ]
// },
// {
// "type": "heading",
// "attrs": {
// "level": 3
// },
// "content": [
// {
// "type": "text",
// "text": "ioioio"
// }
// ]
// },
// {
// "type": "bulletList",
// "content": [
// {
// "type": "listItem",
// "content": [
// {
//   "type": "paragraph",
//   "content": [
//     {
//       "type": "text",
//       "text": "iiiiil"
//     }
//   ]
// }
// ]
// },
// {
// "type": "listItem",
// "content": [
// {
//   "type": "paragraph",
//   "content": [
//     {
//       "type": "text",
//       "text": "uyitui"
//     }
//   ]
// }
// ]
// }
// ]
// },
// {
// "type": "orderedList",
// "attrs": {
// "start": 1,
// "type": null
// },
// "content": [
// {
// "type": "listItem",
// "content": [
// {
//   "type": "paragraph",
//   "content": [
//     {
//       "type": "text",
//       "text": "yuuyuyyur"
//     }
//   ]
// }
// ]
// },
// {
// "type": "listItem",
// "content": [
// {
//   "type": "paragraph",
//   "content": [
//     {
//       "type": "text",
//       "text": "ryuty"
//     }
//   ]
// }
// ]
// }
// ]
// },
// {
// "type": "blockquote",
// "content": [
// {
// "type": "paragraph",
// "content": [
// {
//   "type": "text",
//   "text": "tyutyutyu"
// }
// ]
// }
// ]
// },
// {
// "type": "codeBlock",
// "attrs": {
// "language": null
// },
// "content": [
// {
// "type": "text",
// "text": "tutttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttsadasasasasd"
// }
// ]
// }
// ]
// }

// `,