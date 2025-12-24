import { visit, CONTINUE } from "unist-util-visit";
import type { Root, Element } from "hast";

interface RehypeCopyCodeOptions {
  copyButtonText?: string;
  buttonClass?: string;
  wrapperClass?: string;
  tableWrapperClass?: string;
}

export default function rehypeCopyCode(options: RehypeCopyCodeOptions = {}) {
  const { 
    copyButtonText = "复制", 
    buttonClass = "copy-button", 
    wrapperClass = "code-block-wrapper",
    tableWrapperClass = "table-wrapper"
  } = options;

  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName === "pre" && node.children.length > 0) {
        const codeElement = node.children[0];
        if (codeElement.type === "element" && codeElement.tagName === "code") {
          const codeText = extractCodeText(codeElement);
          
          const buttonElement: Element = {
            type: "element",
            tagName: "button",
            properties: {
              className: [buttonClass],
              "data-code": codeText,
            },
            children: [
              {
                type: "element",
                tagName: "svg",
                properties: {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  width: "16",
                  height: "16",
                },
                children: [
                  {
                    type: "element",
                    tagName: "rect",
                    properties: {
                      x: "9",
                      y: "9",
                      width: "13",
                      height: "13",
                      rx: "2",
                      ry: "2",
                    },
                    children: [],
                  },
                  {
                    type: "element",
                    tagName: "path",
                    properties: {
                      d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
                    },
                    children: [],
                  },
                ],
              },
            ],
          };

          const wrapperElement: Element = {
            type: "element",
            tagName: "div",
            properties: {
              className: [wrapperClass],
            },
            children: [buttonElement, node],
          };

          if (parent && typeof index === "number") {
            parent.children[index] = wrapperElement;
          }
        }
      }

      if (node.tagName === "table") {
        const tableWrapperElement: Element = {
          type: "element",
          tagName: "div",
          properties: {
            className: [tableWrapperClass],
          },
          children: [node],
        };

        if (parent && typeof index === "number") {
          parent.children[index] = tableWrapperElement;
        }
      }
    });
  };
}

function extractCodeText(node: Element): string {
  let text = "";
  
  function visitNode(n: any) {
    if (n.type === "text") {
      text += n.value;
    } else if (n.type === "element" && n.children) {
      n.children.forEach(visitNode);
    }
  }
  
  visitNode(node);
  return text;
}
