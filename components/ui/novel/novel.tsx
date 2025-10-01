"use client";

import { EditorContent, EditorRoot, handleCommandNavigation, JSONContent } from "novel";
import { memo, useState } from "react";
import { defaultExtensions } from "./extension";
import { slashCommand } from "./suggestion-items";
import { EditorCommand, EditorCommandEmpty, EditorCommandItem, EditorCommandList } from "novel";
import { suggestionItems } from "./suggestion-items";

const Novel = ({ content, setContent, placeholder }: { content: JSONContent, setContent: (content: JSONContent) => void, placeholder?: string }) => {
    return (
        <EditorRoot>
            <EditorContent
                initialContent={content}
                onUpdate={({ editor }) => {
                    const json = editor.getJSON();
                    setContent(json);
                }}
                extensions={[...defaultExtensions, slashCommand]}
                editorProps={{
                    handleDOMEvents: {
                      keydown: (_view, event) => handleCommandNavigation(event),
                    },
                    attributes: {
                      class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full border border-gray-200 rounded-sm min-h-[100px]`,
                    },
                }}
            >
                <EditorCommand className='z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-muted py-2 shadow-md transition-all'>
                    <EditorCommandEmpty className='px-2 text-muted-foreground'>No results</EditorCommandEmpty>
                    <EditorCommandList>
                        {suggestionItems.map((item) => (
                            <EditorCommandItem
                                value={item.title}
                                onCommand={(val) => item.command(val)}
                                className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent bg-white `}
                                key={item.title}>
                                <div className='flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-primary dark:bg-white dark:text-white bg-white'>
                                    {item.icon}
                                </div>
                                <div>
                                    <p className='font-medium text-black dark:text-white'>{item.title}</p>
                                    <p className='text-xs text-muted-foreground'>{item.description}</p>
                                </div>
                            </EditorCommandItem>
                        ))}
                    </EditorCommandList>
                </EditorCommand>
            </EditorContent>
        </EditorRoot>
    );
};
export default Novel;