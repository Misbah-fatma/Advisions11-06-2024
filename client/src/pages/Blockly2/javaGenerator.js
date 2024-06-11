import * as Blockly from 'blockly';

export const javaGenerator = new Blockly.Generator('Java');

javaGenerator['controls_if'] = function (block) {
  const n = 0;
  let code = '', branchCode, conditionCode;
  do {
    conditionCode = javaGenerator.valueToCode(block, 'IF' + n, javaGenerator.ORDER_NONE) || 'false';
    branchCode = javaGenerator.statementToCode(block, 'DO' + n) || '';
    code += (n > 0 ? ' else ' : '') + 'if (' + conditionCode + ') {\n' + branchCode + '}';
    n++;
  } while (block.getInput('IF' + n));
  if (block.getInput('ELSE')) {
    branchCode = javaGenerator.statementToCode(block, 'ELSE') || '';
    code += ' else {\n' + branchCode + '}';
  }
  return code + '\n';
};

javaGenerator['logic_compare'] = function (block) {
  const OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  const operator = OPERATORS[block.getFieldValue('OP')];
  const argument0 = javaGenerator.valueToCode(block, 'A', javaGenerator.ORDER_RELATIONAL) || '0';
  const argument1 = javaGenerator.valueToCode(block, 'B', javaGenerator.ORDER_RELATIONAL) || '0';
  const code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, javaGenerator.ORDER_RELATIONAL];
};

javaGenerator['math_number'] = function (block) {
  const code = Number(block.getFieldValue('NUM'));
  return [code, javaGenerator.ORDER_ATOMIC];
};

javaGenerator['text_print'] = function (block) {
    const argument0 = javaGenerator.valueToCode(block, 'TEXT', javaGenerator.ORDER_NONE) || '""';
    return 'System.out.println(' + argument0 + ');\n';
  };

javaGenerator['variables_get'] = function (block) {
  const varName = javaGenerator.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return [varName, javaGenerator.ORDER_ATOMIC];
};

javaGenerator['variables_set'] = function (block) {
  const varName = javaGenerator.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  const argument0 = javaGenerator.valueToCode(block, 'VALUE', javaGenerator.ORDER_ASSIGNMENT) || '0';
  return varName + ' = ' + argument0 + ';\n';
};

// Add more block definitions here as needed.

export default javaGenerator;
