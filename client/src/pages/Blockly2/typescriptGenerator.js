import * as Blockly from 'blockly';

const typescriptGenerator = new Blockly.Generator('TypeScript');

typescriptGenerator['controls_if'] = function(block) {
  const condition = typescriptGenerator.valueToCode(block, 'IF0', typescriptGenerator.ORDER_NONE) || 'false';
  const branch = typescriptGenerator.statementToCode(block, 'DO0');
  return `if (${condition}) {\n${branch}}\n`;
};

// Add more blocks as needed...

export default typescriptGenerator;
