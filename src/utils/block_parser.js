function parseBlock(block) {
    const { type } = block;
  
    switch (type) {
      case "paragraph":
        return parseParagraph(block);
      case "heading_1":
      case "heading_2":
      case "heading_3":
        return parseHeading(block, type);
      case "bulleted_list_item":
        return `<li>${parseRichText(block.bulleted_list_item.rich_text)}</li>`;
      case "numbered_list_item":
        return `<li>${parseRichText(block.numbered_list_item.rich_text)}</li>`;
      case "quote":
        return `<blockquote>${parseRichText(block.quote.rich_text)}</blockquote>`;
      case "code":
        return `<pre><code>${block.code.text[0]?.rich_text?.content || ""}</code></pre>`;
      case "image":
        return parseImage(block);
      case "divider":
        return "<hr />";
      case "callout":
        return `<div class="callout">${parseRichText(block.callout.rich_text)}</div>`;
      default:
        return "";
    }
  }
  
  function parseParagraph(block) {
    return `<p>${parseRichText(block.paragraph.rich_text)}</p>`;
  }
  
  function parseHeading(block, type) {
    const level = type === "heading_1" ? 1 : type === "heading_2" ? 2 : 3;
    return `<h${level}>${parseRichText(block[type].rich_text)}</h${level}>`;
  }
  
  function parseImage(block) {
    const imageUrl = block.image.type === "external" ? block.image.external.url : block.image.file.url;
    const altText = block.image.caption?.[0]?.plain_text || "";
    return `<img src="${imageUrl}" alt="${altText}" />`;
  }
  
  function parseRichText(richTextArray) {
    if(!richTextArray){
        return
    }
    return richTextArray
      .map((text) => {
        const content = text.text.content;
        const link = text.text.link ? `<a href="${text.text.link.url}">${content}</a>` : content;
  
        const formatted = applyAnnotations(link, text.annotations);
        return formatted;
      })
      .join("");
  }
  
  function applyAnnotations(content, annotations) {
    if (annotations.bold) content = `<b>${content}</b>`;
    if (annotations.italic) content = `<i>${content}</i>`;
    if (annotations.underline) content = `<u>${content}</u>`;
    if (annotations.code) content = `<code>${content}</code>`;
    return content;
  }
  


export function parseBlocksToHTML(blocks) {
    let html = "";
    let listType = null;
    let listItems = [];
  
    for (const block of blocks) {
      if (block.type === "bulleted_list_item" || block.type === "numbered_list_item") {
        if (!listType) listType = block.type === "bulleted_list_item" ? "ul" : "ol";
        listItems.push(parseBlock(block));
      } else {
        if (listType) {
          html += `<${listType}>${listItems.join("")}</${listType}>`;
          listType = null;
          listItems = [];
        }
        html += parseBlock(block);
      }
    }
  
    if (listType) {
      html += `<${listType}>${listItems.join("")}</${listType}>`;
    }
  
    return html;
  }
  