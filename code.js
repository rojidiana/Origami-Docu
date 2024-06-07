figma.showUI(__html__);

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'get-content') {
    const frame = figma.currentPage.selection[0];
    if (!frame || frame.type !== 'FRAME') {
      figma.notify('Please select a frame.');
      return;
    }

    const content = await captureFrameContent(frame);
    figma.ui.postMessage({ type: 'content', content });
  }
};

async function captureFrameContent(frame) {
  let content = '';
  const nodesToExport = [];

  function traverse(node) {
    if ('children' in node) {
      node.children.forEach(traverse);
    } else if (node.type === 'TEXT') {
      content += node.characters + '\n';
    } else if (node.type === 'RECTANGLE' || node.type === 'ELLIPSE' || node.type === 'FRAME') {
      nodesToExport.push(node);
    }
  }

  traverse(frame);

  for (const node of nodesToExport) {
    const imageData = await exportNodeAsImage(node);
    content += `![Image](${imageData})\n`;
  }

  return content;
}

async function exportNodeAsImage(node) {
  const exportOptions = { format: 'PNG' };
  const imageBytes = await node.exportAsync(exportOptions);
  const base64Image = figma.base64Encode(imageBytes);
  return `data:image/png;base64,${base64Image}`;
}
