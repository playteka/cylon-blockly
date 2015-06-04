// the servo device block
Blockly.Blocks['servo_device'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(120);
    this.appendValueInput("pin")
    .setCheck("Number")
    .appendField("Servo: name")
    .appendField(new Blockly.FieldTextInput("servo"), "servo_var")
    .appendField("pin");
    this.setInputsInline(true);
    this.setOutput(true, "device_type");
    this.setTooltip('');
}
};

Blockly.JavaScript['servo_device'] = function(block) {
    var value_pin = Blockly.JavaScript.valueToCode(block, 'pin', Blockly.JavaScript.ORDER_ATOMIC);
    var text_servo_var = block.getFieldValue('servo_var');
    
    //push the servo variable into the arrays for the dropdown menu
    all_devices.servo.push(text_servo_var);
    var inside_name = all_devices.create_inside_name(text_servo_var);
    all_devices.servo_dropdown.push([text_servo_var,inside_name]);
    
    //Assemble a string like "servo1: { driver: 'servo', pin: 3,", in upper level connection block, a string like "connection:arduino}" will be appended
    var code = inside_name + ": { driver: 'servo', pin: " + value_pin +",";
    
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

// Returns the current angle of the servo
Blockly.Blocks['servo_currentAngle_method'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(230);
    this.appendDummyInput()
    .appendField("Servo:")
    .appendField(new Blockly.FieldDropdown(all_devices.servo_dropdown), "var")
    .appendField("current angle");
    this.setOutput(true, "Number");
    this.setTooltip('');
}
};

Blockly.JavaScript['servo_currentAngle_method'] = function(block) {
    var variable_servo_var = block.getFieldValue('var');
    // TODO: Assemble JavaScript into code variable.
    var code = "my." + variable_servo_var + ".currentAngle()" ;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


// Set angle of the servo to the specified value  to (0-180)
Blockly.Blocks['servo_angle_method'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(230);
    this.appendDummyInput()
    .appendField("Servo:")
    .appendField(new Blockly.FieldDropdown(all_devices.servo_dropdown), "var");
    this.appendValueInput("angle")
    .appendField("set angle");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
}
};

Blockly.JavaScript['servo_angle_method'] = function(block) {
    var dropdown_var = block.getFieldValue('var');
    var value_angle = Blockly.JavaScript.valueToCode(block, 'angle', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = "my." + dropdown_var + ".angle(" + value_angle + "); \n" ;
    return code;
};



// Given a servo angle, determines if it's safe or not, and returns a safe value
Blockly.Blocks['servo_safeAngle_method'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(230);
    this.appendDummyInput()
    .appendField("Servo:")
    .appendField(new Blockly.FieldDropdown(all_devices.servo_dropdown), "var");
    this.appendValueInput("angle")
    .appendField("get safe angle");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setTooltip('');
}
};

Blockly.JavaScript['servo_safeAngle_method'] = function(block) {
    var dropdown_var = block.getFieldValue('var');
    var value_angle = Blockly.JavaScript.valueToCode(block, 'angle', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = "my." + dropdown_var + ".safeAngle(" + value_angle + ")" ;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};





