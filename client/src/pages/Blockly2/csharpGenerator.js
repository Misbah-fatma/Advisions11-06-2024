import * as Blockly from 'blockly';

const csharpGenerator = new Blockly.Generator('CSharp');

csharpGenerator['controls_if'] = function(block) {
  const condition = csharpGenerator.valueToCode(block, 'IF0', csharpGenerator.ORDER_NONE) || 'false';
  const branch = csharpGenerator.statementToCode(block, 'DO0');
  return `if (${condition}) {\n${branch}}\n`;
};

// Add more blocks as needed...

export default csharpGenerator;
