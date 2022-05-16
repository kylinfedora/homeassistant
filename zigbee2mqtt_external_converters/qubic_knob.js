const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const extend = require('zigbee-herdsman-converters/lib/extend');
const e = exposes.presets;
const ea = exposes.access;
const fzLocal = {
	command_move: {
        cluster: 'genAnalogInput',
        type: ['attributeReport', 'readResponse'],
        convert: (model, msg, publish, options, meta) => {
			if (msg.data['presentValue']==0) return;
            const direction = msg.data['presentValue'] < 0 ? 'left' : 'right';			
            return {action: `${direction}`, action_rate: Math.floor(msg.data['presentValue']*45)};
        },
    },
    qubic_click: {
        cluster: 'genMultistateInput',
        type: ['attributeReport', 'readResponse'],
        convert: (model, msg, publish, options, meta) => {
            const clickMapping = {1: 'single', 2: 'double'};
            return {action: clickMapping[msg.data['presentValue']]};
        },
    },	
};

const definition  = {
		zigbeeModel: ['qubic_knob'],
		model: 'SO12',
		vendor: 'qubic',
		description: '[配置链接](https://gitee.com/linoul/zigbee2mqtt_external_converters)',
        fromZigbee: [fz.ignore_basic_report, fz.battery, fzLocal.command_move,fzLocal.qubic_click],
        exposes: [e.battery(),e.action(['single', 'double', 'left', 'right']), e.angle('action_rate'), e.battery_voltage()],
        toZigbee: [],
	 icon: 'data:image/png;base64,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',	
};

module.exports = definition;
