import mermaid from "mermaid";
import { useEffect } from "react";

mermaid.initialize({});

const Mermaid = ({ chart, id }) => {
  useEffect(() => {
    document.getElementById(id)?.removeAttribute("data-processed");
    mermaid.contentLoaded();
  }, [chart, id]);

  return (
    <pre className="mermaid" id={id}>
      {chart}
    </pre>
  );
};

export default Mermaid;