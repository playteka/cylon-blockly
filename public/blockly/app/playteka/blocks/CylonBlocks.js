//arduino board block based on cylon.js
Blockly.Blocks['main_controller'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(230);
    
    this.appendValueInput('CONNECTION0')
    .appendField("connections")
    .setCheck("connection_type");
    
    this.appendStatementInput("PROGRAM")
    .appendField("program");
    
    this.setMutator(new Blockly.Mutator(['connections_create_with_item']));
    this.itemCount_ = 1;
    
    this.setTooltip('');
},
mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
},
    /**
     * Parse XML to restore the list inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
domToMutation: function(xmlElement) {
    for (var x = 0; x < this.itemCount_; x++) {
        this.removeInput('CONNECTION' + x);
    }
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    
    for (var x = 0; x < this.itemCount_; x++) {
        var input = this.appendValueInput('CONNECTION' + x).setCheck("connection_type");
        this.moveInputBefore("CONNECTION"+x, "PROGRAM");
        if (x == 0) {
            input.appendField("connections");
        }
    }
    if (this.itemCount_ == 0) {
        this.appendDummyInput('EMPTY')
        .appendField("no connection");
        this.moveInputBefore("EMPTY", "PROGRAM");
    }
},
    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
decompose: function(workspace) {
    var containerBlock = Blockly.Block.obtain(workspace, 'connections_create_with_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var x = 0; x < this.itemCount_; x++) {
        var itemBlock = Blockly.Block.obtain(workspace, 'connections_create_with_item');
        itemBlock.initSvg();
        connection.connect(itemBlock.previousConnection);
        connection = itemBlock.nextConnection;
    }
    return containerBlock;
},
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
compose: function(containerBlock) {
    // Disconnect all input blocks and remove all inputs.
    if (this.itemCount_ == 0) {
        this.removeInput('EMPTY');
    } else {
        for (var x = this.itemCount_ - 1; x >= 0; x--) {
            this.removeInput('CONNECTION' + x);
        }
    }
    this.itemCount_ = 0;
    
    // Rebuild the block's inputs.
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    while (itemBlock) {
        var input = this.appendValueInput('CONNECTION' + this.itemCount_).setCheck("connection_type");
        this.moveInputBefore('CONNECTION' + this.itemCount_ , "PROGRAM");
        if (this.itemCount_ == 0) {
            input.appendField("connections");
        }
        // Reconnect any child blocks.
        if (itemBlock.valueConnection_) {
            input.connection.connect(itemBlock.valueConnection_);
        }
        this.itemCount_++;
        itemBlock = itemBlock.nextConnection &&
        itemBlock.nextConnection.targetBlock();
    }
    if (this.itemCount_ == 0) {
        this.appendDummyInput('EMPTY')
        .appendField("no connection");
        this.moveInputBefore("EMPTY", "PROGRAM");
    }
    
},
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var x = 0;
    while (itemBlock) {
        var input = this.getInput('CONNECTION' + x);
        itemBlock.valueConnection_ = input && input.connection.targetConnection;
        x++;
        itemBlock = itemBlock.nextConnection &&
        itemBlock.nextConnection.targetBlock();
    }
}
};

Blockly.Blocks['connections_create_with_container'] = {
    /**
     * Mutator block for list container.
     * @this Blockly.Block
     */
init: function() {
    this.setColour(260);
    this.appendDummyInput()
    .appendField(Blockly.Msg.LISTS_CREATE_WITH_CONTAINER_TITLE_ADD);
    this.appendStatementInput('STACK');
    this.setTooltip('');
    this.contextMenu = false;
}
};

Blockly.Blocks['connections_create_with_item'] = {
    /**
     * Mutator bolck for adding items.
     * @this Blockly.Block
     */
init: function() {
    this.setColour(260);
    this.appendDummyInput()
    .appendField("connection");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    //this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_ITEM_TOOLTIP);
    this.contextMenu = false;
}
};


var device_definition_list;

Blockly.JavaScript['main_controller'] = function(block) {
    
    //initiate device_definition_list
    device_definition_list = new Array();
    
    // get program statements
    var program_statements = Blockly.JavaScript.statementToCode(block, 'PROGRAM');
    
    // assemble the connections
    var connection_list = new Array();
    for (var n = 0; n < block.itemCount_; n++) {
        var connection = Blockly.JavaScript.valueToCode(block, 'CONNECTION' + n, Blockly.JavaScript.ORDER_COMMA);
        if (connection) {
            connection_list.push(connection);
        };
    }
    var connections = "{\n" + connection_list.join(",\n") +"\n}";
    
    //assemble devices
    var devices = "{\n" + device_definition_list.join(",\n") +"\n}";
    
    //assemble code
    var code = "var Cylon = require('cylon'); \n\n";
    code = code + "Cylon.robot({ \n";
    code = code + "connections:" + connections + ",\n";
    code = code + "devices:" + devices + ",\n";
    code = code + "work: function(my) { \n";
    code = code + program_statements +"}\n";
    code = code + "}).start();\n" ;
    
    code = code + "\nprocess.on('message', function(m) {\n";
    code = code + "  console.log('worker got message:', m); \n";
    code = code + "  process.exit();\n";
    code = code + "});";
    
    return code;
};





Blockly.Blocks['arduino_connection'] = {
    /**
     * Block for creating a list with any number of elements of any type.
     * @this Blockly.Block
     */
init: function() {
    this.setColour(290);
    
    this.appendDummyInput("ARDUINO")
    .appendField("arduino");
    this.appendDummyInput("NAME")
    .appendField("name")
    .appendField(new Blockly.FieldTextInput("arduino"), "name");
    this.appendDummyInput("SERIAL_PORT")
    .appendField("port")
    .appendField(new Blockly.FieldTextInput("COM1"), "port");
    
    this.appendValueInput('DEVICE0')
    .appendField("device list")
    .setCheck("device_type");
    this.appendValueInput('DEVICE1')
    .setCheck("device_type");
    this.setOutput(true, 'connection_type');
    this.setMutator(new Blockly.Mutator(['device_list_create_with_item']));
    //this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_TOOLTIP);
    this.itemCount_ = 2;
},
    /**
     * Create XML to represent list inputs.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
},
    /**
     * Parse XML to restore the list inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
domToMutation: function(xmlElement) {
    for (var x = 0; x < this.itemCount_; x++) {
        this.removeInput('DEVICE' + x);
    }
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    for (var x = 0; x < this.itemCount_; x++) {
        var input = this.appendValueInput('DEVICE' + x).setCheck("device_type");
        if (x == 0) {
            input.appendField("device list");
        }
    }
    if (this.itemCount_ == 0) {
        this.appendDummyInput('EMPTY')
        .appendField("no connection");
    }
},
    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
decompose: function(workspace) {
    var containerBlock =
    Blockly.Block.obtain(workspace, 'device_list_create_with_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var x = 0; x < this.itemCount_; x++) {
        var itemBlock = Blockly.Block.obtain(workspace, 'device_list_create_with_item');
        itemBlock.initSvg();
        connection.connect(itemBlock.previousConnection);
        connection = itemBlock.nextConnection;
    }
    return containerBlock;
},
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
compose: function(containerBlock) {
    // Disconnect all input blocks and remove all inputs.
    if (this.itemCount_ == 0) {
        this.removeInput('EMPTY');
    } else {
        for (var x = this.itemCount_ - 1; x >= 0; x--) {
            this.removeInput('DEVICE' + x);
        }
    }
    this.itemCount_ = 0;
    // Rebuild the block's inputs.
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    while (itemBlock) {
        var input = this.appendValueInput('DEVICE' + this.itemCount_).setCheck("device_type");
        if (this.itemCount_ == 0) {
            input.appendField("device list");
        }
        // Reconnect any child blocks.
        if (itemBlock.valueConnection_) {
            input.connection.connect(itemBlock.valueConnection_);
        }
        this.itemCount_++;
        itemBlock = itemBlock.nextConnection &&
        itemBlock.nextConnection.targetBlock();
    }
    if (this.itemCount_ == 0) {
        this.appendDummyInput('EMPTY')
        .appendField("no connection");
    }
},
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var x = 0;
    while (itemBlock) {
        var input = this.getInput('DEVICE' + x);
        itemBlock.valueConnection_ = input && input.connection.targetConnection;
        x++;
        itemBlock = itemBlock.nextConnection &&
        itemBlock.nextConnection.targetBlock();
    }
}
};

Blockly.JavaScript['arduino_connection'] = function(block) {
    
    var arduino_name = block.getFieldValue('name');
    var arduino_port = block.getFieldValue('port');
    
    
    // complete assembling device definition and push it into the device_definition_list
    for (var n = 0; n < block.itemCount_; n++) {
        var device = Blockly.JavaScript.valueToCode(block, 'DEVICE' + n, Blockly.JavaScript.ORDER_COMMA);
        if (device) {
            device = device + " connection: '" + arduino_name +"' }";
            device_definition_list.push(device);
        };
    }
    
    //assemble connection code, eg: arduino: { adaptor: 'firmata', port: 'COM1'}
    code = arduino_name + ": { adaptor: 'firmata', port: '" + arduino_port + "'}";
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Blocks['device_list_create_with_container'] = {
    /**
     * Mutator block for list container.
     * @this Blockly.Block
     */
init: function() {
    this.setColour(260);
    this.appendDummyInput()
    .appendField(Blockly.Msg.LISTS_CREATE_WITH_CONTAINER_TITLE_ADD);
    this.appendStatementInput('STACK');
    this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_CONTAINER_TOOLTIP);
    this.contextMenu = false;
}
};

Blockly.Blocks['device_list_create_with_item'] = {
    /**
     * Mutator bolck for adding items.
     * @this Blockly.Block
     */
init: function() {
    this.setColour(260);
    this.appendDummyInput()
    .appendField("device");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    //this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_ITEM_TOOLTIP);
    this.contextMenu = false;
}
};





// every block based on cylon.js
Blockly.Blocks['every_event'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(330);
    this.appendValueInput("interval")
    .setCheck("Number")
    .appendField("every");
    this.appendDummyInput()
    .appendField("seconds");
    this.appendStatementInput("action")
    .appendField("do");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
}
};

Blockly.JavaScript['every_event'] = function(block) {
    var value_interval = Blockly.JavaScript.valueToCode(block, 'interval', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_action = Blockly.JavaScript.statementToCode(block, 'action');
    // TODO: Assemble JavaScript into code variable.
    var code = "every((" + value_interval + ").second(), function() { \n";
    code = code + statements_action;
    code = code + "});\n"
    return code;
};

//print block for doing console.log()
Blockly.Blocks['print_method'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(230);
    this.appendValueInput("NAME")
    //.setCheck("null")
    .appendField("print log");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
}
};

Blockly.JavaScript['print_method'] = function(block) {
    var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = 'console.log('+value_name+');\n';
    return code;
};





// all devices defined in the workspace are managed here.
var all_devices = {
init: function(){
    //analog
    this.analog.length = 0;
    this.analog_dropdown.length = 0;
    //digital
    this.digital.length = 0;
    this.digital_dropdown.length = 0;
    //button
    this.button.length = 0;
    this.button_dropdown.length = 0;
    //led
    this.led.length = 0;
    this.led_dropdown.length = 0;
    //pin
    this.pin.length = 0;
    this.pin_dropdown.length = 0;
    //RGBled
    this.RGBled.length = 0;
    this.RGBled_dropdown.length = 0;
    //servo
    this.servo.length = 0;
    this.servo_dropdown.length = 0;
    
},
append: function(){
    //analog
    if (this.analog.length == 0) { this.analog.push('analog'); }
    if (this.analog_dropdown.length == 0) { this.analog_dropdown.push(['analog', 'analog']); }
    //digital
    if (this.digital.length == 0) { this.digital.push('digital'); }
    if (this.digital_dropdown.length == 0) { this.digital_dropdown.push(['digital', 'digital']); }
    //button
    if (this.button.length == 0) { this.button.push('button'); }
    if (this.button_dropdown.length == 0) { this.button_dropdown.push(['button','button']); }
    //led
    if (this.led.length == 0) { this.led.push('led'); }
    if (this.led_dropdown.length == 0) { this.led_dropdown.push(['led','led']); }
    //pin
    if (this.pin.length == 0) { this.pin.push('pin'); }
    if (this.pin_dropdown.length == 0) { this.pin_dropdown.push(['pin','pin']); }
    //RGBled
    if (this.RGBled.length == 0) { this.RGBled.push('led'); }
    if (this.RGBled_dropdown.length == 0) { this.RGBled_dropdown.push(['RGBled','RGBled']); }
    //servo
    if (this.servo.length == 0) { this.servo.push('servo'); }
    if (this.servo_dropdown.length == 0) { this.servo_dropdown.push(['servo','servo']); }
},
create_inside_name: function(outside_name) {
    //return outside_name + "_inside"
    return Blockly.JavaScript.variableDB_.getName(outside_name, Blockly.Variables.NAME_TYPE);
}
};
//analog
all_devices.analog = new Array('analog');
all_devices.analog_dropdown = new Array(['analog', 'analog']);
//digital
all_devices.digital = new Array('digital');
all_devices.digital_dropdown = new Array(['digital', 'digital']);
//button
all_devices.button = new Array('button');
all_devices.button_dropdown = new Array(['button','button']);
//led
all_devices.led = new Array('led');
all_devices.led_dropdown = new Array(['led','led']);
//pin
all_devices.pin = new Array('pin');
all_devices.pin_dropdown = new Array(['pin','pin']);
//RGBled
all_devices.RGBled = new Array('RGBled');
all_devices.RGBled_dropdown = new Array(['RGBled','RGBled']);
//servo
all_devices.servo = new Array('servo');
all_devices.servo_dropdown = new Array(['servo','servo']);





