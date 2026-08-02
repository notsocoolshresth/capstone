const createMockDoc = () => {
  const texts = [];
  let y = 50;

  const doc = {
    page: {
      width: 612,
      height: 792,
      margins: { left: 50, right: 50, top: 50, bottom: 50 },
    },
    x: 0,
    texts,

    get y() {
      return y;
    },
    set y(value) {
      y = value;
    },

    font() {
      return doc;
    },
    fontSize() {
      return doc;
    },
    text(text) {
      texts.push(String(text));
      return doc;
    },
    moveDown() {
      return doc;
    },
    moveTo() {
      return doc;
    },
    lineTo() {
      return doc;
    },
    lineWidth() {
      return doc;
    },
    dash() {
      return doc;
    },
    undash() {
      return doc;
    },
    stroke() {
      return doc;
    },
    rect() {
      return doc;
    },
    clip() {
      return doc;
    },
    fill() {
      return doc;
    },
    circle() {
      return doc;
    },
    save() {
      return doc;
    },
    restore() {
      return doc;
    },
    addPage() {
      return doc;
    },
    image() {
      return doc;
    },
    fillColor() {
      return doc;
    },
    strokeColor() {
      return doc;
    },
    registerFont() {
      return doc;
    },
    currentLineHeight() {
      return 12;
    },
    widthOfString() {
      return 10;
    },
    heightOfString() {
      return 12;
    },
  };
  return { doc, texts };
};

const hasText = (doc, text) => doc.texts.some((item) => item.includes(text));

const getAllText = (doc) => doc.texts.join("\n");

module.exports = { createMockDoc, hasText, getAllText };
