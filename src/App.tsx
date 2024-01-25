import React, { useEffect, useRef, useState } from "react";
import "./App.css";

import Quill from "quill";

type QuillEditorProps = {
  value?: string;
  onChange?: (value: string) => any;
};

const QuillEditor = ({ value, onChange }: QuillEditorProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastChangeRef = React.useRef<string | null>(null);

  const [quill, setQuill] = useState<Quill | null>(null);

  useEffect(() => {
    if (!quill) {
      return;
    }

    if (value !== lastChangeRef.current) {
      quill.root.innerHTML = value || "";
    }
  }, [quill, value]);

  useEffect(() => {
    if (!quill) {
      return;
    }

    function handleChange() {
      const contents = quill!.root.innerHTML;
      lastChangeRef.current = contents;

      console.log("HERE!");

      if (onChange) {
        onChange(contents);
      }
    }

    quill.on("text-change", handleChange);

    return () => {
      quill.off("text-change", handleChange);
    };
  }, [quill, onChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const editorElement = document.createElement("div");
    container.append(editorElement);
    let quill: Quill = new Quill(editorElement, {
      theme: "snow",
    });

    quill.root.innerHTML = value || "";

    setQuill(quill);

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return <div ref={containerRef}>Quill Editor</div>;
};

function App() {
  const [counter, setCounter] = useState<number>(0);
  const [editorValue, setEditorValue] = useState<string>("");

  function handleClick() {
    setCounter((value) => value + 1);
  }

  function handleEditorChange(newValue: string) {
    console.log("newValue: ", newValue);
    setEditorValue(newValue);
  }

  return (
    <div>
      <p>A sample example of using quilljs in React.</p>
      <p>Current value: {counter}</p>
      <div>
        <button onClick={handleClick}>Add</button>
      </div>

      <div>
        {/* Testing if these two editors stay in sync. */}
        <QuillEditor value={editorValue} onChange={handleEditorChange} />
        <QuillEditor value={editorValue} onChange={handleEditorChange} />
      </div>
    </div>
  );
}

export default App;
