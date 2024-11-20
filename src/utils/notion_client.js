import { Client } from "@notionhq/client";
import { parseBlocksToHTML } from './block_parser'
const notion = new Client({ auth: "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" });
const databaseId = "1447b31380d180779aa2c01386ca83cc";
export async function getDatabase() {
  const response = await notion.databases.query({
    database_id: databaseId,
  });
  return response.results;
}
export async function getBlogs() {
  const response = await notion.databases.query({
    database_id: databaseId,
  });

  return response.results;
}

export async function getPageProperties(page_id) {
    const response = await notion.pages.retrieve({page_id})
  
    return response.properties;
  }
export async function getNotionBlocksByPage(blockId){
    
    const response = await notion.blocks.children.list({
        block_id: blockId,
        page_size: 50,
    });
    const html = parseBlocksToHTML(response.results)
    return html
}