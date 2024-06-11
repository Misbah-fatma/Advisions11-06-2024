import * as Blockly from 'blockly';

const phpGenerator = new Blockly.Generator('PHP');

phpGenerator['controls_if'] = function(block) {
  const condition = phpGenerator.valueToCode(block, 'IF0', phpGenerator.ORDER_NONE) || 'false';
  const branch = phpGenerator.statementToCode(block, 'DO0');
  return `if (${condition}) {\n${branch}}\n`;
};

// Add more blocks as needed...

export default phpGenerator;
