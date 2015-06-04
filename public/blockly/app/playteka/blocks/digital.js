// the analog sensor block with 0 as lower limit and 1023 as upper limit
Blockly.Blocks['digital_device'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(120);
    this.appendDummyInput()
    .appendField("Digital: name")
    .appendField(new Blockly.FieldTextInput("digital"), "var");
    this.appendValueInput("pin")
    .setCheck("Number")
    .appendField(" pin");
    this.setInputsInline(true);
    this.setOutput(true, "device_type");
    this.setTooltip('');
}
};

Blockly.JavaScript['digital_device'] = function(block) {
    var value_pin = Blockly.JavaScript.valueToCode(block, 'pin', Blockly.JavaScript.ORDER_ATOMIC);
    var text_var = block.getFieldValue('var');
    
    //push the analog variable into the led_var_set for the dropdown menu
    all_devices.digital.push(text_var);
    var inside_name = all_devices.create_inside_name(text_var);
    all_devices.digital_dropdown.push([text_var,inside_name]);
    
    //Assemble a string like "sensor: { driver: 'digital-sensor', pin: 1, "
    //in upper level connection block, a string like "connection:arduino}" will be appended
    var code = inside_name + ": { driver: 'digital-sensor', pin: " + value_pin +",";
    
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


// analog read block
Blockly.Blocks['digital_read_method'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(230);
    this.appendDummyInput()
    .appendField("Digital:")
    .appendField(new Blockly.FieldDropdown(all_devices.digital_dropdown), "var")
    .appendField("read");
    this.setOutput(true, "Number");
    this.setTooltip('');
}
};

Blockly.JavaScript['digital_read_method'] = function(block) {
    var digital_var = block.getFieldValue('var');
    // TODO: Assemble JavaScript into code variable.
    var code = "my." + digital_var + ".digitalRead()" ;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


// event triggered when analog value changed
Blockly.Blocks['digital_change_event'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(330);
    this.appendDummyInput()
    .appendField("Digital: name")
    .appendField(new Blockly.FieldDropdown(all_devices.digital_dropdown), "var");
    this.appendDummyInput()
    .appendField("when recived new digital value");
    this.appendStatementInput("PROGRAM")
    .appendField("do");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
}
};

Blockly.JavaScript['digital_change_event'] = function(block) {
    var dropdown_var = block.getFieldValue('var');
    var statements = Blockly.JavaScript.statementToCode(block, 'PROGRAM');
    
    //Assemble JavaScript into code. eg: my.sensor.on('digitalChange', function(val) { ...}
    var code = "my." + dropdown_var + ".on('digitalChange', function(val) { \n";
    code = code + statements;
    code = code + "});\n"
    
    return code;
};

//digital value parameter used in analog event
Blockly.Blocks['digital_value_parameter'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(230);
    this.appendDummyInput()
    .appendField("digital value");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setTooltip('');
}
};

Blockly.JavaScript['digital_value_parameter'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'val';
    
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};