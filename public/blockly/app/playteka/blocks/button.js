// the button block with 0 as lower limit and 1023 as upper limit
Blockly.Blocks['button_device'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(120);
    this.appendDummyInput()
    .appendField("Button: name")
    .appendField(new Blockly.FieldTextInput("button"), "var");
    this.appendValueInput("pin")
    .setCheck("Number")
    .appendField(" pin");
    this.setInputsInline(true);
    this.setOutput(true, "device_type");
    this.setTooltip('');
}
};

Blockly.JavaScript['button_device'] = function(block) {
    var value_pin = Blockly.JavaScript.valueToCode(block, 'pin', Blockly.JavaScript.ORDER_ATOMIC);
    var text_var = block.getFieldValue('var');
    
    //push the button variable into the led_var_set for the dropdown menu
    all_devices.button.push(text_var);
    var inside_name = all_devices.create_inside_name(text_var);
    all_devices.button_dropdown.push([text_var,inside_name]);
    
    //Assemble a string like "sensor: { driver: 'button', pin: 1,"
    //in upper level connection block, a string like "connection:arduino}" will be appended
    var code = inside_name + ": { driver: 'button', pin: " + value_pin +",";
    
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


// button isPressed block to test whether or not the button is pressed
Blockly.Blocks['button_isPressed_method'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(230);
    this.appendDummyInput()
    .appendField("Button:")
    .appendField(new Blockly.FieldDropdown(all_devices.button_dropdown), "var")
    .appendField("is pressed");
    this.setOutput(true, "Boolean");
    this.setTooltip('');
}
};

Blockly.JavaScript['button_isPressed_method'] = function(block) {
    var button_var = block.getFieldValue('var');
    // TODO: Assemble JavaScript into code variable.
    var code = "my." + button_var + ".isPressed()" ;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

// event triggered when button is pushed
Blockly.Blocks['button_push_event'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(330);
    this.appendDummyInput()
    .appendField("Button: name")
    .appendField(new Blockly.FieldDropdown(all_devices.button_dropdown), "var")
    .appendField("pushed");
    this.appendStatementInput("PROGRAM")
    .appendField("do");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
}
};

Blockly.JavaScript['button_push_event'] = function(block) {
    var dropdown_var = block.getFieldValue('var');
    var statements = Blockly.JavaScript.statementToCode(block, 'PROGRAM');
    
    //Assemble JavaScript into code. eg: my.button.on('push', function() { ...}
    var code = "my." + dropdown_var + ".on('push', function() { \n";
    code = code + statements;
    code = code + "});\n"
    
    return code;
};



// event triggered when button is released
Blockly.Blocks['button_release_event'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(330);
    this.appendDummyInput()
    .appendField("Button: name")
    .appendField(new Blockly.FieldDropdown(all_devices.button_dropdown), "var")
    .appendField("released");
    this.appendStatementInput("PROGRAM")
    .appendField("do");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
}
};

Blockly.JavaScript['button_release_event'] = function(block) {
    var dropdown_var = block.getFieldValue('var');
    var statements = Blockly.JavaScript.statementToCode(block, 'PROGRAM');
    
    //Assemble JavaScript into code. eg: my.button.on('release', function() { ...}
    var code = "my." + dropdown_var + ".on('release', function() { \n";
    code = code + statements;
    code = code + "});\n"
    
    return code;
};
