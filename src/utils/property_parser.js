export function parsePageProperties(properties) {
    return {
      featuredImage: parseFileProperty(properties.FeaturedImage),
      name: parseNameProperty(properties.Name),
      draft: parseCheckboxProperty(properties.Draft),
      tags: parseMultiSelectProperty(properties.Tags),
    };
  }
  
 function parseFileProperty(fileProperty) {
    if (!fileProperty || !fileProperty.files || fileProperty.files.length === 0) return null;
  
    const file = fileProperty.files[0];
    return file.type === "external" ? file.external.url : file.file.url;
  }
  
  function parseNameProperty(textProperty) {
    if (!textProperty)
      return null;
    return textProperty.title[0].text.content
  }
  
  function parseCheckboxProperty(checkboxProperty) {
    return checkboxProperty?.checkbox || false;
  }
  
  function parseMultiSelectProperty(multiSelectProperty) {
    if (!multiSelectProperty || !multiSelectProperty.multi_select) return [];
  
    return multiSelectProperty.multi_select.map((item) => item.name);
  }
  