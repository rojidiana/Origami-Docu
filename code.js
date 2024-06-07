figma.showUI(__html__);

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'get-content') {
    const frame = figma.currentPage.selection[0];
    if (!frame || frame.type !== 'FRAME') {
      figma.notify('Please select a frame.');
      return;
    }

    const content = await fetchContentFromFigma(frame.id);
    figma.ui.postMessage({ type: 'content', content });
  }
};

async function fetchContentFromFigma(nodeId) {
  const fileId = process.env.FIGMA_FILE_ID;
  const response = await fetch(`https://api.figma.com/v1/files/${fileId}/nodes?ids=${nodeId}`, {
    headers: {
      'X-Figma-Token': process.env.FIGMA_TOKEN
    }
  });
  const data = await response.json();
  return JSON.stringify(data, null, 2);
}
