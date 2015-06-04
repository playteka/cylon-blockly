// the pin block
Blockly.Blocks['pin_device'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(120);
    this.appendValueInput("pin")
    .setCheck("Number")
    .appendField("pin: name")
    .appendField(new Blockly.FieldTextInput("pin"), "var")
    .appendField("pin");
    this.setInputsInline(true);
    this.setOutput(true, "device_type");
    this.setTooltip('');
}
};

Blockly.JavaScript['pin_device'] = function(block) {
    var value_pin = Blockly.JavaScript.valueToCode(block, 'pin', Blockly.JavaScript.ORDER_ATOMIC);
    var text_pin_var = block.getFieldValue('var');
    
    //push the pin variable into the pin_var_set for the dropdown menu o
    all_devices.pin.push(text_pin_var);
    var inside_name = all_devices.create_inside_name(text_pin_var);
    all_devices.pin_dropdown.push([text_pin_var,inside_name]);
    
    //Assemble a string like "pin1: { driver: 'direct-pin', pin: 13,", in upper level connection block, a string like "connection:arduino}" will be appended
    var code = inside_name + ": { driver: 'direct-pin', pin: " + value_pin + ",";
    
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


// pin digital write method
Blockly.Blocks['pin_digitalWrite_method'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(230);
    this.appendDummyInput()
    .appendField("Pin:")
    .appendField(new Blockly.FieldDropdown(all_devices.pin_dropdown), "var");
    this.appendValueInput("value")
    .appendField("digital write value");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
}
};

Blockly.JavaScript['pin_digitalWrite_method'] = function(block) {
    var dropdown_var = block.getFieldValue('var');
    var value = Blockly.JavaScript.valueToCode(block, 'value', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = "my." + dropdown_var + ".digitalWrite(" + value + "); \n" ;
    return code;
};

// pin analog write method
Blockly.Blocks['pin_analogWrite_method'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(230);
    this.appendDummyInput()
    .appendField("Pin:")
    .appendField(new Blockly.FieldDropdown(all_devices.pin_dropdown), "var");
    this.appendValueInput("value")
    .appendField("analog write value");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
}
};

Blockly.JavaScript['pin_analogWrite_method'] = function(block) {
    var dropdown_var = block.getFieldValue('var');
    var value = Blockly.JavaScript.valueToCode(block, 'value', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = "my." + dropdown_var + ".analogWrite(" + value + "); \n" ;
    return code;
};


/* pin digital read block
 Blockly.Blocks['pin_digitalRead_method'] = {
 init: function() {
 this.setHelpUrl('http://www.example.com/');
 this.setColour(230);
 this.appendDummyInput()
 .appendField("Pin:")
 .appendField(new Blockly.FieldDropdown(all_devices.analog_dropdown), "var")
 .appendField("digital read");
 this.setOutput(true, "Number");
 this.setTooltip('');
 }
 };
 
 Blockly.JavaScript['analog_read_method'] = function(block) {
 var analog_var = block.getFieldValue('var');
 // TODO: Assemble JavaScript into code variable.
 var code = "my." + analog_var + ".analogRead()" ;
 return [code, Blockly.JavaScript.ORDER_ATOMIC];
 };  */
