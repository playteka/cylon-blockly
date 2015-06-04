// the analog sensor block with 0 as lower limit and 1023 as upper limit
Blockly.Blocks['analog_device'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(120);
    this.appendDummyInput()
    .appendField("Analog: name")
    .appendField(new Blockly.FieldTextInput("analog"), "var");
    this.appendValueInput("pin")
    .setCheck("Number")
    .appendField(" pin");
    this.setInputsInline(true);
    this.setOutput(true, "device_type");
    this.setTooltip('');
}
};

Blockly.JavaScript['analog_device'] = function(block) {
    var value_pin = Blockly.JavaScript.valueToCode(block, 'pin', Blockly.JavaScript.ORDER_ATOMIC);
    var text_var = block.getFieldValue('var');
    
    //push the analog variable into the led_var_set for the dropdown menu
    all_devices.analog.push(text_var);
    var inside_name = all_devices.create_inside_name(text_var);
    all_devices.analog_dropdown.push([text_var,inside_name]);
    
    //Assemble a string like "sensor: { driver: 'analog-sensor', pin: 1, lowerLimit: 0, lowerLimit: 1023,"
    //in upper level connection block, a string like "connection:arduino}" will be appended
    var code = inside_name + ": { driver: 'analog-sensor', pin: " + value_pin +", lowerLimit: 0, upperLimit: 1023,";
    
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


//the analog sensor block with lower limit and upper limit
Blockly.Blocks['analog_limit_device'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(120);
    this.appendDummyInput()
    .appendField("Analog: name")
    .appendField(new Blockly.FieldTextInput("analog"), "var");
    this.appendValueInput("pin")
    .setCheck("Number")
    .appendField(" pin");
    this.appendValueInput("lowerLimit")
    .setCheck("Number")
    .appendField("lower limit");
    this.appendValueInput("upperLimit")
    .setCheck("Number")
    .appendField("upper limit");
    this.setInputsInline(true);
    this.setOutput(true, "device_type");
    this.setTooltip('');
}
};

Blockly.JavaScript['analog_limit_device'] = function(block) {
    var value_pin = Blockly.JavaScript.valueToCode(block, 'pin', Blockly.JavaScript.ORDER_ATOMIC);
    var value_lowerLimit = Blockly.JavaScript.valueToCode(block, 'lowerLimit', Blockly.JavaScript.ORDER_ATOMIC);
    var value_upperLimit = Blockly.JavaScript.valueToCode(block, 'upperLimit', Blockly.JavaScript.ORDER_ATOMIC);
    var text_var = block.getFieldValue('var');
    
    //push the analog variable into the led_var_set for the dropdown menu
    all_devices.analog.push(text_var);
    var inside_name = all_devices.create_inside_name(text_var);
    all_devices.analog_dropdown.push([text_var,inside_name]);
    
    //Assemble a string like "sensor: { driver: 'analog-sensor', pin: 1, lowerLimit: 100, lowerLimit: 900,"
    //in upper level connection block, a string like "connection:arduino}" will be appended
    var code = inside_name + ": { driver: 'analog-sensor', pin: " + value_pin +", lowerLimit: " + value_lowerLimit + ", upperLimit: " + value_upperLimit + ",";
    
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

// analog read block
Blockly.Blocks['analog_read_method'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(230);
    this.appendDummyInput()
    .appendField("Analog:")
    .appendField(new Blockly.FieldDropdown(all_devices.analog_dropdown), "var")
    .appendField("read");
    this.setOutput(true, "Number");
    this.setTooltip('');
}
};

Blockly.JavaScript['analog_read_method'] = function(block) {
    var analog_var = block.getFieldValue('var');
    // TODO: Assemble JavaScript into code variable.
    var code = "my." + analog_var + ".analogRead()" ;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


// event triggered when analog value changed
Blockly.Blocks['analog_read_event'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(330);
    this.appendDummyInput()
    .appendField("Analog: name")
    .appendField(new Blockly.FieldDropdown(all_devices.analog_dropdown), "var");
    this.appendDummyInput()
    .appendField("when recived new analog value");
    this.appendStatementInput("PROGRAM")
    .appendField("do");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
}
};

Blockly.JavaScript['analog_read_event'] = function(block) {
    var dropdown_var = block.getFieldValue('var');
    var statements = Blockly.JavaScript.statementToCode(block, 'PROGRAM');
    
    //Assemble JavaScript into code. eg: my.sensor.on('analogRead', function(val) { ...}
    var code = "my." + dropdown_var + ".on('analogRead', function(val) { \n";
    code = code + statements;
    code = code + "});\n"
    
    return code;
};


// event triggered when analog lowerLimit reached
Blockly.Blocks['analog_lowerLimit_event'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(330);
    this.appendDummyInput()
    .appendField("Analog: name")
    .appendField(new Blockly.FieldDropdown(all_devices.analog_dropdown), "var");
    this.appendDummyInput()
    .appendField("when smaller than lower limit");
    this.appendStatementInput("PROGRAM")
    .appendField("do");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
}
};

Blockly.JavaScript['analog_lowerLimit_event'] = function(block) {
    var dropdown_var = block.getFieldValue('var');
    var statements = Blockly.JavaScript.statementToCode(block, 'PROGRAM');
    
    //Assemble JavaScript into code. eg: my.sensor.on('lowerLimit', function(val) { ...}
    var code = "my." + dropdown_var + ".on('lowerLimit', function(val) { \n";
    code = code + statements;
    code = code + "});\n"
    
    return code;
};

// event triggered when analog upperLimit reached
Blockly.Blocks['analog_upperLimit_event'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(330);
    this.appendDummyInput()
    .appendField("Analog: name")
    .appendField(new Blockly.FieldDropdown(all_devices.analog_dropdown), "var");
    this.appendDummyInput()
    .appendField("when greater than upper limit");
    this.appendStatementInput("PROGRAM")
    .appendField("do");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
}
};

Blockly.JavaScript['analog_upperLimit_event'] = function(block) {
    var dropdown_var = block.getFieldValue('var');
    var statements = Blockly.JavaScript.statementToCode(block, 'PROGRAM');
    
    //Assemble JavaScript into code. eg: my.sensor.on('upperLimit', function(val) { ...}
    var code = "my." + dropdown_var + ".on('upperLimit', function(val) { \n";
    code = code + statements;
    code = code + "});\n"
    
    return code;
};

//analog value parameter used in analog event
Blockly.Blocks['analog_value_parameter'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(230);
    this.appendDummyInput()
    .appendField("analog value");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setTooltip('');
}
};

Blockly.JavaScript['analog_value_parameter'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'val';
    
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

